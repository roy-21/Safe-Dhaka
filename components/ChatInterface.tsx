'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Loader2, School, Wallet, AlertTriangle } from 'lucide-react'
import { ChatMessage } from '@/types'

const INITIAL_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content: `Assalamu Alaikum! I am SafeRoute.

Tell me where you want to go — I will find the safest, cheapest route for you right now.

Or ask me about your child's school route.`,
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
  }
]

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Build conversation history for Gemini (role + parts format)
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

  // Format message content — preserve line breaks
  function formatContent(content: string) {
    return content.split('\n').map((line, i) => (
      <span key={i}>
        {line}
        {i < content.split('\n').length - 1 && <br />}
      </span>
    ))
  }

  return (
    <div className="chat-container">
      {/* Messages Area */}
      <div className="messages-area">
        {messages.map(msg => (
          <div key={msg.id} className={`message ${msg.role}`}>
            <div className={`message-bubble ${msg.role}`}>
              {formatContent(msg.content)}
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="message assistant">
            <div className="message-bubble assistant loading-bubble">
              <Loader2 className="spin" size={18} />
              <span>Checking live conditions...</span>
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
            placeholder="Where do you want to go?"
            className="chat-input"
            disabled={isLoading}
            id="chat-input"
          />
          <button
            type="submit"
            className="send-btn"
            disabled={!input.trim() || isLoading}
            id="send-button"
          >
            {isLoading ? <Loader2 className="spin" size={18} /> : <Send size={18} />}
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
