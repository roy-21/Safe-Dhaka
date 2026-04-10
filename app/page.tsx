import { StatusBar } from '@/components/StatusBar'
import { ChatInterface } from '@/components/ChatInterface'
import { Shield } from 'lucide-react'

export default function Home() {
  return (
    <main className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-icon">
          <Shield size={26} />
        </div>
        <h1 className="app-title">Safe Dhaka</h1>
        <p className="app-subtitle">AI-powered travel safety for every Dhaka family</p>
      </header>

      {/* Status Bar */}
      <StatusBar />

      {/* Chat Interface */}
      <ChatInterface />
    </main>
  )
}
