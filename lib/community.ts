// SafeRoute Dhaka — Community Reports (Supabase)
import { createClient, SupabaseClient } from '@supabase/supabase-js'

function getSupabaseClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

  // Only create client if we have a valid URL (not placeholder)
  if (!url || !key || !url.startsWith('http')) {
    return null
  }

  try {
    return createClient(url, key)
  } catch {
    return null
  }
}

const supabase = getSupabaseClient()

export async function getRecentReports(): Promise<string[]> {
  if (!supabase) return []

  try {
    const { data } = await supabase
      .from('community_reports')
      .select('*')
      .gte('created_at', new Date(Date.now() - 45 * 60 * 1000).toISOString())
      .gte('upvotes', 3) // Only trust reports verified by 3+ users
      .order('created_at', { ascending: false })
      .limit(10)

    if (!data) return []

    return data.map((r: { report_type: string; location: string; description: string; upvotes: number }) =>
      `${r.report_type.toUpperCase()} at ${r.location}: ${r.description} (${r.upvotes} confirmations)`
    )
  } catch {
    return []
  }
}

export async function submitReport(
  report_type: string,
  location: string,
  description: string
) {
  if (!supabase) return null

  const { data, error } = await supabase.from('community_reports').insert({
    report_type,
    location,
    description,
    upvotes: 1
  })

  if (error) throw error
  return data
}

export async function upvoteReport(id: string) {
  if (!supabase) return null
  await supabase.rpc('increment_upvotes', { report_id: id })
}
