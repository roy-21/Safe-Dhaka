// Safe Dhaka — Smart Local Fallback Engine
// When Gemini is unavailable, generates real helpful responses in the correct format
// Output matches: conversational, human-friendly, no markdown/bullets

import { DHAKA_KNOWLEDGE } from './dhaka-knowledge'

const BANGLISH_KEYWORDS = [
  'ami', 'amar', 'kothay', 'jabo', 'jete', 'chai', 'theke',
  'apni', 'bhai', 'apa', 'dada', 'lagbe', 'koto', 'kemon',
  'mirpur', 'motijheel', 'gulshan', 'uttara', 'dhanmondi', 'banani'
]

const ROUTE_KEYWORDS: Record<string, string[]> = {
  mirpur:      ['mirpur', 'মিরপুর'],
  motijheel:   ['motijheel', 'মতিঝিল'],
  uttara:      ['uttara', 'উত্তরা'],
  dhanmondi:   ['dhanmondi', 'ধানমন্ডি'],
  gulshan:     ['gulshan', 'গুলশান'],
  banani:      ['banani', 'বনানী'],
  farmgate:    ['farmgate', 'ফার্মগেট'],
  shahbagh:    ['shahbagh', 'শাহবাগ'],
  buet:        ['buet', 'বুয়েট'],
  airport:     ['airport', 'বিমানবন্দর'],
  bashundhara: ['bashundhara', 'বসুন্ধরা'],
  old_dhaka:   ['old dhaka', 'sadarghat', 'পুরান ঢাকা'],
}

function detectZone(text: string): string[] {
  const lower = text.toLowerCase()
  return Object.entries(ROUTE_KEYWORDS)
    .filter(([, keywords]) => keywords.some(k => lower.includes(k)))
    .map(([zone]) => zone)
}

function isBangla(text: string): boolean {
  if (/[\u0980-\u09FF]/.test(text)) return true
  const lower = text.toLowerCase()
  return BANGLISH_KEYWORDS.some(k => lower.includes(k))
}

function isSchool(text: string): boolean {
  return /school|child|ছেলে|মেয়ে|স্কুল|safe.{0,15}route/i.test(text)
}
function isBudget(text: string): boolean {
  return /taka|tk|bdt|টাকা|budget|cheap|সস্তা/i.test(text)
}
function isFlood(text: string): boolean {
  return /flood|rain|waterlog|বন্যা|জল|বৃষ্টি/i.test(text)
}
function isMRT(text: string): boolean {
  return /metro|mrt|মেট্রো/i.test(text)
}
function isEmergency(text: string): boolean {
  return /emergency|stuck|help|urgent|সাহায্য|দ্রুত/i.test(text)
}

// Extract budget amount
function extractBudget(text: string): number | null {
  const m1 = text.match(/(\d+)\s*(taka|tk)/i)
  if (m1) return parseInt(m1[1])
  const m2 = text.match(/(\d+)\s*টাকা/)
  if (m2) return parseInt(m2[1])
  return null
}

// ─── KNOWN ROUTES (new clean format) ──────────────────────

interface KnownRoute {
  from: string
  to: string
  en: string
  bn: string
}

const KNOWN_ROUTES: KnownRoute[] = [
  {
    from: 'mirpur', to: 'motijheel',
    en: `Fastest route right now:

MRT from Mirpur 10 → Motijheel
(50 taka, 22 min)

No stops needed — direct service.

Budget alternative:
Bus 8 from Mirpur 10 → Motijheel
(15 taka, 60-90 min in traffic)

MRT is the smart choice — saves you 60 min.`,
    bn: `সবচেয়ে দ্রুত রুট:

মেট্রো রেল — মিরপুর ১০ থেকে মতিঝিল
(৫০ টাকা, ২২ মিনিট)

সরাসরি সার্ভিস — কোনো পরিবর্তন লাগবে না।

কম খরচের বিকল্প:
বাস ৮ — মিরপুর ১০ থেকে মতিঝিল
(১৫ টাকা, ৬০-৯০ মিনিট)

মেট্রো রেলই সেরা — ৬০ মিনিট বাঁচাবে।`
  },
  {
    from: 'mirpur', to: 'motijheel', // budget version handled separately
    en: '', bn: ''
  },
  {
    from: 'uttara', to: 'motijheel',
    en: `Fastest route right now:

MRT from Uttara North → Motijheel
(80 taka, 28 min)

Direct — no changes needed.

Road would take 90-120 min during peak hours.
MRT is the only sensible option.`,
    bn: `সবচেয়ে দ্রুত রুট:

মেট্রো রেল — উত্তরা নর্থ থেকে মতিঝিল
(৮০ টাকা, ২৮ মিনিট)

সরাসরি — কোনো পরিবর্তন নেই।

রাস্তায় ৯০-১২০ মিনিট লাগবে পিক আওয়ারে।`
  },
  {
    from: 'mirpur', to: 'dhanmondi',
    en: `Best route right now:

Bus 25 or 29 from Mirpur 10 → Science Lab
(20 taka, 30-40 min)
Then rickshaw to Dhanmondi
(30-40 taka, 10-15 min)

Total: 50-60 taka | Total time: 45-55 min

Avoid Farmgate during rush hour — use Kalyanpur backroad.`,
    bn: `এখনকার সেরা পথ:

বাস ২৫ বা ২৯ — মিরপুর ১০ থেকে সায়েন্স ল্যাব
(২০ টাকা, ৩০-৪০ মিনিট)
তারপর রিকশায় ধানমন্ডি
(৩০-৪০ টাকা, ১০-১৫ মিনিট)

মোট: ৫০-৬০ টাকা | মোট সময়: ৪৫-৫৫ মিনিট

রাশ আওয়ারে ফার্মগেট এড়িয়ে চলুন।`
  },
  {
    from: 'mirpur', to: 'buet',
    en: `Fastest route to BUET:

MRT from Mirpur 10 → Dhaka University Station
(50 taka, 22 min)
Then rickshaw to BUET main gate (Polashi side)
(15 taka, 5 min)

Total: 65 taka | Total time: 28 min

BUET gate is a 5-min rickshaw from DU station — easy.`,
    bn: `বুয়েটের সবচেয়ে দ্রুত পথ:

মেট্রো রেল — মিরপুর ১০ থেকে ঢাকা বিশ্ববিদ্যালয় স্টেশন
(৫০ টাকা, ২২ মিনিট)
তারপর রিকশায় বুয়েট মেইন গেট (পলাশী দিক)
(১৫ টাকা, ৫ মিনিট)

মোট: ৬৫ টাকা | মোট সময়: ২৮ মিনিট`
  },
  {
    from: 'uttara', to: 'dhanmondi',
    en: `Best route right now:

MRT from Uttara → Farmgate Station
(50 taka, 20 min)
Then CNG from Farmgate → Dhanmondi
(80-120 taka, 15-20 min, negotiate before getting in)

Total: 130-170 taka | Total time: 35-40 min`,
    bn: `এখনকার সেরা পথ:

মেট্রো রেল — উত্তরা থেকে ফার্মগেট স্টেশন
(৫০ টাকা, ২০ মিনিট)
তারপর সিএনজিতে ধানমন্ডি
(৮০-১২০ টাকা, ১৫-২০ মিনিট, উঠার আগে দাম ঠিক করুন)

মোট: ১৩০-১৭০ টাকা | মোট সময়: ৩৫-৪০ মিনিট`
  },
  {
    from: 'gulshan', to: 'motijheel',
    en: `Best route right now:

Bus 56 from Gulshan 2 → Motijheel
(25 taka, 35-45 min)

Or Uber/Pathao if in a hurry
(150-250 taka, 25-40 min)

No MRT on this corridor yet — bus is your best bet.`,
    bn: `এখনকার সেরা পথ:

বাস ৫৬ — গুলশান ২ থেকে মতিঝিল
(২৫ টাকা, ৩৫-৪৫ মিনিট)

তাড়া থাকলে উবার/পাঠাও
(১৫০-২৫০ টাকা, ২৫-৪০ মিনিট)

এই রুটে এখনো মেট্রো নেই — বাসই সেরা।`
  }
]

// ─── MAIN FALLBACK FUNCTION ────────────────────────────────

export function generateLocalResponse(
  message: string,
  isRaining: boolean,
  rushHour: boolean
): string {
  const bangla = isBangla(message)
  const zones = detectZone(message)
  const budget = extractBudget(message)

  // Build context suffix
  const rainWarning = isRaining
    ? (bangla
        ? '\n⚠️ বৃষ্টি হচ্ছে — মিরপুর রোড, ডেমরা, মালিবাগ এড়িয়ে চলুন\nউঁচু রাস্তা বেছে নিন'
        : '\n⚠️ Rain active — Mirpur Road, Demra, Malibagh risk flooding\nTake elevated roads')
    : ''
  const rushWarning = rushHour
    ? (bangla
        ? '\n⚠️ রাশ আওয়ার — সব সময়ে ৩০-৪৫ মিনিট যোগ করুন'
        : '\n⚠️ Rush hour — add 30-45 min to all estimates')
    : ''

  // 1. School route
  if (isSchool(message)) {
    const score = isRaining ? 62 : 88
    const status = isRaining ? (bangla ? '🟠 সতর্কতার সাথে যান' : '🟠 Use caution') : (bangla ? '🟢 নিরাপদ' : '✅ Safe today')
    return bangla
      ? `স্কুল রুট চেক:

নিরাপত্তা স্কোর: ${score}/100 — ${status}

এখনকার সেরা পথ:
বাস ৮ — মিরপুর ১০ থেকে ফার্মগেট
(২০ টাকা, ২৫ মিনিট)
তারপর রিকশায় স্কুল গেটে
(৩০ টাকা, ১০ মিনিট)

মোট: ৫০ টাকা | মোট সময়: ৩৫ মিনিট

সকাল ৭:৩০ এর আগে বের হন — স্কুলের ভিড় ৭:৪৫ থেকে শুরু।${rainWarning}`
      : `School route check:

Safety score: ${score}/100 — ${status}

Best route this morning:
Bus 8 from Mirpur 10 → Farmgate
(20 taka, 25 min)
Then rickshaw to school gate
(30 taka, 10 min)

Total: 50 taka | Total time: 35 min

Leave before 7:30am — school rush starts at 7:45am.${rainWarning}`
  }

  // 2. Budget route with specific amount
  if (budget && budget <= 50 && zones.includes('mirpur') && zones.includes('motijheel')) {
    return bangla
      ? `${budget} টাকায় রুট পাওয়া গেছে:

এখনকার সেরা পথ:
বাস ৮ — মিরপুর ১০ থেকে ফার্মগেট
(১৫ টাকা, ২৫ মিনিট)
তারপর বাস ২৯ — মতিঝিল
(১০ টাকা, ২০ মিনিট)

মোট: ২৫ টাকা — আপনি ${budget - 25} টাকা বাঁচাচ্ছেন
মোট সময়: ৪৫ মিনিট${rainWarning}

সিএনজি এড়িয়ে চলুন — ওরা ১২০-১৫০ টাকা নেবে।`
      : `Budget route found for ${budget} taka:

Best option right now:
Bus 8 from Mirpur 10 → Farmgate
(15 taka, 25 min)
Then bus 29 → Motijheel
(10 taka, 20 min)

Total: 25 taka — you save ${budget - 25} taka
Total time: 45 min${rainWarning}

Avoid CNG right now — they will charge 120-150 taka.`
  }

  // 3. MRT info
  if (isMRT(message)) {
    const mrt = DHAKA_KNOWLEDGE.metro_rail
    return bangla
      ? `মেট্রো রেল (এমআরটি লাইন ৬):

স্টেশন: ${mrt.stations.join(' → ')}

ভাড়া: ২০-১০০ টাকা
সময়: প্রতি ৮-১০ মিনিটে ট্রেন
চলাচল: সকাল ৭টা - রাত ৯:৩০

মিরপুর থেকে মতিঝিল — ২২ মিনিট, ৫০ টাকা।
উত্তরা থেকে মতিঝিল — ২৮ মিনিট, ৮০ টাকা।

রাশ আওয়ারে মেট্রো রেলই একমাত্র সঠিক পছন্দ।`
      : `Metro Rail (MRT Line 6):

Stations: ${mrt.stations.join(' → ')}

Fare: 20-100 taka
Frequency: Every 8-10 min
Hours: 7:00am - 9:30pm

Mirpur 10 → Motijheel: 22 min, 50 taka.
Uttara → Motijheel: 28 min, 80 taka.

During rush hour, MRT is the only smart choice.`
  }

  // 4. Flood / rain info
  if (isFlood(message)) {
    return bangla
      ? `বন্যা/জলাবদ্ধতার তথ্য:

এড়িয়ে চলুন (বৃষ্টিতে তাড়াতাড়ি ডুবে):
মিরপুর রোড (কল্যাণপুর-শ্যামলী)
ডেমরা-যাত্রাবাড়ী রোড
মালিবাগ-মৌচাক
রায়েরবাজার-বসিলা

নিরাপদ উঁচু রাস্তা:
গুলশান অ্যাভিনিউ
ধানমন্ডি ২৭ নম্বর
উত্তরা সেক্টর ৩-৭
মেট্রো রেল (বন্যায় সবচেয়ে ভালো)

টিপস: বন্যায় রিকশা সবচেয়ে ভালো — গাড়ির চেয়ে উঁচুতে থাকে।`
      : `Flood road intelligence:

Avoid these (flood fast in rain):
Mirpur Road (Kalyanpur to Shyamoli)
Demra-Jatrabari Road
Malibagh-Mouchak
Rayer Bazar-Bosila Road

Safe elevated roads:
Gulshan Avenue (best drainage in city)
Dhanmondi Road 27
Uttara Sector 3-7
MRT Line 6 (best in any rain)

Tip: Rickshaw sits higher than cars — best in floods.`
  }

  // 5. Emergency
  if (isEmergency(message)) {
    return bangla
      ? `এখনই করুন:
নিকটতম মেট্রো স্টেশনে যান — সবচেয়ে দ্রুত
অথবা পাঠাও বাইক কল করুন — যানজটে সবচেয়ে কার্যকর
বৃষ্টি থাকলে রিকশায় উঠুন — বন্যার পানির উপরে থাকবেন

জরুরি নম্বর: ৯৯৯ (পুলিশ) | ১৯৯ (ফায়ার সার্ভিস)`
      : `Do this right now:
Go to the nearest MRT station — fastest option in any traffic
Or call Pathao bike — cuts through jams faster than anything
If raining, take a rickshaw — sits above flood water

Emergency: 999 (Police) | 199 (Fire Service)`
  }

  // 6. Known exact routes
  const filteredRoutes = KNOWN_ROUTES.filter(r => r.en !== '') // skip placeholder
  for (const route of filteredRoutes) {
    if (zones.includes(route.from) && zones.includes(route.to)) {
      const base = bangla ? route.bn : route.en
      return rainWarning || rushWarning ? `${base}${rainWarning}${rushWarning}` : base
    }
  }

  // 7. Generic helpful response
  return bangla
    ? `আপনার প্রশ্ন পেয়েছি।

এখন লাইভ এআই ব্যস্ত — তবে এখানে কিছু তথ্য দিচ্ছি:

মেট্রো রেল: উত্তরা থেকে মতিঝিল — ২৮ মিনিট, ৮০ টাকা
বাস ৮: মিরপুর ১০ থেকে মতিঝিল — ১৫ টাকা
বাস ৭: মিরপুর থেকে সায়েন্স ল্যাব — ১৫ টাকা${rainWarning || rushWarning ? `\n${rainWarning}${rushWarning}` : ''}

আপনার নির্দিষ্ট রুটটি বলুন — আরও ভালো পরামর্শ দিতে পারব।`
    : `Got your question.

Live AI is temporarily busy — here's what I know right now:

MRT Line 6: Uttara → Motijheel in 28 min for 80 taka
Bus 8: Mirpur 10 → Motijheel for 15 taka
Bus 7: Mirpur → Science Lab for 15 taka${rainWarning || rushWarning ? `\n${rainWarning}${rushWarning}` : ''}

Tell me your exact route and I'll give you a precise answer.`
}
