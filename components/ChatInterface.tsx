'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Loader2, School, Wallet, AlertTriangle } from 'lucide-react'
import { ChatMessage } from '@/types'

const INITIAL_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content: `Assalamu Alaikum! I am Safe Dhaka.

Tell me where you want to go — I will find the safest, cheapest route for you right now.

Or ask me about your child's school route.

আপনি বাংলায়ও লিখতে পারেন — আমি বাংলায় উত্তর দেব।`,
  timestamp: new Date()
}

const QUICK_ACTIONS = [
  {
    icon: School,
    text: "My child's school route — is it safe today?",
    color: 'quick-school'
  },
  {
    icon: Wallet,
    text: "Mirpur to Motijheel — only 50 taka",
    color: 'quick-budget'
  },
  {
    icon: AlertTriangle,
    text: "My child already left — is route safe now?",
    color: 'quick-emergency'
  },
  {
    icon: School,
    text: "মিরপুর থেকে মতিঝিল কীভাবে যাবো?",
    color: 'quick-bangla'
  },
  {
    icon: Wallet,
    text: "আমার বাজেট ৫০ টাকা — কোন পথে যাবো?",
    color: 'quick-bangla'
  }
]

// Smart line classifier for the clean human-friendly format
function classifyLine(line: string): string {
  if (!line.trim()) return 'spacer'
  // Summary header lines: "Budget route found:", "Fastest route:", "School route check:"
  if (/^(Budget route|Fastest route|Best route|School route|Emergency|MRT|Metro|মেট্রো রেল|স্কুল রুট|বন্যা|সবচেয়ে দ্রুত|এখনকার সেরা|বাজেট রুট)/i.test(line.trim())) return 'header'
  // Section labels: "Best option right now:", "Best route this morning:"
  if (/right now:|this morning:|এখনকার সেরা পথ:|সেরা পথ:/i.test(line)) return 'section'
  // Safety score lines
  if (/safety score:|নিরাপত্তা স্কোর:/i.test(line)) return 'score'
  // Transport legs: "Bus X from A → B", "MRT from", "Then bus", "rickshaw"
  if (/^(Bus|Then bus|Then rickshaw|MRT|Rickshaw|Pathao|Uber|বাস|তারপর|মেট্রো|রিকশা)/i.test(line.trim())) return 'transport'
  // Cost/time parentheses: "(15 taka, 25 min)"
  if (/^\(.*taka.*min\)|^\(.*টাকা.*মিনিট\)/.test(line.trim())) return 'cost'
  // Total lines: "Total: 25 taka", "মোট:"
  if (/^Total:|^মোট:/.test(line.trim())) return 'total'
  // Total time: "Total time:", "মোট সময়:"
  if (/^Total time:|^মোট সময়:/.test(line.trim())) return 'total-time'
  // Warnings: start with ⚠️
  if (line.trim().startsWith('⚠️')) return 'warning'
  // Advice lines: "Avoid...", "Leave before...", "Take...", "সিএনজি এড়িয়ে"
  if (/^(Avoid|Leave|Take|Do not|Don't|সিএনজি এড়|বের হন|ব্যবহার)/i.test(line.trim())) return 'advice'
  return 'text'
}

function FormattedMessage({ content }: { content: string }) {
  const lines = content.split('\n')

  return (
    <div className="formatted-message">
      {lines.map((line, i) => {
        const type = classifyLine(line)
        if (type === 'spacer') return <div key={i} className="msg-spacer" />
        if (type === 'header') return <div key={i} className="msg-header">{line}</div>
        if (type === 'section') return <div key={i} className="msg-section">{line}</div>
        if (type === 'score') return <div key={i} className="msg-score">{line}</div>
        if (type === 'transport') return <div key={i} className="msg-transport">{line}</div>
        if (type === 'cost') return <div key={i} className="msg-cost">{line}</div>
        if (type === 'total') return <div key={i} className="msg-total">{line}</div>
        if (type === 'total-time') return <div key={i} className="msg-total-time">{line}</div>
        if (type === 'warning') return <div key={i} className="msg-warning">{line}</div>
        if (type === 'advice') return <div key={i} className="msg-advice">{line}</div>
        return <div key={i} className="msg-text">{line}</div>
      })}
    </div>
  )
}

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function buildConversationHistory() {
    return messages
      .filter(m => m.id !== 'welcome')
      .map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }))
  }

  async function sendMessage(text: string, isEmergency = false) {
    if (!text.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          conversationHistory: buildConversationHistory(),
          isEmergency
        })
      })

      const data = await res.json()

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply,
        timestamp: new Date(),
        meta: data.meta
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I am having trouble right now. For safety, please delay travel if it is raining. Try again in 1 minute.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    sendMessage(input)
  }

  function handleQuickAction(text: string) {
    const isEmergency = text.toLowerCase().includes('already left')
    sendMessage(text, isEmergency)
  }

  return (
    <div className="chat-container">
      {/* Messages Area */}
      <div className="messages-area">
        {messages.map(msg => (
          <div key={msg.id} className={`message ${msg.role}`}>
            {msg.role === 'assistant' && (
              <div className="ai-avatar">SD</div>
            )}
            <div className={`message-bubble ${msg.role}`}>
              {msg.role === 'assistant'
                ? <FormattedMessage content={msg.content} />
                : <span>{msg.content}</span>
              }
              {/* Show meta badge if available */}
              {msg.meta && (
                <div className="meta-badges">
                  {msg.meta.weather.isRaining && (
                    <span className="meta-badge badge-rain">🌧 Rain active</span>
                  )}
                  {msg.meta.alertCount > 0 && (
                    <span className="meta-badge badge-alert">🚨 {msg.meta.alertCount} alert{msg.meta.alertCount > 1 ? 's' : ''}</span>
                  )}
                  {msg.meta.reportCount > 0 && (
                    <span className="meta-badge badge-report">👥 {msg.meta.reportCount} report{msg.meta.reportCount > 1 ? 's' : ''}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="message assistant">
            <div className="ai-avatar">SD</div>
            <div className="message-bubble assistant loading-bubble">
              <Loader2 className="spin" size={16} />
              <span>Checking live Dhaka conditions...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="input-area">
        <form onSubmit={handleSubmit} className="input-form">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Where to go? / কোথায় যাবেন?"
            className="chat-input"
            disabled={isLoading}
            id="chat-input"
            lang="bn"
            dir="auto"
          />
          <button
            type="submit"
            className="send-btn"
            disabled={!input.trim() || isLoading}
            id="send-button"
          >
            {isLoading ? <Loader2 className="spin" size={16} /> : <Send size={16} />}
            <span>Send</span>
          </button>
        </form>

        {/* Quick Action Buttons */}
        <div className="quick-actions">
          {QUICK_ACTIONS.map((action, i) => (
            <button
              key={i}
              className={`quick-action-btn ${action.color}`}
              onClick={() => handleQuickAction(action.text)}
              disabled={isLoading}
            >
              <action.icon size={14} />
              <span>{action.text}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
