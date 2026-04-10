// Safe Dhaka — Main AI Chat Endpoint
// AI Chain: Groq (primary, free) → Gemini (fallback) → Local Knowledge (always works)
import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai'
import { getDhakaWeather } from '@/lib/weather'
import { getActiveAlerts } from '@/lib/alerts'
import { getRecentReports } from '@/lib/community'
import { buildSystemPrompt, EMERGENCY_PROMPT } from '@/lib/prompt-builder'
import { generateLocalResponse } from '@/lib/local-fallback'

const BANGLISH_KEYWORDS = [
  'ami', 'amar', 'kothay', 'jabo', 'jete', 'chai', 'theke',
  'apni', 'bhai', 'apa', 'dada', 'lagbe', 'koto', 'kemon',
  'mirpur', 'motijheel', 'gulshan', 'uttara', 'dhanmondi', 'banani'
]

function detectLanguage(text: string): 'bangla' | 'english' {
  if (/[\u0980-\u09FF]/.test(text)) return 'bangla'
  const lower = text.toLowerCase()
  if (BANGLISH_KEYWORDS.some(k => lower.includes(k))) return 'bangla'
  return 'english'
}

function detectBudget(text: string): number | undefined {
  const matchEn = text.match(/(\d+)\s*(taka|tk|bdt)/i)
  if (matchEn) return parseInt(matchEn[1])
  const matchBn = text.match(/(\d+)\s*টাকা/)
  if (matchBn) return parseInt(matchBn[1])
  const matchBnDigits = text.match(/([০-৯]+)\s*টাকা/)
  if (matchBnDigits) {
    const arabic = matchBnDigits[1].split('').map(d => '০১২৩৪৫৬৭৮৯'.indexOf(d)).join('')
    return parseInt(arabic)
  }
  return undefined
}

function isRushHour(): boolean {
  const now = new Date()
  const bd = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Dhaka' }))
  const h = bd.getHours()
  return (h >= 7 && h <= 9) || (h >= 17 && h <= 19)
}

// ── GROQ CLIENT (primary — llama-3.3-70b, free tier) ─────
function getGroqClient(): Groq | null {
  const key = process.env.GROQ_API_KEY
  if (!key || key.trim() === '') return null
  return new Groq({ apiKey: key })
}

// ── GEMINI CLIENT (fallback) ──────────────────────────────
function getGeminiClient(): GoogleGenerativeAI | null {
  const key = process.env.GEMINI_API_KEY
  if (!key || key === 'your_gemini_key_here') return null
  return new GoogleGenerativeAI(key)
}

const SAFETY_SETTINGS = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
]

export async function POST(req: NextRequest) {
  try {
    const { message, conversationHistory = [], isEmergency = false } = await req.json()

    if (!message || !message.trim()) {
      return NextResponse.json({
        reply: 'Please tell me where you want to go.\nFor example: "Mirpur 10 to Motijheel" or "মিরপুর থেকে মতিঝিল কীভাবে যাবো?"'
      })
    }

    // Collect live data in parallel
    const [weather, alerts, communityReports] = await Promise.all([
      getDhakaWeather(),
      getActiveAlerts(),
      getRecentReports()
    ])

    const now = new Date()
    const ctx = {
      isRaining: weather.isRaining,
      rainDescription: weather.description,
      temperature: weather.temperature,
      currentTime: now.toLocaleTimeString('en-US', { timeZone: 'Asia/Dhaka', hour: '2-digit', minute: '2-digit', hour12: true }),
      currentDay: now.toLocaleDateString('en-US', { timeZone: 'Asia/Dhaka', weekday: 'long' }),
      isRushHour: isRushHour(),
      isFriday: now.getDay() === 5,
      activeAlerts: alerts,
      communityReports,
      userBudget: detectBudget(message),
      userLanguage: detectLanguage(message) as 'english' | 'bangla'
    }

    const systemPrompt = isEmergency ? EMERGENCY_PROMPT : buildSystemPrompt(ctx)
    const userMsg = message.trim()

    // ── 1. TRY GROQ (primary — llama-3.3-70b-versatile) ───
    const groq = getGroqClient()
    if (groq) {
      try {
        const history = conversationHistory.slice(-6).map((m: { role: string; content: string }) => ({
          role: m.role === 'model' ? 'assistant' : 'user' as 'assistant' | 'user',
          content: m.content || (m as { parts?: { text: string }[] }).parts?.[0]?.text || ''
        }))

        const completion = await groq.chat.completions.create({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemPrompt },
            ...history,
            { role: 'user', content: userMsg }
          ],
          temperature: 0.4,
          max_tokens: 800,
          top_p: 0.8,
        })

        const reply = completion.choices[0]?.message?.content
        if (reply && reply.trim()) {
          return NextResponse.json({
            reply,
            meta: {
              weather: { isRaining: weather.isRaining, floodRisk: weather.floodRisk },
              alertCount: alerts.length,
              reportCount: communityReports.length,
              timestamp: now.toISOString(),
              source: 'groq',
              model: 'llama-3.3-70b'
            }
          })
        }
      } catch (err: unknown) {
        console.warn('Groq failed:', (err as Error).message?.slice(0, 100))
      }
    }

    // ── 2. TRY GEMINI (fallback) ───────────────────────────
    const genAI = getGeminiClient()
    if (genAI) {
      const models = ['gemini-2.0-flash', 'gemini-2.0-flash-lite']
      for (const modelName of models) {
        try {
          const model = genAI.getGenerativeModel({
            model: modelName,
            systemInstruction: systemPrompt,
            generationConfig: { temperature: 0.4, maxOutputTokens: 800, topP: 0.8 },
            safetySettings: SAFETY_SETTINGS,
          })
          const history = conversationHistory.slice(-6).map((m: { role: string; parts: { text: string }[] }) => ({
            role: m.role === 'model' ? 'model' : 'user',
            parts: m.parts
          }))
          const chat = model.startChat({ history })
          const result = await chat.sendMessage(userMsg)
          const reply = result.response.text()
          if (reply?.trim()) {
            return NextResponse.json({
              reply,
              meta: {
                weather: { isRaining: weather.isRaining, floodRisk: weather.floodRisk },
                alertCount: alerts.length,
                reportCount: communityReports.length,
                timestamp: now.toISOString(),
                source: 'gemini',
                model: modelName
              }
            })
          }
        } catch (err: unknown) {
          const msg = (err as Error).message || ''
          console.warn(`Gemini ${modelName} failed:`, msg.slice(0, 80))
          if (msg.includes('429') || msg.includes('quota')) continue
          break
        }
      }
    }

    // ── 3. LOCAL KNOWLEDGE FALLBACK (always works) ─────────
    console.log('Using local fallback for:', userMsg.slice(0, 50))
    const localReply = generateLocalResponse(userMsg, weather.isRaining, isRushHour())

    return NextResponse.json({
      reply: localReply,
      meta: {
        weather: { isRaining: weather.isRaining, floodRisk: weather.floodRisk },
        alertCount: alerts.length,
        reportCount: communityReports.length,
        timestamp: now.toISOString(),
        source: 'local'
      }
    })

  } catch (error) {
    console.error('Safe Dhaka API error:', error)
    return NextResponse.json(
      { reply: 'Please try again. Quick tip: MRT Line 6 Mirpur→Motijheel = 22 min, 50 taka.' },
      { status: 200 }
    )
  }
}
