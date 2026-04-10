// Safe Dhaka — Hartal and Alert Detector
import axios from 'axios'

const HARTAL_KEYWORDS = [
  'hartal', 'strike', 'shutdown', 'oborodh', 'অবরোধ', 'হরতাল',
  'blockade', 'road block', 'VIP movement', 'VVIP', 'convoy',
  'march', 'procession', 'rally', 'agitation', 'protest Dhaka',
  'traffic blocked', 'road closed Dhaka', 'curfew Dhaka'
]

export async function getActiveAlerts(): Promise<string[]> {
  const alerts: string[] = []

  try {
    const res = await axios.get(
      `https://newsapi.org/v2/everything?q=Dhaka+hartal+traffic+road+strike&language=en&sortBy=publishedAt&pageSize=15&apiKey=${process.env.NEWS_API_KEY}`,
      { timeout: 5000 } // 5 second timeout — never block the main response
    )

    const articles = res.data.articles
    // Hartals are announced 24hrs in advance — check last 24 hours
    const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000
    const seen = new Set<string>() // Dedup by title

    for (const article of articles) {
      const publishedAt = new Date(article.publishedAt).getTime()
      if (publishedAt < twentyFourHoursAgo) continue

      const title = article.title || ''
      if (seen.has(title)) continue
      seen.add(title)

      const text = (title + ' ' + (article.description || '')).toLowerCase()
      const matched = HARTAL_KEYWORDS.some(k => text.includes(k.toLowerCase()))

      if (matched) {
        alerts.push(`ALERT: ${title} (${article.source?.name || 'News'})`)
      }
    }
  } catch {
    // Silently fail — alerts are supplementary not critical
  }

  return alerts.slice(0, 5) // Max 5 alerts to keep prompt focused
}
