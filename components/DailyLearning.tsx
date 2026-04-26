import type { DailyLearning } from "@/types"

interface Props {
  learning: DailyLearning
}

export default function DailyLearningPanel({ learning }: Props) {
  const items = [
    { label: "דף יומי",     value: learning.dafYomi },
    { label: "ירושלמי",     value: learning.yerushalmi },
    { label: "רמב\"ם יומי", value: learning.rambam },
    { label: "משנה יומית",  value: learning.mishnaYomi },
  ]

  return (
    <div className="card">
      <div className="section-header">לימוד יומי</div>
      <div>
        {items.filter(i => i.value).map((item) => (
          <div key={item.label} className="prayer-row">
            <div className="text-gray-600 text-sm">{item.label}</div>
            <div className="text-cyan-800 font-medium text-sm text-left">{item.value}</div>
          </div>
        ))}
        {items.every(i => !i.value) && (
          <div className="text-center text-gray-400 text-sm py-4">טוען...</div>
        )}
      </div>
    </div>
  )
}
