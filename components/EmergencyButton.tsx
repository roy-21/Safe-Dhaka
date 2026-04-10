'use client'

import { AlertTriangle } from 'lucide-react'

interface EmergencyButtonProps {
  onEmergency: () => void
  isLoading: boolean
}

export function EmergencyButton({ onEmergency, isLoading }: EmergencyButtonProps) {
  return (
    <button
      className="emergency-btn"
      onClick={onEmergency}
      disabled={isLoading}
      id="emergency-button"
    >
      <AlertTriangle size={16} />
      <span>My child already left — is route safe now?</span>
    </button>
  )
}
