'use client'

import { useState, useEffect } from 'react'
import { Clock, AlertTriangle, CheckCircle, Navigation } from 'lucide-react'

// Dhaka traffic time brackets — based on real observation
const RUSH_BRACKETS = [
  { start: 7, end: 9, label: 'Morning rush', multiplier: 2.2 },
  { start: 12, end: 14, label: 'Lunch rush', multiplier: 1.4 },
  { start: 17, end: 19, label: 'Evening rush', multiplier: 2.5 },
  { start: 19, end: 21, label: 'Post-office rush', multiplier: 1.6 },
]

function getCurrentMultiplier(hour: number): { multiplier: number; label: string } {
  const bracket = RUSH_BRACKETS.find(b => hour >= b.start && hour < b.end)
  return bracket
    ? { multiplier: bracket.multiplier, label: bracket.label }
    : { multiplier: 1.0, label: 'Clear' }
}

function getOptimalLeaveTime(baseMinutes: number, targetHour: number, targetMin: number): {
  leaveNow: boolean
  leaveIn: number
  message: string
  urgency: 'safe' | 'warn' | 'urgent'
} {
  const now = new Date()
  const bdNow = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Dhaka' }))
  const currentHour = bdNow.getHours()
  const currentMin = bdNow.getMinutes()

  const { multiplier, label } = getCurrentMultiplier(currentHour)
  const adjustedTravel = Math.ceil(baseMinutes * multiplier)

  // When do they need to arrive?
  const arriveAt = new Date(bdNow)
  arriveAt.setHours(targetHour, targetMin, 0)

  // When should they leave?
  const leaveAt = new Date(arriveAt.getTime() - adjustedTravel * 60 * 1000)
  const minutesUntilLeave = Math.floor((leaveAt.getTime() - bdNow.getTime()) / 60000)

  if (minutesUntilLeave < 0) {
    return {
      leaveNow: true, leaveIn: 0,
      message: `Leave NOW — you're ${Math.abs(minutesUntilLeave)} min behind. ${label} active.`,
      urgency: 'urgent'
    }
  } else if (minutesUntilLeave < 15) {
    return {
      leaveNow: true, leaveIn: minutesUntilLeave,
      message: `Leave in ${minutesUntilLeave} min. ${label} — trip takes ~${adjustedTravel} min.`,
      urgency: 'warn'
    }
  } else {
    const h = leaveAt.getHours()
    const m = leaveAt.getMinutes().toString().padStart(2, '0')
    const period = h >= 12 ? 'PM' : 'AM'
    const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h
    return {
      leaveNow: false, leaveIn: minutesUntilLeave,
      message: `Leave at ${displayH}:${m} ${period}. ${label} phase — trip ~${adjustedTravel} min.`,
      urgency: 'safe'
    }
  }
}

// Preset common routes for the timer
const ROUTE_PRESETS = [
  { label: 'School (8am)', from: 'Home', to: 'School', baseMin: 30, arriveH: 8, arriveM: 0 },
  { label: 'Office (9am)', from: 'Home', to: 'Office', baseMin: 45, arriveH: 9, arriveM: 0 },
  { label: 'Mirpur→Motijheel', from: 'Mirpur', to: 'Motijheel', baseMin: 22, arriveH: 9, arriveM: 0 },
  { label: 'Uttara→BUET', from: 'Uttara', to: 'BUET', baseMin: 35, arriveH: 8, arriveM: 0 },
]

export function DepartureTimer() {
  const [selected, setSelected] = useState(0)
  const [timerData, setTimerData] = useState(() => {
    const p = ROUTE_PRESETS[0]
    return getOptimalLeaveTime(p.baseMin, p.arriveH, p.arriveM)
  })
  const [currentTime, setCurrentTime] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const update = () => {
      const p = ROUTE_PRESETS[selected]
      setTimerData(getOptimalLeaveTime(p.baseMin, p.arriveH, p.arriveM))
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Dhaka',
        hour: '2-digit', minute: '2-digit', hour12: true
      }))
    }
    update()
    const interval = setInterval(update, 30000) // update every 30s
    return () => clearInterval(interval)
  }, [selected])

  const urgencyClass = {
    safe: 'timer-safe',
    warn: 'timer-warn',
    urgent: 'timer-urgent'
  }[timerData.urgency]

  const UrgencyIcon = timerData.urgency === 'urgent'
    ? AlertTriangle
    : timerData.urgency === 'warn'
    ? Clock
    : CheckCircle

  return (
    <div className="departure-timer">
      <button
        className="timer-toggle"
        onClick={() => setIsOpen(o => !o)}
        id="departure-timer-toggle"
        title="Smart Departure Timer"
      >
        <Navigation size={14} />
        <span>Smart Timer</span>
        <span className={`timer-badge ${urgencyClass}`}>
          {timerData.urgency === 'urgent' ? '!' : timerData.leaveIn > 0 ? `${timerData.leaveIn}m` : '✓'}
        </span>
      </button>

      {isOpen && (
        <div className="timer-panel" id="timer-panel">
          <div className="timer-header">
            <Clock size={14} />
            <span>Smart Departure Timer — {currentTime}</span>
          </div>

          {/* Route selector */}
          <div className="timer-routes">
            {ROUTE_PRESETS.map((p, i) => (
              <button
                key={i}
                className={`timer-route-btn ${selected === i ? 'active' : ''}`}
                onClick={() => setSelected(i)}
                id={`timer-route-${i}`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Leave now advice */}
          <div className={`timer-advice ${urgencyClass}`}>
            <UrgencyIcon size={16} />
            <span>{timerData.message}</span>
          </div>

          <div className="timer-footer">
            Adapts to Dhaka rush hour patterns in real-time
          </div>
        </div>
      )}
    </div>
  )
}
