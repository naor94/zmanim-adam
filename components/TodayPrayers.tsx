"use client"
import { useState, useEffect } from "react"
import type { Prayer, ShabbatPrayer } from "@/types"

const PRAYER_LABEL: Record<string, string> = {
  shacharit: "שחרית",
  mincha: "מנחה",
  maariv: "ערבית",
  musaf: "מוסף",
  other: "אחר",
}

type AnyPrayer = Prayer | ShabbatPrayer

interface Props {
  prayers: AnyPrayer[]
}

function formatTime(t: string) {
  return t.substring(0, 5)
}

function isPast(time: string, now: Date): boolean {
  const [h, m] = time.split(":").map(Number)
  const prayerMinutes = h * 60 + m
  const nowMinutes = now.getHours() * 60 + now.getMinutes()
  return nowMinutes > prayerMinutes
}

export default function TodayPrayers({ prayers }: Props) {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const interval = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="card">
      <div className="section-header">תפילות שמתקיימות היום</div>
      <div>
        {prayers.length === 0 ? (
          <div className="text-center text-gray-400 text-sm py-8">אין תפילות מוזנות להיום</div>
        ) : (
          prayers.map((p) => {
            const past = now ? isPast(p.time, now) : false
            return (
              <div key={p.id} className={["prayer-row", past ? "opacity-35" : ""].join(" ")}>
                <div className="flex-1">
                  <div className={["font-medium", past ? "text-gray-400" : "text-gray-800"].join(" ")}>
                    {p.custom_name || PRAYER_LABEL[p.type] || p.type}
                  </div>
                  {p.synagogue && (
                    <span className={["synagogue-link", past ? "opacity-60" : ""].join(" ")}>{p.synagogue.name}</span>
                  )}
                  {p.notes && (
                    <span className="text-gray-400 text-xs block">{p.notes}</span>
                  )}
                </div>
                <div className={["time-badge", past ? "opacity-40" : ""].join(" ")}>{formatTime(p.time)}</div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
