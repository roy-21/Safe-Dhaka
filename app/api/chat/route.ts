// SafeRoute Dhaka — Main AI Chat Endpoint
import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import { getDhakaWeather } from '@/lib/weather'
import { getActiveAlerts } from '@/lib/alerts'
import { getRecentReports } from '@/lib/community'
import { buildSystemPrompt, EMERGENCY_PROMPT } from '@/lib/prompt-builder'

function detectLanguage(text: string): 'bangla' | 'english' {
  const banglaPattern = /[\u0980-\u09FF]/
  return banglaPattern.test(text) ? 'bangla' : 'english'
}

function detectBudget(text: string): number | undefined {
  const match = text.match(/(\d+)\s*taka/i)
  if (match) return parseInt(match[1])
  const matchBangla = text.match(/(\d+)\s*টাকা/i)
  if (matchBangla) return parseInt(matchBangla[1])
  return undefined
}

function isRushHour(): boolean {
  const now = new Date()
  const bdTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Dhaka' }))
  const hour = bdTime.getHours()
  return (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)
}

export async function POST(req: NextRequest) {
  try {
    const { message, conversationHistory = [], isEmergency = false } = await req.json()

    // Collect all live data in parallel — never sequentially
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
      currentTime: now.toLocaleTimeString('en-BD', { timeZone: 'Asia/Dhaka', hour: '2-digit', minute: '2-digit' }),
      currentDay: now.toLocaleDateString('en-BD', { timeZone: 'Asia/Dhaka', weekday: 'long' }),
      isRushHour: isRushHour(),
      isFriday: now.getDay() === 5,
      activeAlerts: alerts,
      communityReports,
      userBudget: detectBudget(message),
      userLanguage: detectLanguage(message) as 'english' | 'bangla'
    }

    const systemPrompt = isEmergency
      ? EMERGENCY_PROMPT
      : buildSystemPrompt(ctx)

    // Build conversation history for multi-turn memory
    const messages = [
      ...conversationHistory.slice(-6), // Keep last 3 exchanges for context
      { role: 'user', parts: [{ text: message }] }
    ]

    // Models to try in order — each has its own quota
    const models = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.0-flash-lite']
    const maxRetries = 3

    let lastError: unknown = null

    for (const model of models) {
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          // Wait before retry (exponential backoff)
          if (attempt > 0) {
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)))
          }

          const geminiRes = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
              system_instruction: { parts: [{ text: systemPrompt }] },
              contents: messages,
              generationConfig: {
                temperature: 0.4,
                maxOutputTokens: 500,
                topP: 0.8
              }
            },
            { timeout: 15000 } // 15 second timeout
          )

          const reply = geminiRes.data.candidates[0].content.parts[0].text

          return NextResponse.json({
            reply,
            meta: {
              weather: { isRaining: weather.isRaining, floodRisk: weather.floodRisk },
              alertCount: alerts.length,
              reportCount: communityReports.length,
              timestamp: now.toISOString()
            }
          })
        } catch (err: unknown) {
          lastError = err
          const status = (err as { response?: { status?: number } })?.response?.status
          // Only retry on rate limit (429) or server error (5xx)
          if (status === 429 || (status && status >= 500)) {
            console.log(`Gemini ${model} attempt ${attempt + 1} failed (${status}), retrying...`)
            continue
          }
          // For other errors, break retry loop for this model
          break
        }
      }
    }

    // All retries exhausted
    const errStatus = (lastError as { response?: { status?: number } })?.response?.status
    const isRateLimit = errStatus === 429
    console.error('SafeRoute API - all Gemini attempts failed:', lastError)
    return NextResponse.json(
      { reply: isRateLimit
          ? 'SafeRoute AI is cooling down after many requests. Please wait 1 minute and try again. Meanwhile: if it is raining, use elevated roads like Gulshan Avenue. If budget is tight, Bus 8 (Mirpur-Motijheel) costs only 10-20 taka.'
          : 'I am having trouble checking live conditions right now. For safety, please delay travel if it is raining. Try again in 1 minute.'
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('SafeRoute API error:', error)
    return NextResponse.json(
      { reply: 'I am having trouble checking live conditions right now. For safety, please delay travel if it is raining. Try again in 1 minute.' },
      { status: 200 } // Never return 500 to user — always give a safe fallback
    )
  }
}
