import type { ZmanimData, ShabbatData, HebrewDateData, DailyLearning } from "@/types"

const LATITUDE = 31.96
const LONGITUDE = 35.27
const TIMEZONE = "Asia%2FJerusalem"

function formatDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

function parseTime(iso: string | undefined): string | undefined {
  if (!iso) return undefined
  try {
    const d = new Date(iso)
    const h = String(d.getHours()).padStart(2, "0")
    const m = String(d.getMinutes()).padStart(2, "0")
    return `${h}:${m}`
  } catch {
    return undefined
  }
}

export async function fetchZmanim(date?: Date): Promise<ZmanimData> {
  const d = date ?? new Date()
  const key = formatDate(d)
  const url = `https://www.hebcal.com/zmanim?cfg=json&latitude=${LATITUDE}&longitude=${LONGITUDE}&tzid=${TIMEZONE}&date=${key}`
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } })
    if (!res.ok) throw new Error("fetch failed")
    const json = await res.json()
    const t = json.times || {}
    return {
      date: key,
      alotHaShachar:    parseTime(t.alotHaShachar),
      misheyakir:       parseTime(t.misheyakir),
      sunrise:          parseTime(t.sunrise),
      sofZmanShmaMGA:   parseTime(t.sofZmanShmaMGA),
      sofZmanShma:      parseTime(t.sofZmanShma),
      sofZmanTfillaMGA: parseTime(t.sofZmanTfillaMGA),
      sofZmanTfilla:    parseTime(t.sofZmanTfilla),
      chatzot:          parseTime(t.chatzot),
      minchaGedola:     parseTime(t.minchaGedola),
      minchaKetana:     parseTime(t.minchaKetana),
      plagHaMincha:     parseTime(t.plagHaMincha),
      sunset:           parseTime(t.sunset),
      tzait8point5:     parseTime(t.tzait8point5),
      tzaitGeonim:      parseTime(t.tzaitGeonim),
    }
  } catch {
    return { date: key }
  }
}

export async function fetchShabbatTimes(): Promise<ShabbatData> {
  const url = `https://www.hebcal.com/shabbat?cfg=json&latitude=${LATITUDE}&longitude=${LONGITUDE}&tzid=${TIMEZONE}&m=40`
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } })
    if (!res.ok) throw new Error("fetch failed")
    const json = await res.json()
    let candleLighting: string | undefined
    let havdalah: string | undefined
    let parasha: string | undefined
    for (const item of json.items || []) {
      if (item.category === "candles") candleLighting = parseTime(item.date)
      if (item.category === "havdalah") havdalah = parseTime(item.date)
      if (item.category === "parashat") parasha = item.hebrew || item.title?.replace("Parashat ", "")
    }
    return { candleLighting, havdalah, parasha }
  } catch {
    return {}
  }
}

export async function fetchHebrewDate(date?: Date): Promise<HebrewDateData | null> {
  const d = date ?? new Date()
  const y = d.getFullYear()
  const m = d.getMonth() + 1
  const day = d.getDate()
  const url = `https://www.hebcal.com/converter?cfg=json&g2h=1&gy=${y}&gm=${m}&gd=${day}`
  try {
    const res = await fetch(url, { next: { revalidate: 86400 } })
    if (!res.ok) throw new Error("fetch failed")
    return await res.json()
  } catch {
    return null
  }
}

export async function fetchDailyLearning(date?: Date): Promise<DailyLearning> {
  const d = date ?? new Date()
  const key = formatDate(d)
  const url = `https://www.hebcal.com/hebcal?v=1&cfg=json&dafyomi=on&mishnaYomi=on&rambam1=on&yerushalmi=on&yt=G&year=${d.getFullYear()}&month=${d.getMonth() + 1}&start=${key}&end=${key}`
  try {
    const res = await fetch(url, { next: { revalidate: 86400 } })
    if (!res.ok) throw new Error("fetch failed")
    const json = await res.json()
    const result: DailyLearning = {}
    for (const item of json.items || []) {
      if (item.category === "dafyomi") result.dafYomi = item.hebrew || item.title
      if (item.category === "yerushalmi") result.yerushalmi = item.hebrew || item.title
      if (item.category === "rambam1") result.rambam = item.hebrew || item.title
      if (item.category === "mishnayomi") result.mishnaYomi = item.hebrew || item.title
    }
    return result
  } catch {
    return {}
  }
}
