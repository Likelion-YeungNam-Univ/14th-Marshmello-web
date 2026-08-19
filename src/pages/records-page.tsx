import { useEffect, useMemo, useState } from "react"
import { ChevronLeft, ChevronRight, Folder } from "lucide-react"
import {
  createReport,
  getCheckInCount,
  getEmotionsByMonth,
  getReport,
  getTopBodyRegion,
  type EmotionByDate,
  type ReportResponse,
} from "@/features/records/api/records"
import { BrandFaceIcon } from "@/shared/components/ui/splash/face-icon"
type MoodType = "good" | "normal" | "bad" | "none"
type CalendarDay = {
  date: number
  emotion: number | null
}
type RecordsData = {
  requestMonth: string
  count: number
  achievedCount: number
  emotions: EmotionByDate[]
  topBodyRegion: number | null
  report: ReportResponse | null
}
/**
 * 백엔드 emotion enum
 *
 * 현재 프론트 기준
 * 0 = good
 * 1 = normal
 * 그 외 = bad
 */
function getMoodType(emotion: number | null): MoodType {
  if (emotion === null) {
    return "none"
  }
  if (emotion === 0) {
    return "good"
  }
  if (emotion === 1) {
    return "normal"
  }
  return "bad"
}
/**
 * 백엔드 bodyRegion enum
 */
function getBodyRegionLabel(bodyRegion: number | null) {
  if (bodyRegion === null) {
    return "---"
  }
  const bodyRegionMap: Record<number, string> = {
    0: "옆구리",
  }
  return bodyRegionMap[bodyRegion] ?? `부위 ${bodyRegion}`
}
function MoodFace({
  emotion,
  size = 27,
}: {
  emotion: number | null
  size?: number
}) {
  const mood = getMoodType(emotion)
  if (mood === "none") {
    return (
      <span
        className="block rounded-full bg-[#d8d8d8]"
        style={{
          width: size,
          height: size,
        }}
      />
    )
  }
  if (mood === "good") {
    return (
      <span
        className="flex items-center justify-center rounded-full bg-[#d7f3e9] text-[#63b69d]"
        style={{
          width: size,
          height: size,
        }}
      >
        <span className="text-[15px] leading-none">⌣</span>
      </span>
    )
  }
  if (mood === "normal") {
    return (
      <span
        className="flex items-center justify-center rounded-full bg-[#e7e6f8] text-[#8a87be]"
        style={{
          width: size,
          height: size,
        }}
      >
        <span className="text-[13px] leading-none">—</span>
      </span>
    )
  }
  return (
    <span
      className="flex items-center justify-center rounded-full bg-[#f4d8e8] text-[#c48bad]"
      style={{
        width: size,
        height: size,
      }}
    >
      <span className="text-[13px] leading-none">⌢</span>
    </span>
  )
}
function getDaysInMonth(yearMonth: string) {
  const [year, month] = yearMonth.split("-").map(Number)
  return new Date(year, month, 0).getDate()
}
function getFirstDayOfMonth(yearMonth: string) {
  const [year, month] = yearMonth.split("-").map(Number)
  return new Date(year, month - 1, 1).getDay()
}
function formatMonth(yearMonth: string) {
  const [year, month] = yearMonth.split("-")
  return `${year}년 ${Number(month)}월`
}
function buildCalendarDays(
  yearMonth: string,
  emotions: EmotionByDate[],
): CalendarDay[] {
  const emotionMap = new Map(
    emotions.map((item) => [item.date, item.emotion]),
  )
  const [year, month] = yearMonth.split("-").map(Number)
  const daysInMonth = getDaysInMonth(yearMonth)
  return Array.from({ length: daysInMonth }, (_, index) => {
    const day = index + 1
    const date = [
      year,
      String(month).padStart(2, "0"),
      String(day).padStart(2, "0"),
    ].join("-")
    return {
      date: day,
      emotion: emotionMap.get(date) ?? null,
    }
  })
}
export function RecordsPage() {
  const [data, setData] = useState<RecordsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  useEffect(() => {
    let cancelled = false
    const loadRecords = async () => {
      try {
        setIsLoading(true)
        setErrorMessage(null)
        const now = new Date()
        const requestMonth = `${now.getFullYear()}-${String(
          now.getMonth() + 1,
        ).padStart(2, "0")}`
        const count = await getCheckInCount(requestMonth)
        const currentMonth = count.requestMonth
        const [emotions, topBodyRegion] = await Promise.all([
          getEmotionsByMonth(currentMonth),
          getTopBodyRegion(currentMonth),
        ])
        let report: ReportResponse | null = null
        try {
          await createReport(currentMonth)
          report = await getReport(currentMonth)
        } catch (reportError) {
          console.error(
            "월간 리포트 조회 실패:",
            reportError,
          )
        }
        if (cancelled) {
          return
        }
        setData({
          requestMonth: currentMonth,
          count: count.count,
          achievedCount: count.achievedCount,
          emotions,
          topBodyRegion: topBodyRegion.bodyRegion,
          report,
        })
      } catch (error) {
        console.error("기록 데이터 조회 실패:", error)
        if (!cancelled) {
          setErrorMessage(
            "기록 정보를 불러오지 못했어요. 잠시 후 다시 시도해주세요.",
          )
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }
    void loadRecords()
    return () => {
      cancelled = true
    }
  }, [])
  const calendarDays = useMemo(() => {
    if (!data) {
      return []
    }
    return buildCalendarDays(
      data.requestMonth,
      data.emotions,
    )
  }, [data])
  const firstDayOfMonth = useMemo(() => {
    if (!data) {
      return 0
    }
    return getFirstDayOfMonth(data.requestMonth)
  }, [data])
  if (isLoading) {
    return (
      <main className="mx-auto min-h-[852px] w-full max-w-[393px] bg-[#e8c5e5] px-[15px] pt-[110px]">
        <p className="text-center text-[14px] text-[#7a4e88]">
          기록을 불러오는 중이에요.
        </p>
      </main>
    )
  }
  if (errorMessage || !data) {
    return (
      <main className="mx-auto flex min-h-[852px] w-full max-w-[393px] items-center justify-center bg-[#e8c5e5] px-6">
        <p className="text-center text-[14px] leading-[1.6] text-[#6c7278]">
          {errorMessage ?? "기록을 불러오지 못했어요."}
        </p>
      </main>
    )
  }
  const monthNumber = data.requestMonth
    ? data.requestMonth.slice(5)
    : null
  const monthText = monthNumber ? `${monthNumber}월` : "---월"
  const monthLabel = formatMonth(data.requestMonth)
  const topBodyRegionLabel = getBodyRegionLabel(
    data.topBodyRegion,
  )
  const aiReport = data.report?.content ?? "---"
  return (
    <main className="mx-auto min-h-[852px] w-full max-w-[393px] overflow-y-auto bg-[#e8c5e5] text-black">
      <section className="relative px-[15px] pb-[8px] pt-[20px]">
        <div className="mt-[15px]">
          <p className="text-[10px] font-bold tracking-[-0.1px] text-[#7a4e88]">
            이번 달 이야기
          </p>
          <h1 className="mt-[6px] max-w-[355px] text-[20px] font-medium leading-[1.4] tracking-[-0.2px]">
            {monthText}엔 총{" "}
            {data.count}일 기록을 남겼고,
            <br />
            그 중{" "}
            <span className="text-[#885d94]">
              {topBodyRegionLabel}
            </span>{" "}
            쪽이 가장 자주 신경 쓰였어요.
          </h1>
          <p className="mt-[5px] text-[8px] leading-[1.4] text-black/45">
            *이 리포트는 자가 진단을 바탕으로 한 참고 정보이며, 의학적 진단이 아닙니다.
          </p>
        </div>
        <button
          className="mt-[11px] ml-auto flex h-[52px] w-[231px] items-center gap-4 rounded-[15px] border-b border-white bg-white/80 px-5"
          type="button"
        >
          <span className="flex size-[36px] items-center justify-center rounded-[12px] bg-[#fdf2f8] text-[#c88ab7]">
            <Folder size={20} strokeWidth={1.7} />
          </span>
          <span className="flex-1 text-left text-[14px] text-[#3d3d3d]">
            관리 현황 확인하기
          </span>
          <ChevronRight
            size={16}
            strokeWidth={1.8}
            className="text-[#888]"
          />
        </button>
        <div className="relative mx-auto mt-[28px] w-[336px]">
          <div className="relative z-0 min-h-[124px] w-full overflow-visible rounded-[15px] bg-white/90 px-[18px] py-[15px]">
            <p className="text-[13px] font-semibold tracking-[-0.13px] text-[#7a4e88]">
              품결 AI와 함께하는 {monthText}
            </p>
            <p className="mt-[7px] pr-[2px] text-[16px] leading-[1.5] tracking-[-0.16px]">
              "{aiReport}"
            </p>
            <div
              aria-hidden="true"
              className="absolute bottom-[-10px] right-[230px] z-0 h-[18px] w-[8px] rotate-[18deg] rounded-br-[14px] bg-white/90"
            />
          </div>
          <div className="pointer-events-none absolute bottom-[-48px] left-[-5px] z-10 size-[92px]">
            <span className="absolute inset-[20px] rounded-full bg-[#f6cbe6]/55 animate-ping" />
            <span className="absolute inset-[14px] rounded-full bg-[#fde7f5]/50" />
            <BrandFaceIcon
              className="relative z-20 size-[92px]"
              haloColor="#fde7f5"
              haloOpacity={0.567147}
              circleColor="#f6cbe6"
              strokeColor="#a06a91"
              strokeWidth={4.15984}
              accentDotAnimated={false}
            />
          </div>
        </div>
      </section>
      <section className="relative z-30 mt-[24px] rounded-t-[5px] bg-white px-[25px] pb-[120px] pt-[22px]">
        <div className="flex items-center justify-center gap-[5px]">
          <button
            aria-label="이전 달"
            className="flex size-5 items-center justify-center"
            type="button"
          >
            <ChevronLeft size={12} />
          </button>
          <p className="text-[14px] font-medium">
            {monthLabel}
          </p>
          <button
            aria-label="다음 달"
            className="flex size-5 items-center justify-center"
            type="button"
          >
            <ChevronRight size={12} />
          </button>
        </div>
        <div className="mt-[24px] grid grid-cols-7 gap-x-[11px] text-center">
          {[
            "일",
            "월",
            "화",
            "수",
            "목",
            "금",
            "토",
          ].map((day) => (
            <span
              className="text-[14px] font-medium text-[#aaa]"
              key={day}
            >
              {day}
            </span>
          ))}
        </div>
        {/* 날짜 */}
        <div className="mt-[20px] grid grid-cols-7 gap-x-[11px] gap-y-[18px]">
          {Array.from({ length: firstDayOfMonth }).map(
            (_, index) => (
              <div key={`empty-${index}`} />
            ),
          )}
          {calendarDays.map((day) => (
            <div
              className="flex flex-col items-center gap-[5px]"
              key={day.date}
            >
              <MoodFace emotion={day.emotion} />
              <span className="text-[14px] text-[#80858a]">
                {day.date}
              </span>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}