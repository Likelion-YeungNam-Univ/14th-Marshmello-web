import type { EmotionByDate } from "@/features/records/api/records"
import type { CalendarDay, MoodType } from "@/features/records/model/types"

/**
 * 백엔드 emotion enum
 *
 * 0 = good
 * 1 = normal
 * 그 외 = bad
 */
export function getMoodType(
  emotion: number | null,
): MoodType {
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
export function getBodyRegionLabel(
  bodyRegion: number | null,
): string {
  if (bodyRegion === null) {
    return "---"
  }

  const bodyRegionMap: Record<number, string> = {
    0: "옆구리",
  }

  return bodyRegionMap[bodyRegion] ?? `부위 ${bodyRegion}`
}

export function getDaysInMonth(yearMonth: string): number {
  const [year, month] = yearMonth.split("-").map(Number)

  return new Date(year, month, 0).getDate()
}

export function getFirstDayOfMonth(
  yearMonth: string,
): number {
  const [year, month] = yearMonth.split("-").map(Number)

  return new Date(
    year,
    month - 1,
    1,
  ).getDay()
}

export function formatMonth(
  yearMonth: string,
): string {
  const [year, month] = yearMonth.split("-")

  return `${year}년 ${Number(month)}월`
}

export function buildCalendarDays(
  yearMonth: string,
  emotions: EmotionByDate[],
): CalendarDay[] {
  const emotionMap = new Map(
    emotions.map((item) => [
      item.date,
      item.emotion,
    ]),
  )

  const [year, month] = yearMonth
    .split("-")
    .map(Number)

  const daysInMonth = getDaysInMonth(yearMonth)

  return Array.from(
    { length: daysInMonth },
    (_, index) => {
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
    },
  )
}