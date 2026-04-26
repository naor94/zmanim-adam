export interface Synagogue {
  id: string
  name: string
  address: string | null
  created_at: string
}

export const PRAYER_TYPES = {
  shacharit: 'שחרית',
  mincha: 'מנחה',
  maariv: 'ערבית',
  musaf: 'מוסף',
  other: 'אחר',
} as const

export type PrayerType = keyof typeof PRAYER_TYPES

export interface Prayer {
  id: string
  type: PrayerType
  custom_name: string | null
  time: string
  days: number[]
  synagogue_id: string
  synagogue?: Synagogue
  notes: string | null
  is_active: boolean
  created_at: string
}

export interface Lesson {
  id: string
  name: string
  teacher: string | null
  time: string
  end_time: string | null
  days: number[]
  synagogue_id: string | null
  synagogue?: Synagogue
  location_text: string | null
  notes: string | null
  is_active: boolean
  created_at: string
}

export interface ShabbatPrayer {
  id: string
  type: PrayerType
  custom_name: string | null
  time: string
  synagogue_id: string
  synagogue?: Synagogue
  notes: string | null
  is_active: boolean
  created_at: string
}

export interface ShabbatLesson {
  id: string
  name: string
  teacher: string | null
  time: string
  synagogue_id: string | null
  synagogue?: Synagogue
  location_text: string | null
  notes: string | null
  is_active: boolean
  created_at: string
}

// 0=Sun(ראשון), 1=Mon(שני), ..., 5=Fri(שישי), 6=Sat(שבת)
export const DAY_NAMES = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת']
export const DAY_NAMES_SHORT = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳']

export interface ZmanimData {
  date: string
  alotHaShachar?: string
  misheyakir?: string
  sunrise?: string
  sofZmanShmaMGA?: string
  sofZmanShma?: string
  sofZmanTfillaMGA?: string
  sofZmanTfilla?: string
  chatzot?: string
  minchaGedola?: string
  minchaKetana?: string
  plagHaMincha?: string
  sunset?: string
  tzait8point5?: string
  tzaitGeonim?: string
}

export interface ShabbatData {
  candleLighting?: string
  havdalah?: string
  parasha?: string
}

export interface HebrewDateData {
  gy: number
  gm: number
  gd: number
  hebrew: string
  hd: number
  hm: string
  hy: number
}

export interface DailyLearning {
  dafYomi?: string
  yerushalmi?: string
  rambam?: string
  mishnaYomi?: string
}
