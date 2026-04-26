"use client"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { Prayer, ShabbatPrayer, Synagogue } from "@/types"
import { DAY_NAMES, PRAYER_TYPES } from "@/types"

interface Props {
  prayer?: Prayer | ShabbatPrayer
  isShabbat?: boolean
  onSave: () => void
  onCancel: () => void
}

const PRAYER_LABEL: Record<string, string> = {
  shacharit: "שחרית",
  mincha: "מנחה",
  maariv: "ערבית",
  musaf: "מוסף",
  other: "אחר",
}

export default function PrayerForm({ prayer, isShabbat = false, onSave, onCancel }: Props) {
  const [type, setType] = useState<string>(prayer?.type || "shacharit")
  const [customName, setCustomName] = useState(prayer?.custom_name || "")
  const [time, setTime] = useState(prayer?.time?.substring(0, 5) || "07:00")
  const [days, setDays] = useState<number[]>((prayer as Prayer)?.days || [0, 1, 2, 3, 4])
  const [synagogueId, setSynagogueId] = useState<string>(prayer?.synagogue_id || "")
  const [notes, setNotes] = useState(prayer?.notes || "")
  const [isActive, setIsActive] = useState(prayer?.is_active ?? true)
  const [synagogues, setSynagogues] = useState<Synagogue[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    supabase
      .from("synagogues")
      .select("*")
      .order("name")
      .then(({ data }) => setSynagogues(data || []))
  }, [])

  function toggleDay(day: number) {
    setDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const table = isShabbat ? "shabbat_prayers" : "prayers"
    const payload: any = {
      type,
      custom_name: customName || null,
      time: time + ":00",
      synagogue_id: synagogueId || null,
      notes: notes || null,
      is_active: isActive,
    }
    if (!isShabbat) {
      payload.days = days
    }

    try {
      if (prayer) {
        const { error } = await supabase.from(table).update(payload).eq("id", prayer.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from(table).insert(payload)
        if (error) throw error
      }
      onSave()
    } catch (err: any) {
      setError(err.message || "שגיאה בשמירה")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label">סוג תפילה *</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className="form-input">
            {Object.entries(PRAYER_TYPES).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="form-label">שעה *</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="form-input"
            required
          />
        </div>
      </div>

      <div>
        <label className="form-label">שם מותאם (אופציונלי)</label>
        <input
          type="text"
          value={customName}
          onChange={(e) => setCustomName(e.target.value)}
          className="form-input"
          placeholder="לדוגמה: שחרית מוקדמת"
        />
      </div>

      <div>
        <label className="form-label">בית כנסת</label>
        <select
          value={synagogueId}
          onChange={(e) => setSynagogueId(e.target.value)}
          className="form-input"
        >
          <option value="">-- ללא --</option>
          {synagogues.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      {!isShabbat && (
        <div>
          <label className="form-label">ימים</label>
          <div className="flex flex-wrap gap-2 mt-1">
            {DAY_NAMES.map((dayName, idx) => (
              <label key={idx} className="flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={days.includes(idx)}
                  onChange={() => toggleDay(idx)}
                  className="rounded"
                />
                <span className="text-sm">{dayName}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="form-label">הערות</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="form-input"
          rows={2}
          placeholder="הערות נוספות..."
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isActive"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="rounded"
        />
        <label htmlFor="isActive" className="text-sm text-gray-700">פעיל</label>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="admin-btn btn-ghost">ביטול</button>
        <button type="submit" disabled={loading} className="admin-btn btn-primary">
          {loading ? "שומר..." : "שמור"}
        </button>
      </div>
    </form>
  )
}
