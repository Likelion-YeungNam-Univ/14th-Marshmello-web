import {
  Check,
  ChevronLeft,
  ChevronRight,
  CircleDashed,
} from "lucide-react"

import moodGood from "@/assets/checkin/mood/good.svg"
import moodGreat from "@/assets/checkin/mood/great.svg"
import moodNeutral from "@/assets/checkin/mood/neutral.svg"
import moodSad from "@/assets/checkin/mood/sad.svg"
import { cn } from "@/shared/lib/utils"

import type {
  TimelineCheckIn,
} from "../../model/timeline-types"

type TimelineSummaryProps = {
  checkIn: TimelineCheckIn
  onNextDate: () => void
  onPreviousDate: () => void
}

type EmotionConfig = {
  image: string
  label: string
}

const EMOTION_CONFIG: Record<
  number,
  EmotionConfig
> = {
  1: {
    image: moodSad,
    label: "우울해요",
  },
  2: {
    image: moodNeutral,
    label: "그냥 그래요",
  },
  3: {
    image: moodGood,
    label: "좋아요",
  },
  4: {
    image: moodGreat,
    label: "최고예요",
  },
}

function formatTimelineDate(
  date: string,
) {
  const parsedDate =
    new Date(`${date}T00:00:00`)

  if (
    Number.isNaN(
      parsedDate.getTime(),
    )
  ) {
    return date
  }

  const month =
    parsedDate.getMonth() + 1

  const day =
    parsedDate.getDate()

  const weekday =
    parsedDate.toLocaleDateString(
      "ko-KR",
      {
        weekday: "long",
      },
    )

  return `${month}월 ${day}일 ${weekday}`
}

export function TimelineSummary({
  checkIn,
  onNextDate,
  onPreviousDate,
}: TimelineSummaryProps) {
  const emotionConfig =
    EMOTION_CONFIG[
      checkIn.emotion
    ]

  return (
    <section>
      <div className="mt-[12px] flex h-[32px] items-start justify-center gap-[16px] pt-[10px]">
        <button
          aria-label="이전 날짜 기록 보기"
          className="flex size-[28px] items-center justify-center rounded-full"
          type="button"
          onClick={onPreviousDate}
        >
          <ChevronLeft
            aria-hidden="true"
            className="h-[14px] w-[8px]"
            strokeWidth={2.4}
          />
        </button>

        <p className="flex h-[28px] items-center text-[14px] font-semibold leading-[21px] tracking-[-0.35px] text-[#3a3c42]">
          {formatTimelineDate(
            checkIn.checkInDate,
          )}
        </p>

        <button
          aria-label="다음 날짜 기록 보기"
          className="flex size-[28px] items-center justify-center rounded-full"
          type="button"
          onClick={onNextDate}
        >
          <ChevronRight
            aria-hidden="true"
            className="h-[14px] w-[8px]"
            strokeWidth={2.4}
          />
        </button>
      </div>

      <div className="flex h-[217px] flex-col items-center px-[24px] pt-[24px]">
        {emotionConfig ? (
          <img
            alt=""
            aria-hidden="true"
            className="size-[60px] shrink-0 object-contain"
            src={emotionConfig.image}
          />
        ) : (
          <div className="flex size-[60px] shrink-0 items-center justify-center rounded-full bg-[#f6cbe6] text-[13px] text-[#9d8a96]">
            -
          </div>
        )}

        <h2 className="mt-[12px] text-[26px] font-medium leading-[39px] tracking-[-0.65px] text-[#ef9bce]">
          기분{" "}
          {emotionConfig?.label ??
            "기록"}
        </h2>

        <div
          className={cn(
            "mt-[20px] flex items-center gap-[6px] rounded-full border px-[14px] py-[6px]",
            checkIn.achieved
              ? "border-[#91ddcf] bg-[rgba(145,221,207,0.25)]"
              : "border-[#e7dde4] bg-[#f4eef3]",
          )}
        >
          {checkIn.achieved ? (
            <Check
              aria-hidden="true"
              className="size-[13px] text-[#2c8c79]"
              strokeWidth={2.6}
            />
          ) : (
            <CircleDashed
              aria-hidden="true"
              className="size-[13px] text-[#a99ba4]"
              strokeWidth={1.8}
            />
          )}

          <span
            className={cn(
              "text-[11.5px] font-medium leading-[17.25px] tracking-[-0.2875px]",
              checkIn.achieved
                ? "text-[#2c7a69]"
                : "text-[#9a8e96]",
            )}
          >
            {checkIn.achieved
              ? "케어카드 실천 완료"
              : "케어카드 실천 미완료"}
          </span>
        </div>
      </div>

      <div className="px-[24px] pt-[12px]">
        <div className="relative flex min-h-[77px] items-center overflow-hidden rounded-[16px] border border-[#f0d5eb] bg-[linear-gradient(167deg,#fff9fd_0%,#fceff8_100%)] px-[20px] py-[16px]">
          <span
            aria-hidden="true"
            className="absolute inset-y-0 left-0 w-[4px] bg-[#f19ed2]"
          />

          <p className="text-[13.5px] leading-[21.6px] tracking-[-0.3375px] text-[#4a4048]">
            {checkIn.diary ||
              "이 날 남긴 기록이 없어요."}
          </p>
        </div>
      </div>
    </section>
  )
}
