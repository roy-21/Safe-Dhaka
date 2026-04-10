// Safe Dhaka — Community Report Endpoint
import { NextRequest, NextResponse } from 'next/server'
import { submitReport } from '@/lib/community'

export async function POST(req: NextRequest) {
  try {
    const { report_type, location, description } = await req.json()

    const VALID_TYPES = ['jam', 'flood', 'vip', 'accident', 'safe']
    if (!report_type || !location || !VALID_TYPES.includes(report_type)) {
      return NextResponse.json(
        { error: 'Valid report_type (jam|flood|vip|accident|safe) and location are required' },
        { status: 400 }
      )
    }

    await submitReport(report_type, location, description || '')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Report submission error:', error)
    return NextResponse.json(
      { error: 'Failed to submit report' },
      { status: 500 }
    )
  }
}
