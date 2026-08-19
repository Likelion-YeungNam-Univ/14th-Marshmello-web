import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useMemo } from "react"

import type {
  EmotionByDate,
} from "@/features/records/model/types"

import {
  buildCalendarDays,
  changeMonth,
  formatMonth,
  getFirstDayOfMonth,
  getMoodType,
} from "../model/utils"

type RecordsCalendarProps = {
  requestMonth: string
  emotions: EmotionByDate[]
  onMonthChange: (month: string) => void
  onDateClick: (date: string) => void
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

function getCurrentMonth() {
  const now = new Date()

  return `${now.getFullYear()}-${String(
    now.getMonth() + 1,
  ).padStart(2, "0")}`
}

export function RecordsCalendar({
  requestMonth,
  emotions,
  onMonthChange,
  onDateClick,
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

  const monthLabel =
    formatMonth(requestMonth)

  const previousMonth =
    changeMonth(
      requestMonth,
      -1,
    )

  const nextMonth =
    changeMonth(
      requestMonth,
      1,
    )

  const currentMonth =
    getCurrentMonth()

  const canGoNext =
    requestMonth < currentMonth

  return (
    <section className="relative z-30 mt-[24px] rounded-t-[5px] bg-white px-[25px] pb-[35px] pt-[22px]">
      <div className="flex items-center justify-center gap-[5px]">
        <button
          aria-label={`${formatMonth(previousMonth)}로 이동`}
          className="flex size-5 items-center justify-center text-black"
          type="button"
          onClick={() =>
            onMonthChange(previousMonth)
          }
        >
          <ChevronLeft
            size={14}
            strokeWidth={2.5}
          />
        </button>

        <p className="text-[14px] font-medium">
          {monthLabel}
        </p>

        <button
          aria-label={
            canGoNext
              ? `${formatMonth(nextMonth)}로 이동`
              : "다음 달로 이동할 수 없습니다"
          }
          className={`flex size-5 items-center justify-center ${
            canGoNext
              ? "text-black"
              : "cursor-not-allowed text-[#d8d8d8]"
          }`}
          disabled={!canGoNext}
          type="button"
          onClick={() => {
            if (canGoNext) {
              onMonthChange(nextMonth)
            }
          }}
        >
          <ChevronRight
            size={14}
            strokeWidth={
              canGoNext
                ? 2.5
                : 1.2
            }
          />
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

      <div className="mt-[20px] grid grid-cols-7 gap-x-[11px] gap-y-[18px]">
        {Array.from({
          length: firstDayOfMonth,
        }).map((_, index) => (
          <div
            key={`empty-${index}`}
          />
        ))}

        {calendarDays.map((day) => {
          const fullDate =
            `${requestMonth}-${String(
              day.date,
            ).padStart(2, "0")}`

          return (
            <button
              key={day.date}
              aria-label={`${fullDate} 기록 보기`}
              className="flex flex-col items-center gap-[5px]"
              type="button"
              onClick={() =>
                onDateClick(fullDate)
              }
            >
              <MoodFace
                emotion={day.emotion}
              />

              <span className="text-[14px] text-[#80858a]">
                {day.date}
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}