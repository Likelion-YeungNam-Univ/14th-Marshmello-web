import { ChevronLeft, ChevronRight } from "lucide-react"
import { useMemo } from "react"

import type { EmotionByDate } from "@/features/records/api/records"

import {
  buildCalendarDays,
  formatMonth,
  getFirstDayOfMonth,
  getMoodType,
} from "../model/utils"

type RecordsCalendarProps = {
  requestMonth: string
  emotions: EmotionByDate[]
}

type MoodFaceProps = {
  emotion: number | null
  size?: number
}

function MoodFace({
  emotion,
  size = 27,
}: MoodFaceProps) {
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
        <span className="text-[15px] leading-none">
          ⌣
        </span>
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
        <span className="text-[13px] leading-none">
          —
        </span>
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
      <span className="text-[13px] leading-none">
        ⌢
      </span>
    </span>
  )
}

export function RecordsCalendar({
  requestMonth,
  emotions,
}: RecordsCalendarProps) {
  const calendarDays = useMemo(
    () =>
      buildCalendarDays(
        requestMonth,
        emotions,
      ),
    [requestMonth, emotions],
  )

  const firstDayOfMonth = useMemo(
    () =>
      getFirstDayOfMonth(
        requestMonth,
      ),
    [requestMonth],
  )

  const monthLabel = formatMonth(requestMonth)

  return (
    <section className="relative z-30 mt-[24px] rounded-t-[5px] bg-white px-[25px] pb-[120px] pt-[22px]">
      {/* 월 이동 */}
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

      {/* 요일 */}
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
        {Array.from({
          length: firstDayOfMonth,
        }).map((_, index) => (
          <div key={`empty-${index}`} />
        ))}

        {calendarDays.map((day) => (
          <div
            className="flex flex-col items-center gap-[5px]"
            key={day.date}
          >
            <MoodFace
              emotion={day.emotion}
            />

            <span className="text-[14px] text-[#80858a]">
              {day.date}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}