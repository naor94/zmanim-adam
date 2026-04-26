"use client"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { Lesson, ShabbatLesson, Synagogue } from "@/types"
import { DAY_NAMES } from "@/types"

interface Props {
  lesson?: Lesson | ShabbatLesson
  isShabbat?: boolean
  onSave: () => void
  onCancel: () => void
}

export default function LessonForm({ lesson, isShabbat = false, onSave, onCancel }: Props) {
  const [name, setName] = useState(lesson?.name || "")
  const [teacher, setTeacher] = useState(lesson?.teacher || "")
  const [time, setTime] = useState(lesson?.time?.substring(0, 5) || "20:00")
  const [endTime, setEndTime] = useState((lesson as Lesson)?.end_time?.substring(0, 5) || "")
  const [days, setDays] = useState<number[]>((lesson as Lesson)?.days || [0, 1, 2, 3, 4])
  const [synagogueId, setSynagogueId] = useState<string>(lesson?.synagogue_id || "")
  const [locationText, setLocationText] = useState(lesson?.location_text || "")
  const [notes, setNotes] = useState(lesson?.notes || "")
  const [isActive, setIsActive] = useState(lesson?.is_active ?? true)
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

    const table = isShabbat ? "shabbat_lessons" : "lessons"
    const payload: any = {
      name,
      teacher: teacher || null,
      time: time + ":00",
      end_time: endTime ? endTime + ":00" : null,
      synagogue_id: synagogueId || null,
      location_text: locationText || null,
      notes: notes || null,
      is_active: isActive,
    }
    if (!isShabbat) {
      payload.days = days
    }

    try {
      if (lesson) {
        const { error } = await supabase.from(table).update(payload).eq("id", lesson.id)
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
      <div>
        <label className="form-label">שם השיעור *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="form-input"
          required
          placeholder="לדוגמה: שיעור דף יומי"
        />
      </div>

      <div>
        <label className="form-label">מרצה / רב</label>
        <input
          type="text"
          value={teacher}
          onChange={(e) => setTeacher(e.target.value)}
          className="form-input"
          placeholder="שם המרצה"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label">שעת התחלה *</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="form-input"
            required
          />
        </div>
        <div>
          <label className="form-label">שעת סיום (אופציונלי)</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="form-input"
          />
        </div>
      </div>

      <div>
        <label className="form-label">בית כנסת</label>
        <select
          value={synagogueId}
          onChange={(e) => { setSynagogueId(e.target.value); if (e.target.value) setLocationText("") }}
          className="form-input"
        >
          <option value="">-- ללא (השתמש בטקסט חופשי) --</option>
          {synagogues.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      {!synagogueId && (
        <div>
          <label className="form-label">מיקום (טקסט חופשי)</label>
          <input
            type="text"
            value={locationText}
            onChange={(e) => setLocationText(e.target.value)}
            className="form-input"
            placeholder="לדוגמה: בית פרטי, רחוב הגפן 5"
          />
        </div>
      )}

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
          id="isActiveLesson"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="rounded"
        />
        <label htmlFor="isActiveLesson" className="text-sm text-gray-700">פעיל</label>
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
