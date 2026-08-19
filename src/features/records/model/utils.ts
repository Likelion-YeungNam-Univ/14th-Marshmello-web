import type {
  CalendarDay,
  EmotionByDate,
  MoodType,
} from "@/features/records/model/types"

export function getMoodType(
  emotion: number | null,
): MoodType {
  if (emotion === null) {
    return "none"
  }

  if (emotion === 1) {
    return "bad"
  }

  if (emotion === 2) {
    return "normal"
  }

  if (emotion === 3) {
    return "good"
  }

  if (emotion === 4) {
    return "great"
  }

  return "none"
}

export function getBodyRegionLabel(
  bodyRegion: number | null,
): string {
  if (bodyRegion === null) {
    return "---"
  }

  const bodyRegionMap: Record<
    number,
    string
  > = {
    1: "가슴",
    2: "복부",
    3: "골반",
    4: "왼쪽 팔",
    5: "오른쪽 팔",
    6: "왼쪽 다리",
    7: "오른쪽 다리",
  }

  return (
    bodyRegionMap[bodyRegion] ??
    "---"
  )
}

export function getDaysInMonth(
  yearMonth: string,
): number {
  const [year, month] =
    yearMonth
      .split("-")
      .map(Number)

  return new Date(
    year,
    month,
    0,
  ).getDate()
}

export function getFirstDayOfMonth(
  yearMonth: string,
): number {
  const [year, month] =
    yearMonth
      .split("-")
      .map(Number)

  return new Date(
    year,
    month - 1,
    1,
  ).getDay()
}

export function formatMonth(
  yearMonth: string,
): string {
  const [year, month] =
    yearMonth.split("-")

  return `${year}년 ${Number(month)}월`
}

export function changeMonth(
  yearMonth: string,
  amount: number,
): string {
  const [year, month] =
    yearMonth
      .split("-")
      .map(Number)

  const date = new Date(
    year,
    month - 1 + amount,
    1,
  )

  return `${date.getFullYear()}-${String(
    date.getMonth() + 1,
  ).padStart(2, "0")}`
}

export function buildCalendarDays(
  yearMonth: string,
  emotions: EmotionByDate[],
): CalendarDay[] {
  const emotionMap =
    new Map(
      emotions.map(
        (item) => [
          item.date,
          item.emotion,
        ],
      ),
    )

  const [year, month] =
    yearMonth
      .split("-")
      .map(Number)

  const daysInMonth =
    getDaysInMonth(
      yearMonth,
    )

  return Array.from(
    {
      length: daysInMonth,
    },
    (_, index) => {
      const day =
        index + 1

      const date = [
        year,
        String(month).padStart(
          2,
          "0",
        ),
        String(day).padStart(
          2,
          "0",
        ),
      ].join("-")

      return {
        date: day,
        emotion:
          emotionMap.get(
            date,
          ) ?? null,
      }
    },
  )
}