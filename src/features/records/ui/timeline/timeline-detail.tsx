import {
  ChevronLeft,
  Trash2,
} from "lucide-react"

import type {
  TimelineDetailData,
} from "../../model/timeline-types"

import {
  TimelineBodyMap,
} from "./body-map"

import {
  TimelineImageSection,
} from "./timeline-image-section"

import {
  TimelineSummary,
} from "./timeline-summary"

type TimelineDetailProps = {
  data: TimelineDetailData
  onBack: () => void
  onDelete: () => void
  isDeleting: boolean
}

export function TimelineDetail({
  data,
  onBack,
  onDelete,
  isDeleting,
}: TimelineDetailProps) {
  return (
<main className="mt-[-20px] mx-auto min-h-dvh w-full max-w-[393px] overflow-y-auto bg-white text-black">
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
        checkIn={
          data.checkIn
        }
      />

      <div className="mt-[30px]">
        <TimelineImageSection
          title="이 날의 배 다시보기"
        >
          {data.imageUrl ? (
            <img
              alt="체크인 당시 배 사진"
              className="h-[270px] w-full object-cover"
              src={data.imageUrl}
            />
          ) : (
            <div className="flex h-[270px] items-center justify-center text-[13px] text-[#8c8c8c]">
              이미지를 불러오지 못했어요.
            </div>
          )}
        </TimelineImageSection>

        <TimelineImageSection
          title="이 날의 바디맵 다시보기"
        >
          <div className="flex min-h-[270px] items-center justify-center overflow-visible bg-white px-[20px] py-[20px]">
            <div className="relative top-[-25px]">
              <TimelineBodyMap
                bodyDiaries={
                  data.checkIn
                    .bodyDiaries
                }
              />
            </div>
          </div>
        </TimelineImageSection>
      </div>

      <div className="px-[36px] pb-[72px] pt-0">
        <button
          className="flex h-[47px] w-full items-center justify-center gap-[12px] rounded-[15px] bg-[#484c52] text-white disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isDeleting}
          type="button"
          onClick={onDelete}
        >
          <span className="text-[16px] font-semibold">
            {isDeleting
              ? "삭제 중..."
              : "기록 삭제하기"}
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
