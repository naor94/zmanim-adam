import type { HebrewDateData } from "@/types"

const HEBREW_DAYS = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"]
const GREG_MONTHS = ["ינואר","פברואר","מרץ","אפריל","מאי","יוני","יולי","אוגוסט","ספטמבר","אוקטובר","נובמבר","דצמבר"]

const OMER_NUMS: Record<number, string> = {
  1:'א׳',2:'ב׳',3:'ג׳',4:'ד׳',5:'ה׳',6:'ו׳',7:'ז׳',8:'ח׳',9:'ט׳',10:'י׳',
  11:'י״א',12:'י״ב',13:'י״ג',14:'י״ד',15:'ט״ו',16:'ט״ז',17:'י״ז',18:'י״ח',19:'י״ט',20:'כ׳',
  21:'כ״א',22:'כ״ב',23:'כ״ג',24:'כ״ד',25:'כ״ה',26:'כ״ו',27:'כ״ז',28:'כ״ח',29:'כ״ט',30:'ל׳',
  31:'ל״א',32:'ל״ב',33:'ל״ג',34:'ל״ד',35:'ל״ה',36:'ל״ו',37:'ל״ז',38:'ל״ח',39:'ל״ט',40:'מ׳',
  41:'מ״א',42:'מ״ב',43:'מ״ג',44:'מ״ד',45:'מ״ה',46:'מ״ו',47:'מ״ז',48:'מ״ח',49:'מ״ט',
}

const WEEK_NAMES  = ['','שבוע אחד','שני שבועות','שלשה שבועות','ארבעה שבועות','חמישה שבועות','ששה שבועות','שבעה שבועות']
const DAY_NAMES_O = ['','יום אחד','שני ימים','שלשה ימים','ארבעה ימים','חמישה ימים','ששה ימים']

function getOmerDay(hm: string, hd: number): number | null {
  if (hm === 'Nisan'  && hd >= 16)        return hd - 15
  if (hm === 'Iyyar')                      return hd + 15
  if (hm === 'Sivan'  && hd >= 1 && hd <= 5) return hd + 44
  return null
}

function omerSubtext(day: number): string {
  const weeks = Math.floor(day / 7)
  const days  = day % 7
  if (day === 7)  return 'שבוע אחד'
  if (day === 14) return 'שני שבועות'
  if (day === 21) return 'שלשה שבועות'
  if (day === 28) return 'ארבעה שבועות'
  if (day === 35) return 'חמישה שבועות'
  if (day === 42) return 'ששה שבועות'
  if (day === 49) return 'שבעה שבועות'
  if (weeks === 0) return DAY_NAMES_O[days]
  return WEEK_NAMES[weeks] + ' ו' + DAY_NAMES_O[days]
}

interface Props {
  hebrewDate: HebrewDateData | null
  date: Date
}

export default function HebrewDate({ hebrewDate, date }: Props) {
  const dayName = HEBREW_DAYS[date.getDay()]
  const gregStr = `${date.getDate()} ${GREG_MONTHS[date.getMonth()]} ${date.getFullYear()}`
  const omerDay = hebrewDate ? getOmerDay(hebrewDate.hm, hebrewDate.hd) : null

  return (
    <div className="text-right p-3">
      <div className="text-xs text-gray-500 mb-1">בס&quot;ד</div>
      <div className="text-2xl font-bold text-gray-800">יום {dayName}</div>
      {hebrewDate && (
        <div className="text-sm text-cyan-700 font-medium mt-1">{hebrewDate.hebrew}</div>
      )}
      <div className="text-xs text-gray-500 mt-1">({gregStr})</div>
      {omerDay && (
        <div className="text-xs text-amber-700 font-medium mt-1">
          היום {OMER_NUMS[omerDay]} לעומר — {omerSubtext(omerDay)}
        </div>
      )}
    </div>
  )
}
