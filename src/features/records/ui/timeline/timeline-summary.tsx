import type {
  TimelineCheckIn,
} from "../../model/timeline-types"

type TimelineSummaryProps = {
  checkIn: TimelineCheckIn
}

function getEmotionLabel(
  emotion: number,
) {
  switch (emotion) {
    case 1:
      return "기분 최고에요"
    case 2:
      return "기분 좋아요"
    case 3:
      return "그냥 그래요"
    case 4:
      return "조금 속상해요"
    default:
      return "오늘의 기분"
  }
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
  const emotionLabel =
    getEmotionLabel(
      checkIn.emotion,
    )

  return (
    <>
     
     {checkIn.achieved && (
          <div className="ml-[55px] mt-[20px] w-fit rounded-[15px] border border-[#91ddcf] bg-[rgba(145,221,207,0.66)] px-[12px] py-[7px]">
            <span className="text-[11px] tracking-[-0.11px] text-black">
              케어카드 실천 완료
            </span>
          </div>
        )}

      <div className="mt-[15px] px-[59px]">
        <div className="flex items-center gap-[16px]">
          <div className="flex size-[44px] items-center justify-center rounded-full bg-[#f6c5df]">
            <span className="text-[21px]">
                여기에 emotion 넣기
            </span>
          </div>

          <p className="text-[24px] font-medium tracking-[-0.24px] text-[#ef9bce]">
            {emotionLabel}
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
    </>
  )
}