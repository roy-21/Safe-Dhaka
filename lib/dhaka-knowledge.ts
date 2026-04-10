// SafeRoute Dhaka — Local Knowledge Base
// This is the moat. This is what Google does not have.

export const DHAKA_KNOWLEDGE = {

  flood_roads: {
    high_risk: [
      "Mirpur Road floods within 15 minutes of rain starting",
      "Airport Road (Kurmitola) floods badly — avoid in any rain",
      "Shyamoli area floods from drainage overflow",
      "Malibagh and Rampura low-lying — first to flood",
      "Demra and Jatrabari flood and stay flooded for hours",
      "Sadarghat area floods during heavy monsoon",
    ],
    low_risk: [
      "Gulshan Avenue rarely floods — elevated road",
      "Mirpur DOHS internal roads drain well",
      "Uttara Sector 3-7 roads drain within 30 minutes",
    ]
  },

  rush_hours: {
    morning: { start: "7:30", end: "9:30", severity: "extreme" },
    evening: { start: "17:00", end: "20:00", severity: "extreme" },
    midday: { start: "12:30", end: "13:30", severity: "moderate" },
  },

  prayer_impact: {
    friday_jummah: {
      time: "12:45 to 14:00",
      affected_roads: [
        "Roads near Baitul Mukarram blocked completely",
        "Paltan, Nayapaltan, Motijheel — avoid during Jummah",
        "Mirpur mosques block surrounding roads 1pm-2pm",
        "Gulshan, Banani mosques affect nearby roads"
      ]
    },
    five_daily_prayers: "Minor impact near large mosques, especially Fajar (5am) and Isha (8-9pm)"
  },

  cultural_events: [
    { event: "Pohela Boishakh (April 14)", impact: "Avoid entire Old Dhaka, Ramna area, TSC. City-wide congestion." },
    { event: "Eid ul-Fitr (day before)", impact: "Sadarghat launches packed. Mirpur, Gabtoli bus terminals chaotic." },
    { event: "Eid ul-Adha", impact: "Cattle markets block major roads 1 week before Eid." },
    { event: "Victory Day / Independence Day", impact: "Parade route (Manik Mia Ave) closed morning." },
    { event: "SSC/HSC exam days", impact: "School zones congested 7am-9am across city." },
  ],

  transport_costs_2024: {
    bus: { min: 10, max: 50, note: "Most affordable. Fixed routes. Slow in traffic." },
    cng: {
      short: "40-80 taka under 3km",
      medium: "80-150 taka 3-8km",
      long: "150-300 taka 8km+",
      night_multiplier: "1.5x to 2x after 9pm — always negotiate first"
    },
    rickshaw: { per_km: "20-30 taka per km", note: "Only for short distances. Cannot use on main roads." },
    uber_pathao: { note: "Check app for current price. Usually 1.5x CNG price." },
  },

  reliable_bus_routes: [
    { number: "8", route: "Mirpur 10 → Farmgate → Motijheel", frequency: "Every 10 min" },
    { number: "19", route: "Uttara → Airport → Banani → Mohakhali", frequency: "Every 15 min" },
    { number: "25", route: "Mirpur 1 → Dhanmondi → Azimpur", frequency: "Every 12 min" },
    { number: "29", route: "Gabtoli → Farmgate → Gulistan", frequency: "Every 10 min" },
  ],

  shortcuts_google_doesnt_know: [
    "Kalyanpur inner roads bypass Mirpur Road completely during flooding",
    "Rayer Bazar goli connects Dhanmondi to Mohammadpur without using main road",
    "Tejgaon industrial area shortcut links Farmgate to Gulshan back route",
    "Banani DOHS internal road bypasses Kamal Ataturk Avenue jam",
    "Kathalbagan shortcut connects Dhanmondi to Green Road avoiding Science Lab",
  ],

  vip_convoy_patterns: [
    "Gulshan 1 and 2 — frequent VIP movements, especially morning and evening",
    "Airport road — diplomatic convoys daily",
    "Manik Mia Avenue — political events and state functions",
    "Sher-e-Bangla Nagar — parliament sessions cause closures",
  ],

  school_zone_timings: {
    morning_drop: "7:30am - 8:30am — all school zones congested",
    afternoon_pickup: "1:00pm - 2:30pm — second peak at school zones",
    double_session_schools: "Some schools 7am-12pm and 12pm-5pm — check before advising"
  }
}
