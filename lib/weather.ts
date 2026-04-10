// SafeRoute Dhaka — Weather API Wrapper
import axios from 'axios'
import { WeatherData } from '@/types'

export async function getDhakaWeather(): Promise<WeatherData> {
  try {
    const res = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=Dhaka,BD&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
    )
    const weather = res.data.weather[0].main
    const isRaining = ['Rain', 'Drizzle', 'Thunderstorm'].includes(weather)
    const rainfall = res.data.rain?.['1h'] || 0

    return {
      isRaining,
      description: res.data.weather[0].description,
      temperature: Math.round(res.data.main.temp),
      humidity: res.data.main.humidity,
      floodRisk: !isRaining ? 'none'
        : rainfall < 5 ? 'low'
        : rainfall < 15 ? 'high'
        : 'extreme'
    }
  } catch {
    // Fallback — never crash the app
    return { isRaining: false, description: 'unknown', temperature: 30, humidity: 70, floodRisk: 'none' }
  }
}
