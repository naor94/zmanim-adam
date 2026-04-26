"use client"
import { useEffect, useState } from "react"

export default function Clock() {
  const [time, setTime] = useState("")

  useEffect(() => {
    function update() {
      const now = new Date()
      const h = String(now.getHours()).padStart(2, "0")
      const m = String(now.getMinutes()).padStart(2, "0")
      const s = String(now.getSeconds()).padStart(2, "0")
      setTime(`${h}:${m}:${s}`)
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="text-3xl font-light tracking-widest text-gray-700 font-mono">
      {time}
    </div>
  )
}
