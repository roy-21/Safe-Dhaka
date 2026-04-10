// Safe Dhaka — Smart Local Fallback Engine
// When Gemini is unavailable, this generates real helpful responses
// using the local Dhaka knowledge base. Never shows a useless error.

import { DHAKA_KNOWLEDGE } from './dhaka-knowledge'

// Keywords for route detection
const ROUTE_KEYWORDS: Record<string, string[]> = {
  mirpur:      ['mirpur', 'মিরপুর'],
  motijheel:   ['motijheel', 'motizheel', 'মতিঝিল'],
  uttara:      ['uttara', 'উত্তরা'],
  dhanmondi:   ['dhanmondi', 'dhanmandi', 'ধানমন্ডি'],
  gulshan:     ['gulshan', 'গুলশান'],
  banani:      ['banani', 'বনানী'],
  farmgate:    ['farmgate', 'farm gate', 'ফার্মগেট'],
  shahbagh:    ['shahbagh', 'শাহবাগ'],
  buet:        ['buet', 'বুয়েট'],
  airport:     ['airport', 'hazrat shahjalal', 'বিমানবন্দর'],
  old_dhaka:   ['old dhaka', 'sadarghat', 'chawkbazar', 'পুরান ঢাকা'],
  bashundhara: ['bashundhara', 'বসুন্ধরা'],
}

function detectZone(text: string): string[] {
  const lower = text.toLowerCase()
  return Object.entries(ROUTE_KEYWORDS)
    .filter(([, keywords]) => keywords.some(k => lower.includes(k)))
    .map(([zone]) => zone)
}

function isBangla(text: string): boolean {
  return /[\u0980-\u09FF]/.test(text)
}

function isSchoolQuery(text: string): boolean {
  return /school|child|\u099b\u09c7\u09b2\u09c7|\u09ae\u09c7\u09af\u09bc\u09c7|\u09b8\u09cd\u0995\u09c1\u09b2|\u09a6\u09c7\u09b0 \u09b0\u09c1\u099f|safe.{0,15}route/i.test(text)
}

function isBudgetQuery(text: string): boolean {
  return /taka|tk|bdt|\u099f\u09be\u0995\u09be|budget|cheap|affordable|\u09b8\u09b8\u09cd\u09a4\u09be/i.test(text)
}

function isFloodQuery(text: string): boolean {
  return /flood|rain|waterlog|\u09ac\u09a8\u09cd\u09af\u09be|\u099c\u09b2|\u09ac\u09c3\u09b7\u09cd\u099f\u09bf/i.test(text)
}

function isEmergencyQuery(text: string): boolean {
  return /emergency|stuck|help|urgent|\u09b8\u09be\u09b9\u09be\u09af\u09cd\u09af|\u09a6\u09cd\u09b0\u09c1\u09a4/i.test(text)
}

function isMRTQuery(text: string): boolean {
  return /metro|mrt|\u09ae\u09c7\u099f\u09cd\u09b0\u09cb|\u09ae\u09c7\u099f\u09cd\u09b0\u09cb \u09b0\u09c7\u09b2/i.test(text)
}

// ─────────────────────────────────────────
// KNOWN COMMON ROUTES — fully pre-built
// ─────────────────────────────────────────
const KNOWN_ROUTES: { from: string; to: string; response: string; bangla: string }[] = [
  {
    from: 'mirpur', to: 'motijheel',
    response: `🗺 ROUTE RIGHT NOW:
  Step 1: Go to Mirpur 10 MRT Station
  Step 2: Board MRT Line 6 towards Motijheel
  Step 3: Get off at Motijheel Station — you have arrived

⏱ TIME: 22 minutes
💰 COST: 50 taka (MRT)

Alternative if budget is very tight:
  Bus 8 from Mirpur 10 → Motijheel — 10-20 taka, but 60-90 min in traffic.

MRT is the best choice. Fast, safe, air-conditioned.`,
    bangla: `🗺 এখনই রুট:
  ধাপ ১: মিরপুর ১০ মেট্রো স্টেশনে যান
  ধাপ ২: এমআরটি লাইন ৬ এ উঠুন মতিঝিলের দিকে
  ধাপ ৩: মতিঝিল স্টেশনে নামুন — পৌঁছে গেছেন

⏱ সময়: ২২ মিনিট
💰 খরচ: ৫০ টাকা (মেট্রো রেল)

বিকল্প (কম বাজেটে):
  বাস ৮ — মিরপুর ১০ থেকে মতিঝিল — ১০-২০ টাকা, তবে ৬০-৯০ মিনিট।

মেট্রো রেলই সেরা পছন্দ।`
  },
  {
    from: 'uttara', to: 'motijheel',
    response: `🗺 ROUTE RIGHT NOW:
  Step 1: Go to Uttara North MRT Station
  Step 2: Board MRT Line 6 — Motijheel direction
  Step 3: Get off at Motijheel Station (final stop)

⏱ TIME: 28 minutes
💰 COST: 80 taka

This is the ONLY sensible route. Road takes 90-120 min during peak hours.`,
    bangla: `🗺 এখনই রুট:
  ধাপ ১: উত্তরা নর্থ মেট্রো স্টেশনে যান
  ধাপ ২: এমআরটি লাইন ৬ — মতিঝিলের দিকে উঠুন
  ধাপ ৩: মতিঝিল স্টেশনে নামুন

⏱ সময়: ২৮ মিনিট
💰 খরচ: ৮০ টাকা

মেট্রো রেলই একমাত্র সঠিক পথ। রাস্তায় ৯০-১২০ মিনিট লাগবে।`
  },
  {
    from: 'mirpur', to: 'dhanmondi',
    response: `🗺 ROUTE RIGHT NOW:
  Step 1: Take Bus 25 or 29 from Mirpur 10
  Step 2: Get off at Science Lab intersection
  Step 3: Take a rickshaw to your exact Dhanmondi destination

⏱ TIME: 35-50 minutes (off-peak), 60-75 min (rush hour)
💰 COST: 25-55 taka (bus 15-25 taka + rickshaw 20-30 taka)

Avoid Farmgate during rush hour — take the Kalyanpur backroad bypass.`,
    bangla: `🗺 এখনই রুট:
  ধাপ ১: মিরপুর ১০ থেকে বাস ২৫ বা ২৯ নিন
  ধাপ ২: সায়েন্স ল্যাব মোড়ে নামুন
  ধাপ ৩: রিকশায় ধানমন্ডির নির্দিষ্ট গন্তব্যে যান

⏱ সময়: ৩৫-৫০ মিনিট
💰 খরচ: ২৫-৫৫ টাকা`
  },
  {
    from: 'gulshan', to: 'motijheel',
    response: `🗺 ROUTE RIGHT NOW:
  Step 1: Take Bus 56 from Gulshan 2 Circle
  Step 2: Or take Uber/Pathao direct (25-40 min, 150-250 taka)
  Step 3: Avoid Rampura Bridge during peak hours

⏱ TIME: 30-45 minutes
💰 COST: Bus 20-30 taka | Uber 150-250 taka`,
    bangla: `🗺 এখনই রুট:
  ধাপ ১: গুলশান ২ সার্কেল থেকে বাস ৫৬ নিন
  ধাপ ২: অথবা উবার/পাঠাও সরাসরি (১৫০-২৫০ টাকা)

⏱ সময়: ৩০-৪৫ মিনিট
💰 খরচ: বাস ২০-৩০ টাকা | উবার ১৫০-২৫০ টাকা`
  },
  {
    from: 'mirpur', to: 'buet',
    response: `🗺 ROUTE RIGHT NOW:
  Step 1: Go to Mirpur 10 MRT Station
  Step 2: Board MRT Line 6 towards Motijheel
  Step 3: Get off at Dhaka University Station
  Step 4: Rickshaw 5 min to BUET main gate (Polashi side)

⏱ TIME: 28 minutes total
💰 COST: 50-65 taka (MRT 50 + rickshaw 15)`,
    bangla: `🗺 এখনই রুট:
  ধাপ ১: মিরপুর ১০ মেট্রো স্টেশনে যান
  ধাপ ২: এমআরটি — ঢাকা বিশ্ববিদ্যালয় স্টেশনে নামুন
  ধাপ ৩: রিকশায় ৫ মিনিট — বুয়েট মেইন গেট

⏱ সময়: ২৮ মিনিট
💰 খরচ: ৫০-৬৫ টাকা`
  },
  {
    from: 'uttara', to: 'dhanmondi',
    response: `🗺 ROUTE RIGHT NOW:
  Step 1: MRT from Uttara → Farmgate Station
  Step 2: CNG from Farmgate to Dhanmondi (negotiate 80-120 taka)

⏱ TIME: 30-45 minutes
💰 COST: 90-160 taka total`,
    bangla: `🗺 এখনই রুট:
  ধাপ ১: এমআরটি — উত্তরা থেকে ফার্মগেট স্টেশন
  ধাপ ২: ফার্মগেট থেকে সিএনজিতে ধানমন্ডি (৮০-১২০ টাকা)

⏱ সময়: ৩০-৪৫ মিনিট
💰 খরচ: ৯০-১৬০ টাকা`
  }
]

// ─────────────────────────────────────────
// MAIN LOCAL FALLBACK FUNCTION
// ─────────────────────────────────────────
export function generateLocalResponse(message: string, isRaining: boolean, isRushHour: boolean): string {
  const bangla = isBangla(message)
  const zones = detectZone(message)

  // Build context warnings
  const warnings: string[] = []
  if (isRaining) {
    warnings.push(bangla
      ? '⚠️ সতর্কতা: এখন বৃষ্টি হচ্ছে — মিরপুর রোড, ডেমরা, মালিবাগ এড়িয়ে চলুন।'
      : '⚠️ WARNING: It is raining now. Avoid Mirpur Road, Demra, Malibagh — high flood risk.')
  }
  if (isRushHour) {
    warnings.push(bangla
      ? '⚠️ রাশ আওয়ার: সব সময়ের সাথে ৩০-৪৫ মিনিট যোগ করুন।'
      : '⚠️ RUSH HOUR: Add 30-45 min to all estimates.')
  }

  const warningText = warnings.join('\n')

  // 1. Check school route query
  if (isSchoolQuery(message)) {
    return bangla
      ? `🛡 নিরাপত্তা স্কোর: ${isRaining ? '65/100 — 🟠 সতর্কতার সাথে যান' : '88/100 — 🟡 নিরাপদ'}\n\n${warningText ? warningText + '\n\n' : ''}🗺 স্কুল রুটের পরামর্শ:\n  ধাপ ১: সকাল ৭:৩০ এর আগে রওনা হন — যানজট এড়াতে\n  ধাপ ২: মেট্রো রেল থাকলে সেটি ব্যবহার করুন\n  ধাপ ৩: বৃষ্টিতে উঁচু রাস্তা দিয়ে যান (গুলশান এভিনিউ, ধানমন্ডি ২৭)\n\n⏱ সকাল ৮টার মধ্যে পৌঁছানো উচিত\n💰 খরচ: বাস ১০-৩০ টাকা | সিএনজি ৬০-১৫০ টাকা\n\nআপনার সন্তান নিরাপদে স্কুলে পৌঁছাক।`
      : `🛡 SAFETY SCORE: ${isRaining ? '65/100 — 🟠 USE CAUTION' : '88/100 — 🟡 SAFE with care'}\n\n${warningText ? warningText + '\n\n' : ''}🗺 SCHOOL ROUTE ADVICE:\n  Step 1: Leave before 7:30am to beat school rush traffic\n  Step 2: Use MRT if your route passes Mirpur/Farmgate/Motijheel\n  Step 3: During rain, stick to elevated roads (Gulshan Ave, Dhanmondi 27)\n\n⏱ Aim to arrive by 8:00am\n💰 COST: Bus 10-30 taka | CNG 60-150 taka\n\nYour child's safety is the priority. Leave early.`
  }

  // 2. Check flood query
  if (isFloodQuery(message)) {
    return bangla
      ? `🌊 বন্যা/জলাবদ্ধতার তথ্য:\n\n🔴 এড়িয়ে চলুন:\n• মিরপুর রোড (কল্যাণপুর-শ্যামলী)\n• ডেমরা-যাত্রাবাড়ী রোড\n• মালিবাগ-মৌচাক\n• রায়েরবাজার-বসিলা\n\n🟢 নিরাপদ রাস্তা:\n• গুলশান অ্যাভিনিউ (উঁচু ও ভালো ড্রেনেজ)\n• ধানমন্ডি ২৭ নম্বর\n• উত্তরা সেক্টর ৩-৭\n• মেট্রো রেল (বন্যায় সবচেয়ে ভালো)\n\n💡 টিপস: বন্যায় রিকশা সবচেয়ে ভালো — গাড়ির চেয়ে উঁচুতে বসা যায়।`
      : `🌊 FLOOD INTELLIGENCE:\n\n🔴 AVOID THESE ROADS:\n• Mirpur Road (Kalyanpur to Shyamoli)\n• Demra-Jatrabari Road\n• Malibagh-Mouchak\n• Rayer Bazar-Bosila Road\n\n🟢 SAFE ELEVATED ROADS:\n• Gulshan Avenue (best drainage in Dhaka)\n• Dhanmondi Road 27\n• Uttara Sector 3-7\n• MRT Line 6 (best option in any rain)\n\n💡 Rickshaw is best in floods — sits higher than cars.`
  }

  // 3. Check MRT query
  if (isMRTQuery(message)) {
    const mrt = DHAKA_KNOWLEDGE.metro_rail
    return bangla
      ? `🚇 মেট্রো রেল (এমআরটি লাইন ৬):\n\nস্টেশনসমূহ:\n${mrt.stations.join(' → ')}\n\n💰 ভাড়া: ২০-১০০ টাকা\n⏱ সময়: প্রতি ৮-১০ মিনিটে ট্রেন\n🕐 চলাচল: সকাল ৭টা - রাত ৯:৩০\n\n✅ টিপস: ${mrt.expert_tip}`
      : `🚇 METRO RAIL (MRT Line 6):\n\nStations: ${mrt.stations.join(' → ')}\n\n💰 Fare: ${mrt.fare}\n⏱ Frequency: ${mrt.frequency}\n🕐 Hours: ${mrt.hours}\n\n✅ Expert tip: ${mrt.expert_tip}`
  }

  // 4. Check known routes
  for (const route of KNOWN_ROUTES) {
    const hasFrom = zones.includes(route.from)
    const hasTo = zones.includes(route.to)
    if (hasFrom && hasTo) {
      const response = (bangla ? route.bangla : route.response)
      return warningText ? `${warningText}\n\n${response}` : response
    }
  }

  // 5. Budget query with destinations
  if (isBudgetQuery(message) && zones.length > 0) {
    const dest = zones[0]
    return bangla
      ? `💰 বাজেট রুট পরামর্শ:\n\n সবচেয়ে সস্তা বিকল্প:\n• বাস: ১০-৬০ টাকা (সবচেয়ে সস্তা)\n• মেট্রো রেল: ২০-১০০ টাকা (দ্রুত + সাশ্রয়ী)\n• পাঠাও বাইক: ৪০-১০০ টাকা\n\n${DHAKA_KNOWLEDGE.bus_routes.slice(0, 4).map(b => `• বাস ${b.number}: ${b.route}`).join('\n')}\n\nআপনার গন্তব্য আরো নির্দিষ্ট করে বলুন — আরো ভালো পরামর্শ দিতে পারব।`
      : `💰 BUDGET ROUTE OPTIONS for ${dest}:\n\nCheapest options:\n• Bus: 10-60 taka (cheapest)\n• MRT: 20-100 taka (fast + affordable)\n• Pathao Bike: 40-100 taka\n\n${DHAKA_KNOWLEDGE.bus_routes.slice(0, 4).map(b => `• Bus ${b.number}: ${b.route}`).join('\n')}\n\nTell me your exact route and I'll give you a precise answer.`
  }

  // 6. Emergency query
  if (isEmergencyQuery(message)) {
    return bangla
      ? `🚨 জরুরি সাহায্য:\n\n⚡ এখনই করুন:\n• নিকটতম মেট্রো স্টেশনে যান (সবচেয়ে দ্রুত)\n• পাঠাও বাইক কল করুন — যানজটে সবচেয়ে দ্রুত\n• বৃষ্টিতে থাকলে — রিকশায় উঠুন\n\n📞 জরুরি: ৯৯৯ (পুলিশ) | ১৯৯ (ফায়ার সার্ভিস)`
      : `🚨 EMERGENCY HELP:\n\n⚡ DO THIS NOW:\n• Go to nearest MRT station (fastest option)\n• Call Pathao bike — beats all traffic\n• If raining — take a rickshaw, sits above flood water\n\n📞 Emergency: 999 (Police) | 199 (Fire Service)`
  }

  // 7. Generic useful response with MRT and local tips
  return bangla
    ? `আপনার প্রশ্নটি বুঝতে পেরেছি। এখন লাইভ এআই ব্যস্ত — তবে আমার কাছে ঢাকার সম্পূর্ণ তথ্য আছে:\n\n🚇 মেট্রো রেল (এমআরটি লাইন ৬): উত্তরা থেকে মতিঝিল — ২৮ মিনিট, ৮০ টাকা\n🚌 বাস ৮: মিরপুর ১০ থেকে মতিঝিল — ১০-২০ টাকা\n🚌 বাস ৭: মিরপুর থেকে সায়েন্স ল্যাব/আজিমপুর — ১৫ টাকা\n\n${isRaining ? '⚠️ এখন বৃষ্টি হচ্ছে — উঁচু রাস্তা দিয়ে যান।\n' : ''}আপনার যাত্রার বিস্তারিত লিখুন — সঠিক রুট দেব।`
    : `I understand your query. Live AI is temporarily busy — but I have complete Dhaka knowledge:\n\n🚇 MRT Line 6: Uttara → Motijheel in 28 min for 80 taka\n🚌 Bus 8: Mirpur 10 → Motijheel for 10-20 taka\n🚌 Bus 7: Mirpur → Science Lab for 15 taka\n🔑 Secret shortcut: Tejgaon back road bypasses all Mohakhali jams\n\n${isRaining ? '⚠️ It is raining now — use Gulshan Avenue or elevated roads.\n' : ''}Please tell me your exact route and I will help you right away.`
}
