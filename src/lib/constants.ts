export const TOTAL_FRAMES = 755

export type TextAlign = 'left' | 'right'

export interface Beat {
  id: string
  chapter: string
  chapterLabel: string
  eyebrow: string
  headline: string
  body: string
  tags: string[]
  frameStart: number
  frameEnd: number
  textAlign: TextAlign
  showCTA: boolean
  alertBeat: boolean
}

/**
 * Beat cut points, in frames. These must tile 0 … TOTAL_FRAMES - 1 with no
 * gaps — a beat whose range falls outside that window simply never fires.
 * Re-scale them whenever TOTAL_FRAMES changes (currently five equal 151-frame
 * beats across 755); hand-tune them to your real footage once it's cut.
 */
export const BEATS: Beat[] = [
  {
    id: 'home',
    chapter: '01',
    chapterLabel: 'The Home',
    eyebrow: 'MEET THE ALD',
    headline: 'Your alarm\nsystem.\nOur monitoring.',
    body: 'The ALD is a small device that plugs into a wall outlet near your alarm. It listens for your siren — so when your alarm goes off, we hear it too.',
    tags: ['No Contract', 'No Technician', 'Plug-and-Play'],
    frameStart: 0,
    frameEnd: 150,
    textAlign: 'left',
    showCTA: false,
    alertBeat: false,
  },
  {
    id: 'device',
    chapter: '02',
    chapterLabel: 'The Device',
    eyebrow: 'ALARM LISTENING DEVICE',
    headline: 'Small device.\nBig difference.',
    body: "Plug the ALD into any standard outlet near your alarm panel. Connect it to Wi-Fi in the app. That's the hardest part — and it takes 60 seconds.",
    tags: ['Any Alarm Brand', 'Wired or Wireless', 'Old or New'],
    frameStart: 151,
    frameEnd: 301,
    textAlign: 'right',
    showCTA: false,
    alertBeat: false,
  },
  {
    id: 'trigger',
    chapter: '03',
    chapterLabel: 'Detection',
    eyebrow: 'REAL-TIME DETECTION',
    headline: 'It hears your\nsiren first.',
    body: "When your alarm sounds, the ALD listens for a few seconds to confirm it's a real alarm — not a door chime or the TV. Then it sends the alert instantly.",
    tags: ['< 30 Second Alert', 'False Alarm Filter', 'AES-256 Encrypted'],
    frameStart: 302,
    frameEnd: 452,
    textAlign: 'left',
    showCTA: false,
    alertBeat: true,
  },
  {
    id: 'soc',
    chapter: '04',
    chapterLabel: 'Monitoring',
    eyebrow: '24/7 PROFESSIONAL MONITORING',
    headline: 'A real person\nsees your alarm.',
    body: 'Not an app. Not a chatbot. A trained operator at our UL-listed monitoring center confirms the signal and calls the police for you — if needed.',
    tags: ['UL Listed Center', 'Licensed & Insured', '365 Days a Year'],
    frameStart: 453,
    frameEnd: 603,
    textAlign: 'right',
    showCTA: false,
    alertBeat: false,
  },
  {
    id: 'protected',
    chapter: '05',
    chapterLabel: 'Protected',
    eyebrow: 'FROM $9.99/MONTH',
    headline: 'Your home.\nProtected.',
    body: 'No long-term contracts. No technician visits. No new wiring. Just the monitoring your alarm always needed — starting at $9.99 a month.',
    tags: ['No Contract. Ever', 'Cancel Any Time', 'From $9.99/mo'],
    frameStart: 604,
    frameEnd: 754,
    textAlign: 'left',
    showCTA: true,
    alertBeat: false,
  },
]

export const COVERED_STATES = [
  'Alabama',
  'Alaska',
  'Colorado',
  'Connecticut',
  'Delaware',
  'Florida',
  'Georgia',
  'Hawaii',
  'Idaho',
  'Indiana',
  'Iowa',
  'Kansas',
  'Kentucky',
  'Louisiana',
  'Maine',
  'Massachusetts',
  'Minnesota',
  'Mississippi',
  'Missouri',
  'Montana',
  'Nebraska',
  'Nevada',
  'New Hampshire',
  'New Jersey',
  'New Mexico',
  'New York',
  'North Carolina',
  'North Dakota',
  'Ohio',
  'Oregon',
  'Pennsylvania',
  'Rhode Island',
  'South Carolina',
  'South Dakota',
  'Texas',
  'Vermont',
  'West Virginia',
  'Wisconsin',
  'Wyoming',
]

export const LAUNCH_STATE = 'Florida'

export const BRAND = {
  navy: '#0D1B3E',
  navyLight: '#1a2d5a',
  navyDeep: '#080f22',
  red: '#C8102E',
  steel: '#8A9BB5',
  mist: '#D1D9E8',
}

export const COMPANY = {
  name: 'Alarmion',
  tagline: 'The Monitoring. Not The Hardware.',
  phone: '888-502-3445',
  phoneHref: 'tel:+18885023445',
  site: 'https://alarmion.com',
  shop: 'https://alarmion.com/shop',
  faqs: 'https://alarmion.com/faqs',
  licenses: 'https://alarmion.com/licenses',
  terms: 'https://alarmion.com/terms',
  privacy: 'https://alarmion.com/privacy',
}

export const NAV_LINKS = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Coverage', href: '#coverage' },
]
