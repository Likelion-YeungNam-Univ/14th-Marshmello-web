import {
  ChevronLeft,
  Trash2,
} from "lucide-react"

import type {
  TimelineDetailData,
} from "../../model/timeline-types"

import {
  TimelineImageSection,
} from "./timeline-image-section"

import {
  TimelineSummary,
} from "./timeline-summary"

type TimelineDetailProps = {
  data: TimelineDetailData
  onBack: () => void
}

export function TimelineDetail({
  data,
  onBack,
}: TimelineDetailProps) {
  return (
    <main className="mx-auto min-h-dvh w-full max-w-[393px] overflow-y-auto bg-white text-black">
      <header className="relative flex h-[96px] items-end justify-center pb-[14px]">
        <button
          aria-label="뒤로가기"
          className="absolute left-[14px] top-[44px] flex size-[36px] items-center justify-center"
          type="button"
          onClick={onBack}
        >
          <ChevronLeft
            size={22}
            strokeWidth={2}
          />
        </button>

        <h1 className="text-[16px] font-semibold tracking-[-0.16px]">
          타임라인 상세보기
        </h1>
      </header>

      <TimelineSummary
        checkIn={data.checkIn}
      />

      <div className="mt-[76px]">
        <TimelineImageSection
          title="이 날의 배 다시보기"
          imageUrl={data.imageUrl}
        />

        <TimelineImageSection
          title="이 날의 바디맵 다시보기"
          imageUrl={null}
        />
      </div>

      <div className="px-[36px] pb-[72px] pt-[0px]">
        <button
          className="flex h-[47px] w-full items-center justify-center gap-[12px] rounded-[15px] bg-[#484c52] text-white"
          type="button"
        >
          <span className="text-[16px] font-semibold">
            기록 삭제하기
          </span>

          <Trash2
            size={20}
            strokeWidth={1.8}
          />
        </button>
      </div>
    </main>
  )
}
