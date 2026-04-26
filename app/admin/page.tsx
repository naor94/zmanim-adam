import Link from "next/link"
import Header from "@/components/Header"

const sections = [
  { href: "/admin/synagogues",      label: "בתי כנסת",        icon: "🕍", desc: "ניהול רשימת בתי הכנסת" },
  { href: "/admin/prayers",         label: "תפילות שבועיות",  icon: "🙏", desc: "ניהול תפילות ימות השבוע" },
  { href: "/admin/lessons",         label: "שיעורים שבועיים", icon: "📖", desc: "ניהול שיעורי תורה שבועיים" },
  { href: "/admin/shabbat-prayers", label: "תפילות שבת",      icon: "✡️", desc: "ניהול תפילות שבת ויו\"ט" },
  { href: "/admin/shabbat-lessons", label: "שיעורי שבת",      icon: "📚", desc: "ניהול שיעורי שבת ויו\"ט" },
]

export default function AdminPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-3xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">ממשק ניהול</h2>
          <form action="/api/admin/logout" method="POST">
            <button type="submit" className="admin-btn btn-ghost text-sm">יציאה</button>
          </form>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sections.map((s) => (
            <Link key={s.href} href={s.href}>
              <div className="card p-5 hover:border-cyan-300 hover:shadow-md transition-all cursor-pointer">
                <div className="text-3xl mb-2">{s.icon}</div>
                <div className="font-bold text-gray-800 mb-1">{s.label}</div>
                <div className="text-sm text-gray-500">{s.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
