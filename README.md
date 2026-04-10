# 🛡️ Safe Dhaka — AI-Powered Travel Safety Assistant

> **The smartest way to navigate Dhaka city.** Real-time route safety, budget routing, flood alerts, and school route checks — powered by Llama 3.3, Groq AI, and 40 years of local Dhaka expertise.

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)](https://nextjs.org)
[![Groq AI](https://img.shields.io/badge/Groq-Llama%203.3%2070B-6366f1?logo=meta)](https://console.groq.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?logo=typescript)](https://typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![GitHub](https://img.shields.io/badge/GitHub-roy--21%2FSafe--Dhaka-181717?logo=github)](https://github.com/roy-21/Safe-Dhaka)

---

## 📸 Preview

| Homepage | Route Response | Bangla Support |
|----------|---------------|----------------|
| Dark theme with bilingual UI | Clean structured route output | Full Bengali input/output |

---

## 🌟 What Makes This Unique

Safe Dhaka is not a generic chatbot. It is trained on the **knowledge of a 40-year Dhaka resident** — every flood zone, every shortcut, every bus trick, every rush hour pattern.

### 🔥 Key Innovations

| Innovation | Description |
|-----------|-------------|
| 🤖 **Triple AI Chain** | Groq (Llama 3.3) → Gemini → Local Knowledge — chatbot **never fails** |
| 🎙️ **Bangla Voice Input** | Speak your destination in Bangla or English — auto-detects language |
| ⏰ **Smart Departure Timer** | Tells you exactly when to leave based on Dhaka's real rush-hour patterns |
| 🌊 **Flood Intelligence** | 10+ specific road flood risk assessments, updated with live weather |
| 💰 **Budget Routing** | Say "only 50 taka" — get exact bus legs with savings vs CNG |
| 🚇 **MRT Line 6 Expert** | Full station map, fares, frequency, and secret tips |
| 🏫 **School Route Safety** | Safety score + timing advice for parents every morning |
| 🚨 **Hartal Detection** | Scans live news for hartals, shutdowns, VIP movements |

---

## 🧠 Expert Knowledge Base

The AI is trained with hyper-local Dhaka intelligence:

- **MRT Line 6** — All 16 stations, fares (20–100 taka), hours (7am–9:30pm), rush-hour tips
- **Flood Zones** — Road-by-road risk: Mirpur Road, Demra, Rayer Bazar, Malibagh (extreme risk)
- **Safe Elevated Roads** — Gulshan Avenue, Dhanmondi 27, Uttara Sector 3–7
- **12 Secret Shortcuts** — Tejgaon backroad, Kalyanpur bypass, Mohammadpur routes
- **Real Bus Routes** — Bus 8 (Mirpur→Motijheel 15tk), Bus 29, Bus 7, Bus 56 and more
- **Transport Costs 2025** — MRT 20–100tk, CNG 40–200tk, Pathao Bike 30–80tk
- **Rush Hours** — 7–9am (2.2x multiplier), 5–7pm (2.5x multiplier)
- **Seasonal Patterns** — Monsoon flood warnings, fog alerts (Dec–Jan), Eid/Pohela Boishakh impacts
- **Hospital Routes** — DMCH, Square Hospital, BIRDEM emergency routes
- **School Zones** — Holy Cross, Viqarunnisa, BUET, DU routes with timing advice

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Safe Dhaka UI                      │
│   ChatInterface + VoiceInput + DepartureTimer        │
└─────────────────────┬───────────────────────────────┘
                      │
              ┌───────▼────────┐
              │  /api/chat     │  ← Main AI endpoint
              └───────┬────────┘
                      │
         ┌────────────┼────────────┐
         ▼            ▼            ▼
   ┌──────────┐ ┌──────────┐ ┌──────────────┐
   │  Groq AI  │ │  Gemini  │ │ Local Fallback│
   │ Llama 3.3 │ │  Flash   │ │ dhaka-know.ts│
   │ (Primary) │ │(Fallback)│ │ (Always works)│
   └──────────┘ └──────────┘ └──────────────┘
                      │
         ┌────────────┼────────────┐
         ▼            ▼            ▼
   ┌──────────┐ ┌──────────┐ ┌──────────┐
   │ OpenWeath│ │  NewsAPI │ │ Supabase │
   │ Live Rain│ │  Hartal  │ │Community │
   │  + Flood │ │  Alerts  │ │ Reports  │
   └──────────┘ └──────────┘ └──────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- API keys (see below)

### Installation

```bash
# Clone the repository
git clone https://github.com/roy-21/Safe-Dhaka.git
cd Safe-Dhaka/saferoute-dhaka

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

### Environment Variables

Create `.env.local` in the project root:

```env
# Groq AI — PRIMARY (free, 14,400 req/day)
# Get key: https://console.groq.com/keys
GROQ_API_KEY=your_groq_key_here

# Gemini AI — FALLBACK
# Get key: https://aistudio.google.com/apikey
GEMINI_API_KEY=your_gemini_key_here

# OpenWeatherMap — Live Dhaka weather
# Get key: https://openweathermap.org/api
OPENWEATHER_API_KEY=your_openweather_key_here

# NewsAPI — Hartal / alert detection
# Get key: https://newsapi.org/register
NEWS_API_KEY=your_newsapi_key_here

# Supabase — Community reports (optional)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> **Note:** Only `GROQ_API_KEY` is required to start. All APIs have safe fallbacks.

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

---

## 💬 How to Use

### English Queries
```
"Mirpur to Motijheel, I only have 50 taka"
"My child's school route — is it safe today?"
"My child already left — is the route safe now?"
"Fastest route from Uttara to BUET"
```

### Bangla Queries (বাংলা)
```
"মিরপুর থেকে মতিঝিল যাবো, বাজেট ৫০ টাকা"
"আমার ছেলের স্কুল রুট কি আজ নিরাপদ?"
"আমার বাজেট মাত্র ৩০ টাকা — কোন পথে যাবো?"
```

### Voice Input 🎙️
Click the **microphone button** next to the input field and speak in Bangla or English — the AI auto-detects your language.

### Smart Departure Timer ⏰
Click **"Smart Timer"** (top-right of chat) to see exactly when you need to leave for school, office, or common Dhaka routes.

---

## 📊 Sample Response Format

```
Budget route found for 50 taka:

Best option right now:
Bus 8 from Mirpur 10 → Farmgate
(15 taka, 25 min)
Then bus 29 → Motijheel
(10 taka, 20 min)

Total: 25 taka — you save 25 taka
Total time: 45 min

⚠️ Rain alert — Mirpur Road risky
Take Mirpur 1 side road instead

Avoid CNG right now — they will charge 120-150 taka.
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5 |
| **Primary AI** | Groq — Llama 3.3 70B Versatile |
| **Fallback AI** | Google Gemini 2.0 Flash |
| **Styling** | Vanilla CSS with CSS Variables |
| **Font** | Inter (Latin) + Hind Siliguri (Bengali) |
| **Weather** | OpenWeatherMap API |
| **Alerts** | NewsAPI (hartal detection) |
| **Database** | Supabase (community reports) |
| **Icons** | Lucide React |
| **Voice** | Web Speech API (browser native) |
| **Deployment** | Vercel / any Node.js host |

---

## 📁 Project Structure

```
saferoute-dhaka/
├── app/
│   ├── api/
│   │   ├── chat/route.ts        # Main AI endpoint (Groq → Gemini → Local)
│   │   ├── weather/route.ts     # OpenWeatherMap proxy
│   │   └── report/route.ts      # Community report submission
│   ├── globals.css              # Full design system
│   ├── layout.tsx               # Bengali font + metadata
│   └── page.tsx                 # Main page
├── components/
│   ├── ChatInterface.tsx         # Main chat UI + message renderer
│   ├── VoiceInput.tsx            # 🆕 Bangla/English voice input
│   ├── DepartureTimer.tsx        # 🆕 Smart departure timer
│   └── StatusBar.tsx             # Live weather + clock
├── lib/
│   ├── dhaka-knowledge.ts        # 40-year expert knowledge base
│   ├── prompt-builder.ts         # System prompt with live context
│   ├── local-fallback.ts         # 🆕 Smart offline responses
│   ├── weather.ts                # Weather + flood risk
│   ├── alerts.ts                 # Hartal detection
│   └── community.ts              # Supabase community reports
└── types/index.ts                # TypeScript interfaces
```

---

## 🌊 Flood Intelligence

The app has built-in flood zone mapping for Dhaka:

| Risk Level | Roads |
|-----------|-------|
| 🔴 **Extreme** | Mirpur Road (Kalyanpur–Shyamoli), Demra–Jatrabari, Rayer Bazar–Bosila |
| 🟠 **High** | Malibagh–Mouchak, Jatrabari Circle, Sadarghat |
| 🟢 **Safe** | Gulshan Avenue, Dhanmondi 27, Uttara Sector 3–7, MRT Line 6 |

---

## 🚦 AI Fallback Chain

The chatbot **never shows an error** to users:

```
1. Groq AI (Llama 3.3) ──→ if quota/error
2. Gemini 2.0 Flash    ──→ if quota/error  
3. Local Knowledge     ──→ always works
```

Even without any API keys, the app gives real Dhaka travel advice using the built-in knowledge base.

---

## 🗺️ Smart Departure Timer — Rush Hour Multipliers

Based on real Dhaka traffic observation:

| Time Period | Multiplier | Impact |
|------------|-----------|--------|
| Morning Rush (7–9am) | **2.2x** | 20 min trip → 44 min |
| Lunch Rush (12–2pm) | **1.4x** | 20 min trip → 28 min |
| Evening Rush (5–7pm) | **2.5x** | 20 min trip → 50 min |
| Post-Office Rush (7–9pm) | **1.6x** | 20 min trip → 32 min |
| Off-Peak | **1.0x** | Normal time |

---

## 🤝 Contributing

Pull requests are welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes
4. Push and open a Pull Request

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 👨‍💻 Author

Built with ❤️ for the 22 million people of Dhaka.

[![GitHub](https://img.shields.io/badge/GitHub-roy--21-181717?logo=github)](https://github.com/roy-21)

---

> *"Safe Dhaka is not just an app — it is a trusted local guide in your pocket."*
