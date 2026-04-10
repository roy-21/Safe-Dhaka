// SafeRoute Dhaka — TypeScript Types

export interface WeatherData {
  isRaining: boolean
  description: string
  temperature: number
  humidity: number
  floodRisk: 'none' | 'low' | 'high' | 'extreme'
}

export interface LiveContext {
  isRaining: boolean
  rainDescription: string
  temperature: number
  currentTime: string
  currentDay: string
  isRushHour: boolean
  isFriday: boolean
  activeAlerts: string[]
  communityReports: string[]
  userBudget?: number
  userLanguage: 'english' | 'bangla'
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  meta?: ResponseMeta
}

export interface ResponseMeta {
  weather: { isRaining: boolean; floodRisk: string }
  alertCount: number
  reportCount: number
  timestamp: string
}

export interface CommunityReport {
  id: string
  report_type: 'jam' | 'flood' | 'vip' | 'accident' | 'safe'
  location: string
  description: string
  upvotes: number
  created_at: string
}

export interface SafetyScoreData {
  score: number
  route: string
  leaveBy: string
  cost: string
  warnings: string[]
}
