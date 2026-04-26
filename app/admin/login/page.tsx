"use client"
import { useState, useEffect } from "react"

export default function LoginPage() {
  const [error, setError] = useState(false)

  useEffect(() => {
    setError(new URLSearchParams(window.location.search).has("error"))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="card w-full max-w-sm p-8">
        <h1 className="text-2xl font-bold text-cyan-800 text-center mb-2">זמני אדם</h1>
        <p className="text-center text-gray-500 text-sm mb-6">התחברות לממשק הניהול</p>
        <form action="/api/admin/login" method="POST" className="space-y-4">
          <div>
            <label className="form-label">סיסמה</label>
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="הכנס סיסמה"
              required
              autoFocus
              autoCapitalize="none"
              autoCorrect="off"
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">סיסמה שגויה</p>}
          <button type="submit" className="admin-btn btn-primary w-full justify-center py-2.5">
            כניסה
          </button>
        </form>
      </div>
    </div>
  )
}
