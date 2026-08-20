import {
  useState,
} from "react"

import {
  ImageIcon,
  Trash2,
} from "lucide-react"

import { cn } from "@/shared/lib/utils"

import type {
  TimelineDetailData,
} from "../../model/timeline-types"

import {
  TimelineBodyMap,
} from "./body-map"

import {
  TimelineSummary,
} from "./timeline-summary"

type TimelineDetailProps = {
  data: TimelineDetailData
  isDeleting: boolean
  onDelete: () => void
  onNextDate: () => void
  onPreviousDate: () => void
}

type TimelineTab =
  | "belly"
  | "bodyMap"

const tabs: Array<{
  id: TimelineTab
  label: string
}> = [
  {
    id: "belly",
    label: "이 날의 배",
  },
  {
    id: "bodyMap",
    label: "이 날의 바디맵",
  },
]

type EmptyMediaProps = {
  label: string
}

function EmptyMedia({
  label,
}: EmptyMediaProps) {
  return (
    <div className="flex size-full flex-col items-center justify-center gap-[8px]">
      <ImageIcon
        aria-hidden="true"
        className="size-[34px] text-[#b7a9b2]"
        strokeWidth={1.8}
      />

      <p className="text-[12px] leading-[18px] tracking-[-0.3px] text-[#b7a9b2]">
        {label}
      </p>
    </div>
  )
}

export function TimelineDetail({
  data,
  isDeleting,
  onDelete,
  onNextDate,
  onPreviousDate,
}: TimelineDetailProps) {
  const [
    activeTab,
    setActiveTab,
  ] =
    useState<TimelineTab>(
      "belly",
    )

  const hasBodyMap =
    data.checkIn.bodyDiaries
      .length > 0

  return (
    <main className="mx-auto min-h-[calc(100dvh-var(--header-layout-height))] w-full max-w-[393px] overflow-x-hidden bg-white text-[#2a2c30]">
      <TimelineSummary
        checkIn={
          data.checkIn
        }
        onNextDate={
          onNextDate
        }
        onPreviousDate={
          onPreviousDate
        }
      />

      <section className="px-[24px] pt-[32px]">
        <div
          aria-label="기록 이미지 종류"
          className="flex h-[43.5px] w-full gap-[4px] rounded-full bg-[#f4eef3] p-[4px]"
          role="tablist"
        >
          {tabs.map((tab) => {
            const isActive =
              activeTab === tab.id

            return (
              <button
                key={tab.id}
                aria-controls={`timeline-${tab.id}-panel`}
                aria-selected={
                  isActive
                }
                className={cn(
                  "flex min-w-0 flex-1 items-center justify-center rounded-full py-[8px] text-[13px] font-medium leading-[19.5px] tracking-[-0.325px]",
                  isActive
                    ? "bg-white text-[#b83c7c] shadow-[0_1px_1.5px_rgba(0,0,0,0.10),0_1px_1px_rgba(0,0,0,0.10)]"
                    : "text-[#9a8e96]",
                )}
                id={`timeline-${tab.id}-tab`}
                role="tab"
                type="button"
                onClick={() =>
                  setActiveTab(
                    tab.id,
                  )
                }
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        <div
          aria-labelledby={`timeline-${activeTab}-tab`}
          className={cn(
            "mt-[16px] w-full rounded-[16px]",
            activeTab === "bodyMap"
              ? "min-h-[345px] bg-white"
              : "aspect-square overflow-hidden bg-[linear-gradient(135deg,#f3ecf1_0%,#e9e0e8_100%)]",
          )}
          id={`timeline-${activeTab}-panel`}
          role="tabpanel"
        >
          {activeTab ===
          "belly" ? (
            data.imageUrl ? (
              <img
                alt="체크인 당시 배 사진"
                className="size-full object-cover"
                src={data.imageUrl}
              />
            ) : (
              <EmptyMedia label="배 사진 다시보기" />
            )
          ) : hasBodyMap ? (
            <div className="flex w-full justify-center px-[20px] py-[20px]">
              <TimelineBodyMap
                compact
                bodyDiaries={
                  data.checkIn
                    .bodyDiaries
                }
              />
            </div>
          ) : (
            <div className="h-[345px]">
              <EmptyMedia label="바디맵 다시보기" />
            </div>
          )}
        </div>
      </section>

      <div className="px-[24px] pb-[calc(62px+env(safe-area-inset-bottom))] pt-[32px]">
        <button
          className="flex h-[52px] w-full items-center justify-center gap-[8px] rounded-[16px] bg-[#484c52] text-white disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isDeleting}
          type="button"
          onClick={onDelete}
        >
          <span className="text-[15px] font-semibold leading-[22.5px] tracking-[-0.375px]">
            {isDeleting
              ? "삭제 중..."
              : "기록 삭제하기"}
          </span>

          <Trash2
            aria-hidden="true"
            className="size-[18px]"
            strokeWidth={1.8}
          />
        </button>
      </div>
    </main>
  )
}
