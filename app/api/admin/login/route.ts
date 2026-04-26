import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const password = (formData.get("password") as string) || ""
  const correctPassword = process.env.ADMIN_PASSWORD
  const sessionSecret   = process.env.ADMIN_SESSION_SECRET

  const host     = request.headers.get("host") || "localhost:3000"
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http"
  const base     = `${protocol}://${host}`

  if (!correctPassword || !sessionSecret || password !== correctPassword) {
    return NextResponse.redirect(new URL("/admin/login?error=1", base), { status: 303 })
  }

  const response = NextResponse.redirect(new URL("/admin", base), { status: 303 })
  response.cookies.set("admin_session", sessionSecret, {
    httpOnly: true,
    sameSite: "lax",
    secure:   process.env.NODE_ENV === "production",
    path:     "/",
    maxAge:   60 * 60 * 24 * 7,
  })
  return response
}
