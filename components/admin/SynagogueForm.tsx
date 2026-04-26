"use client"
import { useState } from "react"
import { supabase } from "@/lib/supabase"
import type { Synagogue } from "@/types"

interface Props {
  synagogue?: Synagogue
  onSave: () => void
  onCancel: () => void
}

export default function SynagogueForm({ synagogue, onSave, onCancel }: Props) {
  const [name, setName] = useState(synagogue?.name || "")
  const [address, setAddress] = useState(synagogue?.address || "")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      if (synagogue) {
        const { error } = await supabase
          .from("synagogues")
          .update({ name, address: address || null })
          .eq("id", synagogue.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from("synagogues")
          .insert({ name, address: address || null })
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
        <label className="form-label">שם בית הכנסת *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="form-input"
          required
          placeholder="לדוגמה: בית כנסת המרכזי"
        />
      </div>
      <div>
        <label className="form-label">כתובת</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="form-input"
          placeholder="רחוב ומספר"
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="admin-btn btn-ghost">
          ביטול
        </button>
        <button type="submit" disabled={loading} className="admin-btn btn-primary">
          {loading ? "שומר..." : "שמור"}
        </button>
      </div>
    </form>
  )
}
