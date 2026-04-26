import type { ZmanimData } from "@/types"

interface Props {
  zmanim: ZmanimData
}

const ZMANIM_LABELS: [keyof ZmanimData, string][] = [
  ["alotHaShachar",    "עלות השחר"],
  ["misheyakir",       "משיכיר"],
  ["sunrise",          "הנץ החמה"],
  ["sofZmanShmaMGA",   "סוף ק\"ש מ\"א"],
  ["sofZmanShma",      "סוף ק\"ש גר\"א"],
  ["sofZmanTfillaMGA", "סוף תפילה מ\"א"],
  ["sofZmanTfilla",    "סוף תפילה גר\"א"],
  ["chatzot",          "חצות"],
  ["minchaGedola",     "מנחה גדולה"],
  ["minchaKetana",     "מנחה קטנה"],
  ["plagHaMincha",     "פלג המנחה"],
  ["sunset",           "שקיעה"],
  ["tzait8point5",     "צאת הכוכבים מ\"א"],
  ["tzaitGeonim",      "צאת הכוכבים גר\"א"],
]

export default function ZmanimTable({ zmanim }: Props) {
  return (
    <div className="card mt-2">
      <div className="section-header">זמני היום - אדם</div>
      <div>
        {ZMANIM_LABELS.map(([key, label]) => {
          const val = zmanim[key as keyof ZmanimData]
          if (!val || key === "date") return null
          return (
            <div key={key} className="prayer-row">
              <div className="text-gray-700">{label}</div>
              <div className="time-badge">{val as string}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
