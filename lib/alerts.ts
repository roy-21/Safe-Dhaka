// SafeRoute Dhaka — Hartal and Alert Detector
import axios from 'axios'

const HARTAL_KEYWORDS = [
  'hartal', 'strike', 'shutdown', 'oborodh', 'অবরোধ', 'হরতাল',
  'blockade', 'road block', 'VIP movement', 'VVIP', 'convoy'
]

export async function getActiveAlerts(): Promise<string[]> {
  const alerts: string[] = []

  try {
    const res = await axios.get(
      `https://newsapi.org/v2/everything?q=Dhaka+hartal+traffic+road&language=en&sortBy=publishedAt&pageSize=10&apiKey=${process.env.NEWS_API_KEY}`
    )

    const articles = res.data.articles
    const twoHoursAgo = Date.now() - 2 * 60 * 60 * 1000

    for (const article of articles) {
      const publishedAt = new Date(article.publishedAt).getTime()
      if (publishedAt < twoHoursAgo) continue

      const text = (article.title + ' ' + article.description).toLowerCase()
      const matched = HARTAL_KEYWORDS.some(k => text.includes(k.toLowerCase()))

      if (matched) {
        alerts.push(`ALERT: ${article.title} (${article.source.name})`)
      }
    }
  } catch {
    // Silently fail — alerts are supplementary not critical
  }

  return alerts
}
