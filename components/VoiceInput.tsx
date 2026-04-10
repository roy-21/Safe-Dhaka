'use client'

import { useState, useRef, useCallback } from 'react'
import { Mic, MicOff, Loader2 } from 'lucide-react'

interface VoiceInputProps {
  onTranscript: (text: string) => void
  disabled?: boolean
  language?: 'bangla' | 'english'
}

// Type-safe browser Speech Recognition API definitions (not in TS lib by default)
type SpeechRecognitionInstance = {
  lang: string
  continuous: boolean
  interimResults: boolean
  maxAlternatives: number
  start: () => void
  stop: () => void
  onstart: (() => void) | null
  onend: (() => void) | null
  onresult: ((e: { results: { [i: number]: { [j: number]: { transcript: string } } } }) => void) | null
  onerror: ((e: { error: string }) => void) | null
}
type SpeechRecognitionCtor = new () => SpeechRecognitionInstance

export function VoiceInput({ onTranscript, disabled, language = 'english' }: VoiceInputProps) {
  const [state, setState] = useState<'idle' | 'listening' | 'processing'>('idle')
  const [supported, setSupported] = useState(true)
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)

  const startListening = useCallback(() => {
    const win = window as Window & {
      webkitSpeechRecognition?: SpeechRecognitionCtor
      SpeechRecognition?: SpeechRecognitionCtor
    }

    const API = win.webkitSpeechRecognition || win.SpeechRecognition
    if (!API) { setSupported(false); return }

    const r = new API()
    recognitionRef.current = r

    r.lang = language === 'bangla' ? 'bn-BD' : 'en-US'
    r.continuous = false
    r.interimResults = false
    r.maxAlternatives = 1

    r.onstart  = () => setState('listening')
    r.onend    = () => setState('idle')
    r.onerror  = (e) => { console.warn('Voice error:', e.error); setState('idle') }
    r.onresult = (e) => {
      setState('processing')
      onTranscript(e.results[0][0].transcript)
      setTimeout(() => setState('idle'), 500)
    }

    r.start()
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
      title={state === 'listening' ? 'Stop — কথা বলা বন্ধ করুন' : 'Speak in Bangla or English'}
      aria-label="Voice input"
      id="voice-input-btn"
    >
      {state === 'listening'   ? <MicOff size={18} /> :
       state === 'processing'  ? <Loader2 size={18} className="voice-icon-spin" /> :
                                 <Mic size={18} />}
    </button>
  )
}
