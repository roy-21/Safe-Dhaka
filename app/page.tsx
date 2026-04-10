import { StatusBar } from '@/components/StatusBar'
import { ChatInterface } from '@/components/ChatInterface'
import { MapPin } from 'lucide-react'

export default function Home() {
  return (
    <main className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-icon">
          <MapPin size={28} />
        </div>
        <h1 className="app-title">SafeRoute Dhaka</h1>
        <p className="app-subtitle">Safe, smart, affordable travel for every Dhaka family</p>
      </header>

      {/* Status Bar */}
      <StatusBar />

      {/* Chat Interface */}
      <ChatInterface />
    </main>
  )
}
