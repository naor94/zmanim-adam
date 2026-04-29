"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function DateGuard({ serverDate }: { serverDate: string }) {
  const router = useRouter()

  useEffect(() => {
    function check() {
      const today = new Date().toLocaleDateString("en-CA") // YYYY-MM-DD in local TZ
      if (serverDate !== today) {
        router.refresh()
      }
    }
    check()
    // re-check every minute (handles leaving browser open overnight)
    const interval = setInterval(check, 60_000)
    return () => clearInterval(interval)
  }, [serverDate, router])

  return null
}
