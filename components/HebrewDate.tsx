import type { HebrewDateData } from "@/types"

const HEBREW_DAYS = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"]
const GREG_MONTHS = ["ינואר","פברואר","מרץ","אפריל","מאי","יוני","יולי","אוגוסט","ספטמבר","אוקטובר","נובמבר","דצמבר"]

interface Props {
  hebrewDate: HebrewDateData | null
  date: Date
}

export default function HebrewDate({ hebrewDate, date }: Props) {
  const dayName = HEBREW_DAYS[date.getDay()]
  const gregStr = `${date.getDate()} ${GREG_MONTHS[date.getMonth()]} ${date.getFullYear()}`

  return (
    <div className="text-right p-3">
      <div className="text-xs text-gray-500 mb-1">בס&quot;ד</div>
      <div className="text-2xl font-bold text-gray-800">יום {dayName}</div>
      {hebrewDate && (
        <div className="text-sm text-cyan-700 font-medium mt-1">{hebrewDate.hebrew}</div>
      )}
      <div className="text-xs text-gray-500 mt-1">({gregStr})</div>
    </div>
  )
}
