'use client'

import { useState, useRef, useCallback } from 'react'
import { Mic, MicOff, Loader2 } from 'lucide-react'

interface VoiceInputProps {
  onTranscript: (text: string) => void
  disabled?: boolean
  language?: 'bangla' | 'english'
}

export function VoiceInput({ onTranscript, disabled, language = 'english' }: VoiceInputProps) {
  const [state, setState] = useState<'idle' | 'listening' | 'processing'>('idle')
  const [supported, setSupported] = useState(true)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setSupported(false)
      return
    }

    const SpeechRecognitionAPI =
      (window as Window & { webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition ||
      window.SpeechRecognition

    const recognition = new SpeechRecognitionAPI()
    recognitionRef.current = recognition

    // Support both Bangla and English — detect which to use
    recognition.lang = language === 'bangla' ? 'bn-BD' : 'en-US'
    recognition.continuous = false
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onstart = () => setState('listening')
    recognition.onend = () => setState('idle')

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      setState('processing')
      const transcript = event.results[0][0].transcript
      onTranscript(transcript)
      setTimeout(() => setState('idle'), 500)
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.warn('Voice recognition error:', event.error)
      setState('idle')
    }

    recognition.start()
  }, [language, onTranscript])

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
    setState('idle')
  }, [])

  if (!supported) return null

  return (
    <button
      type="button"
      onClick={state === 'listening' ? stopListening : startListening}
      disabled={disabled}
      className={`voice-btn ${state === 'listening' ? 'voice-btn-active' : ''}`}
      title={state === 'listening' ? 'Stop listening' : 'Speak your destination (Bangla or English)'}
      aria-label="Voice input"
      id="voice-input-btn"
    >
      {state === 'listening' ? (
        <MicOff size={18} className="voice-icon-active" />
      ) : state === 'processing' ? (
        <Loader2 size={18} className="voice-icon-spin" />
      ) : (
        <Mic size={18} />
      )}
    </button>
  )
}
