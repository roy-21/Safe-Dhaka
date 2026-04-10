// SafeRoute Dhaka — Community Report Endpoint
import { NextRequest, NextResponse } from 'next/server'
import { submitReport } from '@/lib/community'

export async function POST(req: NextRequest) {
  try {
    const { report_type, location, description } = await req.json()

    if (!report_type || !location) {
      return NextResponse.json(
        { error: 'report_type and location are required' },
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
