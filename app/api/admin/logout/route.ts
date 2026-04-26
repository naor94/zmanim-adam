import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  const host = request.headers.get("host") || "localhost:3000"
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http"
  const response = NextResponse.redirect(new URL("/admin/login", `${protocol}://${host}`))
  response.cookies.delete("admin_session")
  return response
}
