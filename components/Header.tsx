"use client"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navLinks = [
  { href: "/", label: "ראשי" },
  { href: "/weekly-prayers", label: "מניני השבוע" },
  { href: "/weekly-lessons", label: "שיעורי השבוע" },
  { href: "/shabbat-prayers", label: "מניני שבת" },
  { href: "/shabbat-lessons", label: "שיעורי שבת" },
  { href: "/admin", label: "ניהול" },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(!open)}
              className="p-2 rounded hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="תפריט"
            >
              <div className="w-5 h-0.5 bg-gray-600 mb-1 pointer-events-none" />
              <div className="w-5 h-0.5 bg-gray-600 mb-1 pointer-events-none" />
              <div className="w-5 h-0.5 bg-gray-600 pointer-events-none" />
            </button>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-cyan-700">זמני אדם</h1>
            <p className="text-xs text-gray-500">זמני התפילות והשיעורים בעדכון הגבאים</p>
          </div>
          <div className="w-10" />
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <nav className="absolute right-0 top-0 bg-gray-900 text-white w-56 h-full shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <span className="font-bold text-cyan-400">תפריט</span>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white text-xl">✕</button>
            </div>
            <ul className="flex flex-col py-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`block px-6 py-3 text-sm hover:bg-gray-700 transition-colors ${
                      pathname === link.href ? "text-cyan-400 bg-gray-800" : "text-gray-200"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </>
  )
}
