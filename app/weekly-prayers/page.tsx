import Header from "@/components/Header"
import { supabase } from "@/lib/supabase"
import type { Prayer } from "@/types"
import { DAY_NAMES } from "@/types"

export const revalidate = 60

const PRAYER_LABEL: Record<string, string> = {
  shacharit: "שחרית",
  mincha: "מנחה",
  maariv: "ערבית",
  musaf: "מוסף",
  other: "אחר",
}

function formatTime(t: string) { return t.substring(0, 5) }

export default async function WeeklyPrayersPage() {
  const { data: prayers } = await supabase
    .from("prayers")
    .select("*, synagogue:synagogues(*)")
    .eq("is_active", true)
    .order("time")

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-4xl mx-auto p-4">
        <h2 className="text-xl font-bold text-cyan-800 mb-4 text-center">מניני השבוע</h2>
        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-cyan-50 border-b border-cyan-200">
                  <th className="p-3 text-right text-cyan-800">שעה</th>
                  <th className="p-3 text-right text-cyan-800">תפילה</th>
                  <th className="p-3 text-right text-cyan-800">בית כנסת</th>
                  <th className="p-3 text-right text-cyan-800">ימים</th>
                  <th className="p-3 text-right text-cyan-800">הערות</th>
                </tr>
              </thead>
              <tbody>
                {(prayers || []).map((p: Prayer) => (
                  <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-3 font-bold text-cyan-700">{formatTime(p.time)}</td>
                    <td className="p-3">{p.custom_name || PRAYER_LABEL[p.type]}</td>
                    <td className="p-3 text-gray-600">{p.synagogue?.name || "-"}</td>
                    <td className="p-3 text-gray-600 text-xs">
                      {p.days.map((d: number) => DAY_NAMES[d]).join(", ")}
                    </td>
                    <td className="p-3 text-gray-400 text-xs">{p.notes || ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(!prayers || prayers.length === 0) && (
              <div className="text-center text-gray-400 py-8">אין תפילות מוזנות</div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
