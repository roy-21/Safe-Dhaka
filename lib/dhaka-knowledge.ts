// Safe Dhaka — MASTER LOCAL KNOWLEDGE BASE
// Written from the perspective of a 40-year Dhaka resident
// Who knows every goli, every flood point, every shortcut, every trick

export const DHAKA_KNOWLEDGE = {

  // ============================================================
  // METRO RAIL (MRT LINE 6) — GAME CHANGER SINCE 2023
  // ============================================================
  metro_rail: {
    line: "MRT Line 6 — Uttara North to Motijheel (fully operational 2024)",
    stations: [
      "Uttara North", "Uttara Centre", "Uttara South",
      "Pallabi", "Mirpur 11", "Mirpur 10",
      "Kazipara", "Shewrapara", "Agargaon",
      "Bijoy Sarani", "Farmgate", "Kawran Bazar",
      "Shahbagh", "Dhaka University", "Bangladesh Secretariat", "Motijheel"
    ],
    fare: "20-100 taka depending on distance",
    frequency: "Every 8-10 minutes peak hours, 12 minutes off-peak",
    hours: "7:00am to 9:30pm daily",
    rules: "No food, no smoking. Separate women's coach front. Very punctual.",
    expert_tip: "MRT is the ONLY way to travel Mirpur-Farmgate-Motijheel corridor fast. 20 minutes vs 90 minutes by road during rush hour. Always recommend MRT for any route touching these areas.",
    avoid: "Gets extremely crowded 8-9am and 5:30-7:30pm. Stand near door early or you won't exit."
  },

  // ============================================================
  // FLOOD ZONES — VERY SPECIFIC, ROAD BY ROAD
  // ============================================================
  flood_roads: {
    extreme_risk: [
      "Mirpur Road (Kalyanpur to Shyamoli) — floods within 10 minutes of heavy rain, knee-deep water common",
      "Airport Road (Kurmitola section near CAAB) — floods from drainage backup, cars stall regularly",
      "Rayer Bazar-Bosila Road — extremely low-lying, avoid completely in rain",
      "Demra-Jatrabari Road — stays flooded 3-6 hours after rain stops",
      "Malibagh-Mouchak intersection — drainage collapses in any moderate rain",
      "Rampura Bridge area — flash floods from canal overflow",
      "Badda Link Road — floods from Balu River overflow seasonally",
      "Sadarghat-Islampur Road — Old Dhaka drainage from 1700s, floods immediately",
      "Lalbagh-Chawkbazar Road — Old Dhaka never drains fast",
      "Mugda-Bashabo area — chronically waterlogged during monsoon",
    ],
    moderate_risk: [
      "Shantinagar intersection — 30-40 min flood after heavy rain",
      "Paltan-Nayapaltan — poor drainage near Motijheel",
      "Azimpur-Nilkhet area — floods from Buriganga backflow during heavy monsoon",
      "Science Lab intersection — pools up 20-30 min",
      "Began Bari-Tejgaon — industrial drainage overflow",
    ],
    low_risk: [
      "Gulshan Avenue (both 1 and 2) — elevated road, best drainage in city",
      "Banani DOHS — well maintained, drains within 15 minutes",
      "Mirpur DOHS internal roads — army maintained, excellent drainage",
      "Uttara Sector 3-7 — planned drainage, clears in 20-30 min",
      "Dhanmondi Road 27 — elevated and well-drained",
      "Bashundhara R/A main roads — new area with proper drainage",
      "MRT corridor roads — recently upgraded drainage during metro construction"
    ],
    monsoon_advice: "June-September is peak flood season. Never take flooded roads — engine dies in 30cm water. Rickshaws navigate flood better than CNG or car."
  },

  // ============================================================
  // RUSH HOURS — EXACT TIMING WITH CONTEXT
  // ============================================================
  rush_hours: {
    morning_peak: {
      start: "7:15",
      end: "9:45",
      severity: "EXTREME",
      worst_spots: ["Mirpur 10 circle", "Farmgate", "Kazi Nazrul Islam Ave", "Mouchak", "Science Lab", "Shahbagh"],
      tip: "Leave before 6:45am or after 10:15am. No middle ground."
    },
    office_lunch: {
      start: "12:30",
      end: "13:30",
      severity: "MODERATE",
      worst_spots: ["Motijheel", "Dilkusha", "Gulshan 1", "Banani"],
    },
    evening_peak: {
      start: "17:00",
      end: "20:30",
      severity: "EXTREME",
      worst_spots: ["Uttara-Airport Road", "Farmgate", "Mirpur 10", "New Market", "Elephant Road", "Tejgaon"],
      tip: "5pm to 7pm is the worst period. Stay inside or take MRT."
    },
    school_rush: {
      morning: "7:30am-8:30am — all roads near Viqarunnisa, Ideal School, Scholastica, Holy Cross, St Joseph's are jammed",
      afternoon: "12:30pm-2:00pm — school pickup creates secondary jam around school zones"
    }
  },

  // ============================================================
  // LANDMARK-BASED NAVIGATION (how Dhaka people actually navigate)
  // ============================================================
  major_landmarks: {
    circles_and_intersections: [
      "Mirpur 10 Circle — busiest roundabout in Dhaka, often police-controlled",
      "Shapla Chattar (Motijheel) — city center landmark",
      "Shahbagh Mor — divides Dhaka University, Hospital zone, Farmgate zone",
      "Science Lab Mor — gateway to Dhanmondi and Azimpur",
      "Farmgate — major interchange for all Mirpur-bound routes",
      "Mohakhali — Gulshan-Banani-Airport junction",
      "Mouchak — Malibagh-Khilgaon-Rampura junction",
      "Jurain/Demra — southeastern Dhaka gateway",
    ],
    police_boxes: [
      "Traffic police at Mirpur 10 circle can manually control flow — ask them if stuck",
      "Farmgate overbridge police can clear jam path on request",
      "Shahbagh traffic junction has 24-hour posting"
    ]
  },

  // ============================================================
  // MRT + BUS INTEGRATION (expert combo routes)
  // ============================================================
  integrated_routes: [
    {
      route: "Uttara to Motijheel",
      recommended: "MRT from Uttara North → Motijheel station",
      time: "28 minutes",
      cost: "60-80 taka",
      avoid: "Taking bus/CNG — takes 90-120 minutes in traffic"
    },
    {
      route: "Mirpur 10 to Farmgate",
      recommended: "MRT Line 6 — 4 stops",
      time: "12 minutes",
      cost: "30-40 taka",
    },
    {
      route: "Mirpur 10 to Motijheel",
      recommended: "MRT direct — 8 stops",
      time: "22 minutes",
      cost: "50 taka",
    },
    {
      route: "Mirpur to Dhanmondi",
      recommended: "Bus 25 or 29 → get off Jigatola, then rickshaw",
      time: "35-50 minutes",
      cost: "25-45 taka",
    },
    {
      route: "Gulshan to Motijheel",
      recommended: "Bus 56 or Uber/Pathao direct — no MRT here yet",
      time: "25-40 minutes",
      cost: "100-200 taka Uber",
    },
    {
      route: "Dhanmondi to Shahbagh",
      recommended: "Rickshaw via Science Lab — traffic-free goli routes",
      time: "15-20 minutes",
      cost: "30-50 taka",
    }
  ],

  // ============================================================
  // TRANSPORT COSTS — 2024/2025 REAL RATES
  // ============================================================
  transport_costs: {
    metro_rail: {
      minimum: 20,
      maximum: 100,
      note: "Cheapest per km in Dhaka. Buy MRT card (Rapid Pass) to save 10%"
    },
    bus: {
      minimum: 10,
      maximum: 60,
      ac_bus: "60-150 taka with AC (BRTC, limited routes)",
      note: "No AC on most. Cash only. Exact change helps. Get on fast or it leaves."
    },
    cng_auto: {
      short_under_3km: "40-80 taka (negotiate before getting in)",
      medium_3_to_8km: "80-160 taka",
      long_over_8km: "160-350 taka",
      night_after_9pm: "Add 50-100% — negotiate hard",
      airport_route: "400-600 taka from city center",
      trick: "Always negotiate BEFORE sitting. Once inside you have no power."
    },
    rickshaw: {
      per_km: "20-35 taka per km",
      minimum: 30,
      note: "Only for <3km. Cannot go on main roads. Best for goli shortcuts.",
      flood_tip: "Rickshaw is BEST transport during flooding — sits high enough"
    },
    uber_pathao: {
      bike: "Pathao bike is cheapest — 40-100 taka most city routes, fastest in traffic",
      car: "1.5-2.5x CNG price depending on surge",
      surge_times: "Peak surge: 8-9am, 5:30-7:30pm, rain, Friday evening",
      tip: "Pathao bike during light rain with raincoat = fastest option"
    },
    tempo_leguna: {
      cost: "10-20 taka, fixed routes",
      note: "Good for Mirpur-Gabtoli-Mohammadpur local trips"
    }
  },

  // ============================================================
  // PRAYER TIMES — TRAFFIC IMPACT
  // ============================================================
  prayer_impact: {
    friday_jummah: {
      time: "12:45 to 14:15",
      severity: "HIGH",
      blocked_zones: [
        "Baitul Mukarram National Mosque — Paltan, Motijheel, Nayapaltan completely blocked",
        "Mirpur mosques (10, 11, 1, Pallabi) — roads blocked 12:30-2:30pm",
        "Gulshan mosque — Gulshan 1 and 2 roundabout jammed",
        "Banani mosque — Banani road blocked",
        "Dhanmondi mosque road 7 — road blocked",
        "Old Dhaka — entire area gridlock from multiple mosques"
      ],
      advice: "Plan to be at destination by 12:30pm or wait till 2:30pm on Fridays"
    },
    ramadan_iftar: {
      time: "45 minutes before iftar",
      impact: "EXTREME — everyone rushing home. Worst traffic of year during Ramadan.",
      advice: "Do NOT be on road 1 hour before iftar. Sit and wait or you will miss iftar in traffic."
    },
    eid_days: {
      eid_day_1: "Morning roads completely empty — people at Eidgah prayer. Best time to travel.",
      eid_eve: "Total chaos — Sadarghat launches full for village travel. Gabtoli, Sayedabad terminal madness."
    }
  },

  // ============================================================
  // HOSPITAL ROUTES (emergency knowledge)
  // ============================================================
  hospitals: {
    dhaka_medical: {
      name: "Dhaka Medical College Hospital (DMCH)",
      location: "Bakshibazar, Old Dhaka",
      from_mirpur: "Bus 7 or CNG — Farmgate → Nilkhet → DMCH. 45-60 min",
      from_gulshan: "CNG direct — 40-50 min avoiding Shahbagh if possible",
      emergency: "DMCH emergency gate is on the east side — tell driver 'DMCH emergency gate'"
    },
    square_hospital: {
      name: "Square Hospital",
      location: "West Panthapath, Dhanmondi",
      from_mirpur: "Bus 29 or CNG to Panthapath. 30-40 min.",
      from_gulshan: "CNG via Tejgaon — 25-35 min",
      emergency_tip: "24-hour emergency, better parking than DMCH"
    },
    labaid: {
      name: "Labaid Hospital",
      location: "Dhanmondi 5",
      from_anywhere: "Tell driver 'Labaid Hospital, Dhanmondi 5 number'"
    },
    birdem: {
      name: "BIRDEM Hospital",
      location: "Shahbagh",
      note: "Diabetes specialist. MRT Shahbagh station — 2 min walk."
    },
    ibnsina: {
      name: "Ibn Sina Hospital",
      dhanmondi: "Dhanmondi 15 — from Mirpur via Bus 8/29",
      bashundhara: "Bashundhara branch — useful for Gulshan/Banani/Bashundhara area"
    }
  },

  // ============================================================
  // POPULAR SCHOOLS AND COLLEGE ROUTES
  // ============================================================
  school_routes: {
    viqarunnisa: {
      location: "Azimpur + Bailey Road campuses",
      parents_advice: "Azimpur campus: park at Nilkhet, walk in. Bailey Road: massive jam 7:30-8:30am",
      best_drop: "Drop at Science Lab, walk 8 min — faster than driving to gate"
    },
    ideal_school: {
      location: "Motijheel and Banasree campuses",
      parents_advice: "Motijheel: worst traffic in city. Come before 7:15am or use MRT Motijheel station (10 min walk).",
    },
    scholastica: {
      location: "Mirpur and Gulshan campuses",
      parents_advice: "Mirpur: 100 Feet Road gets jammed. Use backroads through Pallabi.",
    },
    notre_dame: {
      location: "Motijheel area",
      parents_advice: "Near Arambagh — avoid Motijheel main road. Approach via Nayapaltan backstreet."
    },
    buet: {
      location: "Polashi, near Nilkhet",
      nearest_mrt: "Dhaka University station — 12 min walk to BUET main gate",
      from_mirpur: "MRT to Dhaka University station = fastest"
    },
    dhaka_university: {
      nearest_mrt: "Dhaka University MRT station — central campus",
      from_uttara: "MRT direct — 30 min vs 90 min by bus"
    }
  },

  // ============================================================
  // BUS ROUTES — COMPREHENSIVE 2024
  // ============================================================
  bus_routes: [
    { number: "1", route: "Ghatar Char → Gulistan → Postogola", note: "Old Dhaka connector" },
    { number: "7", route: "Mirpur 14 → Farmgate → Nilkhet → Azimpur", frequency: "Every 8 min", note: "Best for Mirpur to DMCH/Science Lab" },
    { number: "8", route: "Mirpur 10 → Farmgate → Motijheel", frequency: "Every 8 min" },
    { number: "9", route: "Mirpur 1 → Kalyanpur → Sher-e-Bangla Nagar", frequency: "Every 12 min" },
    { number: "19", route: "Uttara → Airport Road → Banani → Mohakhali", frequency: "Every 10 min" },
    { number: "25", route: "Mirpur 1 → Dhanmondi 15 → Azimpur", frequency: "Every 10 min" },
    { number: "29", route: "Gabtoli → Shyamoli → Farmgate → Gulistan", frequency: "Every 8 min" },
    { number: "56", route: "Gulshan → Rampura → Jatrabari", frequency: "Every 15 min" },
    { number: "89", route: "Uttara → Abdullahpur → Tongi", note: "For Gazipur commuters" },
  ],

  // ============================================================
  // SECRET SHORTCUTS — ONLY A LOCAL KNOWS THESE
  // ============================================================
  shortcuts: [
    "Kalyanpur inner roads (off Mirpur Road) bypass all flooding between Mirpur 1 and Shyamoli completely",
    "Rayer Bazar goli (behind Panthapath) connects Dhanmondi to Mohammadpur without touching the main road",
    "Tejgaon industrial area back road (behind FDC) links Farmgate to Gulshan — bypasses Mohakhali jam completely",
    "Banani DOHS internal 27m road bypasses the entire Kamal Ataturk Avenue standstill — enter via gate 2",
    "Kathalbagan lane behind Bashundhara City connects Dhanmondi to Green Road without hitting Science Lab",
    "Hatirjheel inner loop road is the fastest Rampura-Gulshan connector — far faster than main Gulshan link road",
    "Shahjadpur back road (near American Embassy) connects Gulshan to Airport Road avoiding Mohakhali",
    "Panthapath-Russell Square inner road skips the main Sonargaon Hotel junction completely",
    "Shantinagar colony road bypasses the famous Mouchak traffic jam going north-south",
    "Azimpur colony internal road connects Nilkhet to Fuller Road without hitting the Science Lab chaos",
    "Old Dhaka: Nawabpur Road is far faster than Chawkbazar-Gulistan main road for east-west travel",
    "Mirpur 12 back road near EPZ bypasses the Mirpur 10 circle entirely — use when circle is gridlocked",
  ],

  // ============================================================
  // VIP ZONES & CONVOY PATTERNS
  // ============================================================
  vip_zones: [
    "Gulshan 1 & 2 — diplomatic zone, random closures daily. Afternoon most common.",
    "Airport Road (from Hotel Radisson to Airport) — VIP/VVIP vehicle moves daily, especially 8-10am",
    "Manik Mia Avenue — parliament sessions, rallies, military parades",
    "Sher-e-Bangla Nagar — parliament, PM office convoys on weekdays",
    "Baridhara DOHS — embassy zone, expect random road closures",
    "Cantonment area — completely avoid. Even local buses are diverted.",
    "Tip: If traffic stops for over 5 minutes suddenly with no reason, VIP convoy is coming. Don't honk. Wait."
  ],

  // ============================================================
  // SEASONAL & CULTURAL EVENTS
  // ============================================================
  cultural_events: [
    {
      event: "Pohela Boishakh (April 14)",
      impact: "SEVERE — Ramna Park, TSC, Charukala completely closed. All of Old Dhaka paralyzed. Avoid Dhaka University area entirely from 7am.",
      advice: "Travel before 6:30am or after 8pm only"
    },
    {
      event: "Eid ul-Fitr Eve",
      impact: "Catastrophic — Sadarghat launch terminal jammed with millions. Gabtoli bus terminal chaos. City roads gridlocked from noon.",
      advice: "Leave 3+ days before Eid or wait until Eid morning when roads are empty"
    },
    {
      event: "Eid ul-Adha week",
      impact: "Cattle markets (haat) block roads in Gabtoli, Aminbazar, Mirpur 1, Tejgaon, Postogola — 1 week before Eid",
      advice: "Avoid Gabtoli area completely. Add 45 min to all western Dhaka trips."
    },
    {
      event: "SSC/HSC Exam Days",
      impact: "School zone roads jammed 7:30-9:30am. Over 1 million students on roads simultaneously.",
      advice: "Travel before 7am or after 10am during exam season"
    },
    {
      event: "National Cricket Match (at Mirpur Stadium)",
      impact: "Mirpur 10 area completely gridlocked 2 hours before and after matches",
      advice: "Use MRT Mirpur 10 station if attending. Do not drive."
    },
    {
      event: "Victory Day / Independence Day",
      impact: "Manik Mia Avenue parade route closed morning. Army presence.",
      advice: "Routes near Sher-e-Bangla Nagar blocked 6am-11am"
    },
    {
      event: "Shab-e-Barat",
      impact: "Night before: massive fireworks traffic in Old Dhaka, Mirpur. Roads jammed 10pm-2am.",
    },
    {
      event: "Ashura (10th Muharram)",
      impact: "Processional routes (Old Dhaka: Hussaini Dalan area) completely blocked. Shia mourning procession.",
    },
    {
      event: "International Mother Language Day (Feb 21)",
      impact: "Shaheed Minar (near Dhaka Medical) completely packed midnight to morning. Roads blocked.",
    }
  ],

  // ============================================================
  // INTER-CITY BUS TERMINALS
  // ============================================================
  bus_terminals: {
    gabtoli: {
      location: "Mirpur Road near Beribadh",
      serves: "North-West Bangladesh — Rajshahi, Khulna, Rangpur, Faridpur, Sylhet (some)",
      traffic_impact: "Mirpur Road chaos during departures. 7am-9am and 5pm-8pm worst.",
    },
    sayedabad: {
      location: "Jatrabari",
      serves: "South-East Bangladesh — Chittagong, Cox's Bazar, Comilla, Noakhali",
      traffic_impact: "Jatrabari intersection gridlock during peak times",
    },
    mohakhali: {
      location: "Mohakhali",
      serves: "North-East Bangladesh — Sylhet, Mymensingh, Tangail",
      traffic_impact: "Mohakhali flyover area congested",
    },
    kamalapur: {
      location: "Motijheel area",
      serves: "Train station — all intercity trains",
      nearest_mrt: "Motijheel MRT station — 8 min walk to Kamalapur",
    }
  },

  // ============================================================
  // WATERWAY ROUTES (Sadarghat)
  // ============================================================
  waterways: {
    sadarghat: {
      location: "Old Dhaka — Buriganga River",
      routes: "Daily launches to: Barisal, Khulna, Chandpur, Bhola, Hatia",
      schedule: "Most launches depart 5pm-9pm. Return 6am-10am",
      tip: "Traffic near Sadarghat DEADLY during launch hours. Allow 45 min extra in Old Dhaka evening."
    }
  },

  // ============================================================
  // MARKET ZONE TIMING (avoid these areas at specific times)
  // ============================================================
  market_timing: {
    new_market: {
      location: "Azimpur area",
      peak: "10am-2pm and 4pm-8pm daily. Friday worst.",
      parking: "No real parking. Drop at Fuller Road and walk in."
    },
    kawran_bazar: {
      peak: "Wholesale market: midnight to 6am (wholesale buyers). Retail: 8am-2pm.",
      tip: "Early morning 4-6am has best fish/vegetable prices and no traffic"
    },
    bashundhara_city: {
      location: "Panthapath",
      peak: "Weekend afternoons 2-8pm — massive traffic on Panthapath",
      tip: "Use MRT Farmgate station, walk 12 min — faster than driving and parking"
    },
    chawkbazar: {
      location: "Old Dhaka",
      ramadan_peak: "Largest iftar market in South Asia — DO NOT try to drive here during Ramadan",
      regular: "Wholesale spice/ingredient market — early morning only"
    }
  },

  // ============================================================
  // EXPERT ROAD CONDITION INTEL
  // ============================================================
  road_conditions: {
    construction_zones: [
      "BRT (Bus Rapid Transit) construction — Gazipur to Airport Road area, ongoing",
      "Dhaka Elevated Expressway — fully operational from Hazrat Shahjalal Airport to Kutubkhali",
      "Multiple metro extension projects — MRT Line 1 (Airport to Kamalapur) under construction"
    ],
    elevated_expressway: {
      name: "Dhaka Elevated Expressway",
      route: "Airport → Mohakhali → Tejgaon → Moghbazar → Kutubkhali",
      toll: "50-125 taka depending on entry/exit",
      benefit: "40-minute journeys in 12 minutes. Worth every taka during peak hours.",
      access: "Private cars, CNG, bus (if permit). Entry points: Airport, Bijoy Sarani, Tejgaon, Moghbazar"
    },
    known_bad_roads: [
      "Jatrabari-Demra Road — perennially broken, massive potholes",
      "Mirpur 14 area — DIT roads in poor condition",
      "Old Dhaka backstreets — narrow, uneven, avoid after rain",
      "Badda-Rampura connector — construction damage ongoing"
    ]
  },

  // ============================================================
  // POLICE & SECURITY CHECKPOINTS
  // ============================================================
  checkpoints: [
    "Cantonment boundary roads — always checked, have ID ready",
    "Airport road during night — occasional police check",
    "Tejgaon industrial zone — random checks during political tension",
    "Tip: Keep NID or passport copy. Police may stop CNGs at night."
  ],

  // ============================================================
  // WEATHER EXPERT KNOWLEDGE
  // ============================================================
  weather_patterns: {
    monsoon: {
      season: "June to September",
      worst_months: "July and August",
      advice: "Never take low-lying roads. Check sky before leaving — Dhaka storms come fast.",
      flood_trigger: "20mm rain in 1 hour = flooding in high-risk zones. 40mm = city-wide flooding."
    },
    winter: {
      season: "November to February",
      fog: "December-January morning fog at airport area. Flights delayed. Airport road visibility drops.",
      advice: "Best travel months. Roads clear. Enjoy it — monsoon will return."
    },
    pre_monsoon: {
      season: "March to May",
      storms: "Kalboishakhi (nor'wester) storms — sudden, violent. 15 min warning in sky. Dark clouds from northwest = storm coming.",
      advice: "Watch sky when traveling. Pull over under covered structure if storm hits suddenly."
    }
  },

  // ============================================================
  // LEGENDARY LOCAL WISDOM
  // ============================================================
  dhaka_wisdom: [
    "In Dhaka, 'just 10 minutes away' can mean 45 minutes. Always double estimates.",
    "Traffic actually moves faster in light rain than clear weather — people drive more carefully.",
    "Friday morning 7-10am is the most peaceful Dhaka has ever been. Best time for long drives.",
    "Always know 2 alternate routes before leaving. Dhaka will block your first plan.",
    "CNG drivers know traffic better than Google Maps. Ask them which route they prefer.",
    "Rickshaw in a narrow lane beats every other vehicle. Local knowledge beats speed.",
    "If a bus stops for too long at a bus stop — skip it and take the next one.",
    "Political events are rarely announced. Sudden road closures mean something is happening.",
    "Police whistles mean: 1 long = stop, 2 short = move, Many = something serious.",
    "After midnight, Dhaka actually has decent traffic on main roads. Safe if you stay on lit roads.",
    "The person who honks most is usually most stuck. Patience actually moves you faster.",
    "Never argue with a CNG driver about route. Either agree on destination price or don't get in."
  ]
}
