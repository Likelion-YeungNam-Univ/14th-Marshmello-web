import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import {
  useMemo,
} from "react"

import goodMood from "@/assets/checkin/mood/good.svg"
import greatMood from "@/assets/checkin/mood/great.svg"
import neutralMood from "@/assets/checkin/mood/neutral.svg"
import sadMood from "@/assets/checkin/mood/sad.svg"

import type {
  EmotionByDate,
} from "@/features/records/model/types"

import {
  buildCalendarDays,
  changeMonth,
  formatMonth,
  getFirstDayOfMonth,
} from "../model/utils"

type RecordsCalendarProps = {
  requestMonth: string
  emotions: EmotionByDate[]
  onMonthChange: (
    month: string,
  ) => void
  onDateClick: (
    date: string,
  ) => void
}

type MoodFaceProps = {
  emotion: number | null
  size?: number
}

const moodImageMap: Record<
  number,
  string
> = {
  1: sadMood,
  2: neutralMood,
  3: goodMood,
  4: greatMood,
}

function MoodFace({
  emotion,
  size = 27,
}: MoodFaceProps) {
  const moodImage =
    emotion !== null
      ? moodImageMap[emotion]
      : undefined

  if (!moodImage) {
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

  return (
    <img
      src={moodImage}
      alt=""
      aria-hidden="true"
      className="block shrink-0 object-contain"
      style={{
        width: size,
        height: size,
      }}
    />
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
  const calendarDays =
    useMemo(
      () =>
        buildCalendarDays(
          requestMonth,
          emotions,
        ),
      [
        requestMonth,
        emotions,
      ],
    )

  const firstDayOfMonth =
    useMemo(
      () =>
        getFirstDayOfMonth(
          requestMonth,
        ),
      [requestMonth],
    )

  const monthLabel =
    formatMonth(
      requestMonth,
    )

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
    requestMonth <
    currentMonth

  return (
    <section className="relative z-30 mt-[20px] rounded-t-[5px] bg-white px-[25px] pb-[35px] pt-[22px]">
      <div className="flex items-center justify-center gap-[5px]">
        <button
          aria-label={`${formatMonth(previousMonth)}로 이동`}
          className="flex size-5 items-center justify-center text-black"
          type="button"
          onClick={() =>
            onMonthChange(
              previousMonth,
            )
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
              onMonthChange(
                nextMonth,
              )
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
            key={day}
            className="text-[14px] font-medium text-[#aaa]"
          >
            {day}
          </span>
        ))}
      </div>

      <div className="mt-[20px] grid grid-cols-7 gap-x-[11px] gap-y-[18px]">
        {Array.from({
          length:
            firstDayOfMonth,
        }).map(
          (_, index) => (
            <div
              key={`empty-${index}`}
            />
          ),
        )}

        {calendarDays.map(
          (day) => {
            const fullDate =
              `${requestMonth}-${String(
                day.date,
              ).padStart(2, "0")}`

            return (
              <button
                key={day.date}
                type="button"
                aria-label={`${fullDate} 기록 보기`}
                className="flex flex-col items-center gap-[10px]"
                onClick={() =>
                  onDateClick(
                    fullDate,
                  )
                }
              >
                <MoodFace
                  emotion={
                    day.emotion }
                  />


                <span className="text-[14px] text-[#80858a]">
                  {day.date}
                </span>
              </button>
            )
          },
        )}
      </div>
    </section>
  )
}