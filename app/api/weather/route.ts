// SafeRoute Dhaka — Weather Status Endpoint
import { NextResponse } from 'next/server'
import { getDhakaWeather } from '@/lib/weather'

export async function GET() {
  try {
    const weather = await getDhakaWeather()
    return NextResponse.json(weather)
  } catch {
    return NextResponse.json(
      { isRaining: false, description: 'unknown', temperature: 30, humidity: 70, floodRisk: 'none' },
      { status: 200 }
    )
  }
}
