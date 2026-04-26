"use client"
import { useEffect, useState } from "react"
import Header from "@/components/Header"
import AdminTable from "@/components/admin/AdminTable"
import PrayerForm from "@/components/admin/PrayerForm"
import { supabase } from "@/lib/supabase"
import type { ShabbatPrayer } from "@/types"

const PRAYER_LABEL: Record<string, string> = {
  shacharit: "שחרית",
  mincha: "מנחה",
  maariv: "ערבית",
  musaf: "מוסף",
  other: "אחר",
}

function formatTime(t: string) { return t?.substring(0, 5) || "" }

export default function ShabbatPrayersAdminPage() {
  const [prayers, setPrayers] = useState<ShabbatPrayer[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<ShabbatPrayer | undefined>(undefined)
  const [confirmDelete, setConfirmDelete] = useState<ShabbatPrayer | null>(null)

  async function load() {
    setLoading(true)
    const { data } = await supabase
      .from("shabbat_prayers")
      .select("*, synagogue:synagogues(*)")
      .order("time")
    setPrayers(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const columns = [
    { key: "time", label: "שעה", render: (p: ShabbatPrayer) => formatTime(p.time) },
    { key: "type", label: "תפילה", render: (p: ShabbatPrayer) => p.custom_name || PRAYER_LABEL[p.type] },
    { key: "synagogue", label: "בית כנסת", render: (p: ShabbatPrayer) => (p as any).synagogue?.name || "-" },
    { key: "notes", label: "הערות", render: (p: ShabbatPrayer) => p.notes || "-" },
    { key: "is_active", label: "פעיל", render: (p: ShabbatPrayer) => p.is_active ? "✓" : "✗" },
  ]

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-4xl mx-auto p-4">
        <div className="flex items-center gap-2 mb-4">
          <a href="/admin" className="text-cyan-600 hover:underline text-sm">← חזור לניהול</a>
        </div>
        <h2 className="text-xl font-bold text-cyan-800 mb-4">תפילות שבת ויו&quot;ט</h2>
        <AdminTable
          items={prayers}
          columns={columns}
          onEdit={(p) => { setEditing(p); setShowModal(true) }}
          onDelete={(p) => setConfirmDelete(p)}
          onAdd={() => { setEditing(undefined); setShowModal(true) }}
          addLabel="הוסף תפילת שבת"
          loading={loading}
        />
      </main>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 overflow-y-auto py-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg mx-4">
            <h3 className="text-lg font-bold mb-4">
              {editing ? "עריכת תפילת שבת" : "הוספת תפילת שבת"}
            </h3>
            <PrayerForm
              prayer={editing}
              isShabbat={true}
              onSave={() => { setShowModal(false); load() }}
              onCancel={() => setShowModal(false)}
            />
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm mx-4">
            <h3 className="text-lg font-bold mb-2">אישור מחיקה</h3>
            <p className="text-gray-600 mb-4">האם למחוק את תפילת השבת הזו?</p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setConfirmDelete(null)} className="admin-btn btn-ghost">ביטול</button>
              <button
                onClick={async () => {
                  await supabase.from("shabbat_prayers").delete().eq("id", confirmDelete.id)
                  setConfirmDelete(null)
                  load()
                }}
                className="admin-btn btn-danger"
              >
                מחק
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
