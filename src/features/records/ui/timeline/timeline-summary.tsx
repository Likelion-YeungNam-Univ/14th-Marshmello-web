import moodGood from "@/assets/checkin/mood/good.svg"
import moodGreat from "@/assets/checkin/mood/great.svg"
import moodNeutral from "@/assets/checkin/mood/neutral.svg"
import moodSad from "@/assets/checkin/mood/sad.svg"

import type {
  TimelineCheckIn,
} from "../../model/timeline-types"

type TimelineSummaryProps = {
  checkIn: TimelineCheckIn
}

type EmotionConfig = {
  label: string
  image: string
}

const EMOTION_CONFIG: Record<
  number,
  EmotionConfig
> = {
  1: {
    label: "우울해요",
    image: moodSad,
  },
  2: {
    label: "그냥 그래요",
    image: moodNeutral,
  },
  3: {
    label: "좋아요",
    image: moodGood,
  },
  4: {
    label: "최고에요",
    image: moodGreat,
  },
}

function formatTimelineDate(
  date: string,
) {
  const parsedDate =
    new Date(`${date}T00:00:00`)

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
}: TimelineSummaryProps) {
  const emotionConfig =
    EMOTION_CONFIG[
      checkIn.emotion
    ]

  return (
    <section className="px-[59px]">
      <div className="mt-[40px] ml-[-160px] flex items-center justify-center gap-[5px]">
        <span
          aria-hidden="true"
          className="text-[12px] font-semibold text-black"
        >
          {"["}
        </span>

        <p className="text-[14px] font-semibold tracking-[-0.14px]">
          {formatTimelineDate(
            checkIn.checkInDate,
          )}
        </p>

        <span
          aria-hidden="true"
          className="text-[12px] font-semibold text-black"
        >
          {"]"}
        </span>
      </div>

      {checkIn.achieved && (
        <div className="ml-[-4px] mt-[40px] w-fit h-fit rounded-[15px] border border-[#91ddcf] bg-[rgba(145,221,207,0.66)] px-[12px] py-[7px]">
          <span className="text-[11px] tracking-[-0.11px] text-black">
            케어카드 실천 완료
          </span>
        </div>
      )}

      <div className="mt-[15px]">
        <div className="flex items-center gap-[16px]">
          <div className="flex size-[44px] shrink-0 items-center justify-center rounded-full bg-[#f6c5df]">
            {emotionConfig ? (
              <img
                src={emotionConfig.image}
                alt=""
                aria-hidden="true"
                className="size-[34px] object-contain"
              />
            ) : (
              <span className="text-[13px] text-[#9d8a96]">
                -
              </span>
            )}
          </div>

          <p className="text-[24px] font-medium tracking-[-0.24px] text-[#ef9bce]">
            {emotionConfig?.label ??
              "기분 기록"}
          </p>
        </div>

        {checkIn.diary && (
          <div className="mt-[17px] rounded-[5px] border border-[#e8c5e5] bg-white px-[10px] py-[15px]">
            <p className="text-[14px] leading-[1.5] tracking-[-0.14px] text-black">
              {checkIn.diary}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}