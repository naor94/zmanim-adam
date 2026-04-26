import type { ShabbatData } from "@/types"

interface Props {
  data: ShabbatData
}

export default function ShabbatTimes({ data }: Props) {
  return (
    <div className="card mt-2">
      <div className="section-header">זמני שבת ויו&quot;ט</div>
      <div>
        {data.parasha && (
          <div className="prayer-row">
            <div className="text-gray-700">פרשת השבוע</div>
            <div className="text-sm text-cyan-700 font-medium">{data.parasha}</div>
          </div>
        )}
        {data.candleLighting && (
          <div className="prayer-row">
            <div className="text-gray-700">הדלקת נרות</div>
            <div className="time-badge">{data.candleLighting}</div>
          </div>
        )}
        {data.havdalah && (
          <div className="prayer-row">
            <div className="text-gray-700">צאת שבת / חג</div>
            <div className="time-badge">{data.havdalah}</div>
          </div>
        )}
        {!data.candleLighting && !data.havdalah && (
          <div className="text-center text-gray-400 text-sm py-4">טוען...</div>
        )}
      </div>
    </div>
  )
}
