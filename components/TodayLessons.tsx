import type { Lesson, ShabbatLesson } from "@/types"

type AnyLesson = Lesson | ShabbatLesson

interface Props {
  lessons: AnyLesson[]
}

function formatTime(t: string) {
  return t.substring(0, 5)
}

export default function TodayLessons({ lessons }: Props) {
  return (
    <div className="card">
      <div className="section-header">שיעורים שמתקיימים היום</div>
      <div>
        {lessons.length === 0 ? (
          <div className="text-center text-gray-400 text-sm py-8">אין שיעורים מוזנים להיום</div>
        ) : (
          lessons.map((l) => (
            <div key={l.id} className="prayer-row">
              <div className="flex-1">
                <div className="font-medium text-gray-800">{l.name}</div>
                {l.teacher && (
                  <span className="text-gray-600 text-xs">{l.teacher}</span>
                )}
                {(l.synagogue || l.location_text) && (
                  <span className="synagogue-link">
                    {l.synagogue?.name || l.location_text}
                  </span>
                )}
                {l.notes && (
                  <span className="text-gray-400 text-xs block">{l.notes}</span>
                )}
              </div>
              <div className="time-badge">{formatTime(l.time)}</div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
