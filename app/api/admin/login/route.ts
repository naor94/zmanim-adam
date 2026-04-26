import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  const { password } = await request.json()
  const correctPassword = process.env.ADMIN_PASSWORD
  const sessionSecret = process.env.ADMIN_SESSION_SECRET

  if (!correctPassword || !sessionSecret) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 })
  }

  if (password !== correctPassword) {
    return NextResponse.json({ error: "סיסמה שגויה" }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set("admin_session", sessionSecret, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  })
  return response
}
