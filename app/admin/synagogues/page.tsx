"use client"
import { useEffect, useState } from "react"
import Header from "@/components/Header"
import AdminTable from "@/components/admin/AdminTable"
import SynagogueForm from "@/components/admin/SynagogueForm"
import { supabase } from "@/lib/supabase"
import type { Synagogue } from "@/types"

export default function SynagoguesAdminPage() {
  const [synagogues, setSynagogues] = useState<Synagogue[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Synagogue | undefined>(undefined)
  const [confirmDelete, setConfirmDelete] = useState<Synagogue | null>(null)

  async function load() {
    setLoading(true)
    const { data } = await supabase.from("synagogues").select("*").order("name")
    setSynagogues(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function handleAdd() {
    setEditing(undefined)
    setShowModal(true)
  }

  function handleEdit(s: Synagogue) {
    setEditing(s)
    setShowModal(true)
  }

  function handleDelete(s: Synagogue) {
    setConfirmDelete(s)
  }

  async function confirmDeleteAction() {
    if (!confirmDelete) return
    await supabase.from("synagogues").delete().eq("id", confirmDelete.id)
    setConfirmDelete(null)
    load()
  }

  const columns = [
    { key: "name", label: "שם" },
    { key: "address", label: "כתובת", render: (s: Synagogue) => s.address || "-" },
  ]

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-3xl mx-auto p-4">
        <div className="flex items-center gap-2 mb-4">
          <a href="/admin" className="text-cyan-600 hover:underline text-sm">← חזור לניהול</a>
        </div>
        <h2 className="text-xl font-bold text-cyan-800 mb-4">בתי כנסת</h2>
        <AdminTable
          items={synagogues}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAdd={handleAdd}
          addLabel="הוסף בית כנסת"
          loading={loading}
        />
      </main>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold mb-4">
              {editing ? "עריכת בית כנסת" : "הוספת בית כנסת"}
            </h3>
            <SynagogueForm
              synagogue={editing}
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
            <p className="text-gray-600 mb-4">
              האם למחוק את &quot;{confirmDelete.name}&quot;?
            </p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setConfirmDelete(null)} className="admin-btn btn-ghost">ביטול</button>
              <button onClick={confirmDeleteAction} className="admin-btn btn-danger">מחק</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
