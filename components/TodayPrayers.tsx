import type { Prayer, ShabbatPrayer } from "@/types"

const PRAYER_LABEL: Record<string, string> = {
  shacharit: "שחרית",
  mincha: "מנחה",
  maariv: "ערבית",
  musaf: "מוסף",
  other: "אחר",
}

type AnyPrayer = Prayer | ShabbatPrayer

interface Props {
  prayers: AnyPrayer[]
}

function formatTime(t: string) {
  return t.substring(0, 5)
}

export default function TodayPrayers({ prayers }: Props) {
  return (
    <div className="card">
      <div className="section-header">תפילות שמתקיימות היום</div>
      <div>
        {prayers.length === 0 ? (
          <div className="text-center text-gray-400 text-sm py-8">אין תפילות מוזנות להיום</div>
        ) : (
          prayers.map((p) => (
            <div key={p.id} className="prayer-row">
              <div className="flex-1">
                <div className="font-medium text-gray-800">
                  {p.custom_name || PRAYER_LABEL[p.type] || p.type}
                </div>
                {p.synagogue && (
                  <span className="synagogue-link">{p.synagogue.name}</span>
                )}
                {p.notes && (
                  <span className="text-gray-400 text-xs block">{p.notes}</span>
                )}
              </div>
              <div className="time-badge">{formatTime(p.time)}</div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
