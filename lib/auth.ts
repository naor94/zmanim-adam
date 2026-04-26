export function isAuthenticated(cookieValue: string | undefined): boolean {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret || !cookieValue) return false
  return cookieValue === secret
}
