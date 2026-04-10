'use client'

import { useEffect, useState } from 'react'
import { Cloud, CloudRain, Cpu, Clock } from 'lucide-react'

interface WeatherStatus {
  isRaining: boolean
  description: string
  temperature: number
}

export function StatusBar() {
  const [weather, setWeather] = useState<WeatherStatus | null>(null)
  const [time, setTime] = useState('')

  useEffect(() => {
    // Fetch weather status
    async function fetchWeather() {
      try {
        const res = await fetch('/api/weather')
        const data = await res.json()
        setWeather(data)
      } catch {
        setWeather({ isRaining: false, description: 'unknown', temperature: 30 })
      }
    }

    fetchWeather()
    const weatherInterval = setInterval(fetchWeather, 5 * 60 * 1000) // Refresh every 5 min

    // Update time every second
    function updateTime() {
      const now = new Date()
      setTime(now.toLocaleTimeString('en-BD', {
        timeZone: 'Asia/Dhaka',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }))
    }
    updateTime()
    const timeInterval = setInterval(updateTime, 1000)

    return () => {
      clearInterval(weatherInterval)
      clearInterval(timeInterval)
    }
  }, [])

  return (
    <div className="status-bar">
      {/* Weather pill */}
      <div className={`status-pill ${weather?.isRaining ? 'status-rain' : 'status-clear'}`}>
        {weather?.isRaining ? (
          <CloudRain size={14} />
        ) : (
          <Cloud size={14} />
        )}
        <span>
          {weather?.isRaining ? 'Raining in Dhaka' : 'Clear in Dhaka'}
        </span>
      </div>

      {/* AI Status pill */}
      <div className="status-pill status-active">
        <Cpu size={14} />
        <span>Route AI Active</span>
      </div>

      {/* Time pill */}
      <div className="status-pill status-time">
        <Clock size={14} />
        <span>{time || '--:--'}</span>
      </div>
    </div>
  )
}
