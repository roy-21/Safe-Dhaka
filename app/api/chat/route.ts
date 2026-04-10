// Safe Dhaka — Main AI Chat Endpoint
// Uses official @google/generative-ai SDK with smart local fallback
import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai'
import { getDhakaWeather } from '@/lib/weather'
import { getActiveAlerts } from '@/lib/alerts'
import { getRecentReports } from '@/lib/community'
import { buildSystemPrompt, EMERGENCY_PROMPT } from '@/lib/prompt-builder'
import { generateLocalResponse } from '@/lib/local-fallback'

// Bangla Unicode range + Banglish romanized keywords
const BANGLISH_KEYWORDS = [
  'ami', 'amar', 'kothay', 'jabo', 'jete', 'chai',
  'theke', 'apni', 'bhai', 'apa', 'dada', 'lagbe', 'koto', 'kemon',
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
  const bdTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Dhaka' }))
  const hour = bdTime.getHours()
  return (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)
}

// Initialize Gemini SDK
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey || apiKey === 'your_gemini_key_here') return null
  return new GoogleGenerativeAI(apiKey)
}

// Safety settings — allow travel/geography content
const SAFETY_SETTINGS = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
]

export async function POST(req: NextRequest) {
  try {
    const { message, conversationHistory = [], isEmergency = false } = await req.json()

    // Input validation
    if (!message || !message.trim()) {
      return NextResponse.json({
        reply: 'Please tell me where you want to go.\nFor example: "Mirpur 10 to Motijheel" or "মিরপুর থেকে মতিঝিল কীভাবে যাবো?"'
      })
    }

    // Collect live data in parallel — always fast with individual timeouts
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

    // ── TRY GEMINI FIRST ──────────────────────────────────────
    const genAI = getGeminiClient()

    if (genAI) {
      const models = ['gemini-2.0-flash', 'gemini-2.0-flash-lite']

      for (const modelName of models) {
        try {
          const model = genAI.getGenerativeModel({
            model: modelName,
            systemInstruction: systemPrompt,
            generationConfig: {
              temperature: 0.4,
              maxOutputTokens: 800,
              topP: 0.8,
            },
            safetySettings: SAFETY_SETTINGS,
          })

          // Build chat history from conversation
          const history = conversationHistory.slice(-6).map((m: { role: string; parts: { text: string }[] }) => ({
            role: m.role === 'model' ? 'model' : 'user',
            parts: m.parts
          }))

          const chat = model.startChat({ history })
          const result = await chat.sendMessage(message.trim())
          const reply = result.response.text()

          if (!reply || reply.trim() === '') {
            console.warn(`${modelName} returned empty response`)
            continue
          }

          return NextResponse.json({
            reply,
            meta: {
              weather: { isRaining: weather.isRaining, floodRisk: weather.floodRisk },
              alertCount: alerts.length,
              reportCount: communityReports.length,
              timestamp: now.toISOString(),
              source: 'gemini'
            }
          })

        } catch (err: unknown) {
          const status = (err as { status?: number })?.status
          const message_err = (err as { message?: string })?.message || ''
          console.warn(`Gemini ${modelName} failed:`, status, message_err.slice(0, 100))
          // Continue to next model on quota/rate errors
          if (status === 429 || status === 503 || message_err.includes('quota') || message_err.includes('429')) {
            continue
          }
          break
        }
      }
    }

    // ── LOCAL FALLBACK — always gives useful Dhaka response ───
    console.log('Using local fallback for:', message.slice(0, 50))
    const localReply = generateLocalResponse(message, weather.isRaining, isRushHour())

    return NextResponse.json({
      reply: localReply,
      meta: {
        weather: { isRaining: weather.isRaining, floodRisk: weather.floodRisk },
        alertCount: alerts.length,
        reportCount: communityReports.length,
        timestamp: now.toISOString(),
        source: 'local' // Indicates fallback was used
      }
    })

  } catch (error) {
    console.error('Safe Dhaka API error:', error)
    return NextResponse.json(
      { reply: 'Please try again in a moment. If urgent: MRT Line 6 is Dhaka\'s fastest route. Bus 8 goes Mirpur→Motijheel for 10-20 taka.' },
      { status: 200 }
    )
  }
}
