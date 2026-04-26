"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "שגיאה בהתחברות")
      } else {
        router.push("/admin")
        router.refresh()
      }
    } catch {
      setError("שגיאת רשת")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="card w-full max-w-sm p-8">
        <h1 className="text-2xl font-bold text-cyan-800 text-center mb-2">זמני אדם</h1>
        <p className="text-center text-gray-500 text-sm mb-6">התחברות לממשק הניהול</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">סיסמה</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="הכנס סיסמה"
              required
              autoFocus
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="admin-btn btn-primary w-full justify-center py-2.5"
          >
            {loading ? "מתחבר..." : "כניסה"}
          </button>
        </form>
      </div>
    </div>
  )
}
