'use client'

interface SafetyScoreProps {
  score: number
  route: string
  leaveBy: string
  cost: string
  warnings: string[]
}

export function SafetyScore({ score, route, leaveBy, cost, warnings }: SafetyScoreProps) {
  const getColor = () => {
    if (score >= 90) return 'safety-green'
    if (score >= 70) return 'safety-yellow'
    if (score >= 50) return 'safety-orange'
    return 'safety-red'
  }

  const getLabel = () => {
    if (score >= 90) return 'SAFE'
    if (score >= 70) return 'USE CAUTION'
    if (score >= 50) return 'ALTERNATE ROUTE'
    return 'DO NOT TRAVEL'
  }

  const getEmoji = () => {
    if (score >= 90) return '🟢'
    if (score >= 70) return '🟡'
    if (score >= 50) return '🟠'
    return '🔴'
  }

  return (
    <div className={`safety-card ${getColor()}`}>
      <div className="safety-header">
        <div className="score-circle">
          <span className="score-number">{score}</span>
          <span className="score-label">/100</span>
        </div>
        <div className="safety-info">
          <span className="safety-emoji">{getEmoji()}</span>
          <span className="safety-label">{getLabel()}</span>
        </div>
      </div>

      <div className="safety-details">
        <div className="safety-route">
          <strong>Route:</strong> {route}
        </div>
        <div className="safety-meta">
          <span>🕐 Leave by: {leaveBy}</span>
          <span>💰 Cost: {cost}</span>
        </div>
      </div>

      {warnings.length > 0 && (
        <div className="safety-warnings">
          {warnings.map((w, i) => (
            <div key={i} className="safety-warning">⚠️ {w}</div>
          ))}
        </div>
      )}
    </div>
  )
}
