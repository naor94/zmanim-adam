import Header from "@/components/Header"
import { supabase } from "@/lib/supabase"
import type { ShabbatLesson } from "@/types"

export const revalidate = 60

function formatTime(t: string) { return t.substring(0, 5) }

export default async function ShabbatLessonsPage() {
  const { data: lessons } = await supabase
    .from("shabbat_lessons")
    .select("*, synagogue:synagogues(*)")
    .eq("is_active", true)
    .order("time")

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-4xl mx-auto p-4">
        <h2 className="text-xl font-bold text-cyan-800 mb-4 text-center">שיעורי שבת ויו&quot;ט</h2>
        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-cyan-50 border-b border-cyan-200">
                  <th className="p-3 text-right text-cyan-800">שעה</th>
                  <th className="p-3 text-right text-cyan-800">שיעור</th>
                  <th className="p-3 text-right text-cyan-800">מרצה</th>
                  <th className="p-3 text-right text-cyan-800">מיקום</th>
                  <th className="p-3 text-right text-cyan-800">הערות</th>
                </tr>
              </thead>
              <tbody>
                {(lessons || []).map((l: ShabbatLesson) => (
                  <tr key={l.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-3 font-bold text-cyan-700">{formatTime(l.time)}</td>
                    <td className="p-3 font-medium">{l.name}</td>
                    <td className="p-3 text-gray-600">{l.teacher || "-"}</td>
                    <td className="p-3 text-gray-600">{l.synagogue?.name || l.location_text || "-"}</td>
                    <td className="p-3 text-gray-400 text-xs">{l.notes || ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(!lessons || lessons.length === 0) && (
              <div className="text-center text-gray-400 py-8">אין שיעורים מוזנים</div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
