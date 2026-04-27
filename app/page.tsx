import Header from "@/components/Header"
import Clock from "@/components/Clock"
import HebrewDate from "@/components/HebrewDate"
import TodayPrayers from "@/components/TodayPrayers"
import TodayLessons from "@/components/TodayLessons"
import ZmanimTable from "@/components/ZmanimTable"
import ShabbatTimes from "@/components/ShabbatTimes"
import DailyLearningPanel from "@/components/DailyLearning"
import { supabase } from "@/lib/supabase"
import { fetchZmanim, fetchShabbatTimes, fetchHebrewDate, fetchDailyLearning } from "@/lib/zmanim"

export const revalidate = 60

export default async function HomePage() {
  const now = new Date()
  const dayOfWeek = now.getDay()
  const isShabbat = dayOfWeek === 6

  const table = isShabbat ? "shabbat_prayers" : "prayers"
  const lessonTable = isShabbat ? "shabbat_lessons" : "lessons"

  let pQuery = supabase.from(table).select("*, synagogue:synagogues(*)").eq("is_active", true).order("time")
  let lQuery = supabase.from(lessonTable).select("*, synagogue:synagogues(*)").eq("is_active", true).order("time")

  if (!isShabbat) {
    pQuery = (pQuery as any).contains("days", [dayOfWeek])
    lQuery = (lQuery as any).contains("days", [dayOfWeek])
  }

  const [{ data: prayers }, { data: lessons }, zmanim, shabbatTimes, hebrewDate, dailyLearning] =
    await Promise.all([
      pQuery,
      lQuery,
      fetchZmanim(now),
      fetchShabbatTimes(),
      fetchHebrewDate(now),
      fetchDailyLearning(now),
    ])

  return (
    <div className="min-h-screen">
      <Header />
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <HebrewDate hebrewDate={hebrewDate} date={now} />
          <Clock />
        </div>
      </div>
      <main className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 border-x border-gray-200">
          <div className="border-l border-gray-200">
            <TodayPrayers prayers={prayers || []} />
          </div>
          <div className="border-l border-gray-200">
            <DailyLearningPanel learning={dailyLearning} />
            <ShabbatTimes data={shabbatTimes} />
            <ZmanimTable zmanim={zmanim} />
          </div>
          <div>
            <TodayLessons lessons={lessons || []} />
          </div>
        </div>
      </main>
    </div>
  )
}
