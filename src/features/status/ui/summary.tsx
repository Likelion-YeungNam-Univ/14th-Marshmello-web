import type {
  checkInCountResponse,
} from "@/features/test/checkin_Controller"

import {
  getDaysInMonth,
} from "@/features/records/model/utils"

type SummaryProps = {
  data: checkInCountResponse
}

function formatMonth(
  yearMonth: string,
) {
  const [year, month] =
    yearMonth.split("-")

  return `${year}년 ${Number(month)}월`
}

function getPracticeRate(
  yearMonth: string,
  count: number,
) {
  const totalDays =
    getDaysInMonth(yearMonth)

  if (totalDays === 0) {
    return 0
  }

  return Number(
    ((count / totalDays) * 100).toFixed(1),
  )
}

export function Summary({
  data,
}: SummaryProps) {
  const practiceRate =
    getPracticeRate(
      data.requestMonth,
      data.count,
    )

  return (
    <section className="w-full bg-[rgba(232,197,229,0.75)] px-[19px] pb-[10px] pt-[13px]">
      <h2 className="text-center text-[18px] font-medium">
        {formatMonth(
          data.requestMonth,
        )}{" "}
        요약
      </h2>

      <div className="mx-auto ml-[5px] mt-[28px] grid w-full max-w-[340px] grid-cols-2 gap-[19px]">
        <div className="relative h-[110px] rounded-[15px] bg-white/80 px-[18px] pt-[16px]">
          <p className="text-[13px] font-semibold text-[#484c52]">
            체크인
          </p>

          <p className="mt-[8px] text-center text-[36px] font-bold tracking-[-1px] text-[#7a4e88]">
            {data.count}
            <span className="ml-[3px] text-[32px] font-semibold">
              일
            </span>
          </p>

          <span className="absolute left-[54px] top-[8px] text-[15px] text-[#a7d7ca]">
            ✦
          </span>
        </div>

        <div className="relative h-[110px] rounded-[15px] bg-white/80 px-[22px] pt-[16px]">
          <p className="text-[13px] font-semibold text-[#484c52]">
            실천율
          </p>

          <div className="mt-[4px] flex justify-center">
            <div className="relative size-[64px]">
              <svg
                className="size-full -rotate-90"
                viewBox="0 0 64 64"
              >
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke="#d9d9d9"
                  strokeWidth="6"
                />

                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke="#7a4e88"
                  strokeLinecap="round"
                  strokeWidth="6"
                  strokeDasharray={
                    2 *
                    Math.PI *
                    28
                  }
                  strokeDashoffset={
                    2 *
                    Math.PI *
                    28 *
                    (1 -
                      practiceRate /
                        100)
                  }
                />
              </svg>

              <span className="absolute inset-0 flex items-center justify-center text-[14px] font-semibold text-[#404040]">
                {practiceRate}%
              </span>
            </div>
          </div>

          <span className="absolute left-[58px] top-[5px] text-[20px] text-[#a7d7ca]">
            ✓
          </span>
        </div>
      </div>

      <p className="mt-[16px] text-right text-[11px] text-black">
        월별 상세 기록은 그래프의 선을 움직여 확인할 수 있어요.
      </p>
    </section>
  )
}