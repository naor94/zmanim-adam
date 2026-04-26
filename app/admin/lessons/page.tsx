"use client"
import { useEffect, useState } from "react"
import Header from "@/components/Header"
import AdminTable from "@/components/admin/AdminTable"
import LessonForm from "@/components/admin/LessonForm"
import { supabase } from "@/lib/supabase"
import type { Lesson } from "@/types"
import { DAY_NAMES } from "@/types"

function formatTime(t: string) { return t?.substring(0, 5) || "" }

export default function LessonsAdminPage() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Lesson | undefined>(undefined)
  const [confirmDelete, setConfirmDelete] = useState<Lesson | null>(null)

  async function load() {
    setLoading(true)
    const { data } = await supabase
      .from("lessons")
      .select("*, synagogue:synagogues(*)")
      .order("time")
    setLessons(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const columns = [
    { key: "time", label: "שעה", render: (l: Lesson) => formatTime(l.time) },
    { key: "name", label: "שיעור" },
    { key: "teacher", label: "מרצה", render: (l: Lesson) => l.teacher || "-" },
    { key: "location", label: "מיקום", render: (l: Lesson) => (l as any).synagogue?.name || l.location_text || "-" },
    { key: "days", label: "ימים", render: (l: Lesson) => l.days?.map((d: number) => DAY_NAMES[d]).join(", ") || "" },
    { key: "is_active", label: "פעיל", render: (l: Lesson) => l.is_active ? "✓" : "✗" },
  ]

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-5xl mx-auto p-4">
        <div className="flex items-center gap-2 mb-4">
          <a href="/admin" className="text-cyan-600 hover:underline text-sm">← חזור לניהול</a>
        </div>
        <h2 className="text-xl font-bold text-cyan-800 mb-4">שיעורים שבועיים</h2>
        <AdminTable
          items={lessons}
          columns={columns}
          onEdit={(l) => { setEditing(l); setShowModal(true) }}
          onDelete={(l) => setConfirmDelete(l)}
          onAdd={() => { setEditing(undefined); setShowModal(true) }}
          addLabel="הוסף שיעור"
          loading={loading}
        />
      </main>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 overflow-y-auto py-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg mx-4">
            <h3 className="text-lg font-bold mb-4">
              {editing ? "עריכת שיעור" : "הוספת שיעור"}
            </h3>
            <LessonForm
              lesson={editing}
              isShabbat={false}
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
            <p className="text-gray-600 mb-4">האם למחוק את השיעור &quot;{confirmDelete.name}&quot;?</p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setConfirmDelete(null)} className="admin-btn btn-ghost">ביטול</button>
              <button
                onClick={async () => {
                  await supabase.from("lessons").delete().eq("id", confirmDelete.id)
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
