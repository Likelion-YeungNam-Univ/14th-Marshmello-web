import {
  useEffect,
  useState,
} from "react"

import {
  getCheckInEmotions,
  getcheckInCount,
  getcheckInRegion,
} from "@/features/test/checkin_Controller"

import {
  createReport,
  getReport,
  type ReportResponse,
} from "@/features/test/report-Controller"

import {
  getBodyRegionLabel,
} from "@/features/records/model/utils"

import type {
  EmotionByDate,
  RecordsData,
} from "@/features/records/model/types"

import {
  RecordsAiReport,
} from "@/features/records/ui/ai-report"

import {
  RecordsCalendar,
} from "@/features/records/ui/calendar"

import {
  RecordsMonthHeader,
} from "@/features/records/ui/month-header"

import {
  RecordsSummary,
} from "@/features/records/ui/summary"

function getCurrentMonth() {
  const now = new Date()

  return `${now.getFullYear()}-${String(
    now.getMonth() + 1,
  ).padStart(2, "0")}`
}

export function RecordsPage() {
  const [data, setData] =
    useState<RecordsData | null>(null)

  const [requestMonth, setRequestMonth] =
    useState(() => getCurrentMonth())

  const [isLoading, setIsLoading] =
    useState(true)

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const loadRecords = async () => {
      try {
        setIsLoading(true)
        setErrorMessage(null)

        const count =
          await getcheckInCount(
            requestMonth,
          )

        const [
          emotionsResponse,
          topBodyRegion,
        ] = await Promise.all([
          getCheckInEmotions(
            requestMonth,
          ),
          getcheckInRegion(
            requestMonth,
          ),
        ])

        const emotions =
          emotionsResponse as unknown as EmotionByDate[]

        let report:
          | ReportResponse
          | null = null

        const currentMonth =
          getCurrentMonth()

        if (requestMonth !== currentMonth) {
          try {
            await createReport(
              requestMonth,
            )

            report =
              await getReport(
                requestMonth,
              )
          } catch (reportError) {
            console.error(
              "월간 리포트 조회 실패:",
              reportError,
            )
          }
        }

        if (cancelled) {
          return
        }

        setData({
          requestMonth,
          count: count.count,
          achievedCount:
            count.achievedCount,
          emotions,
          topBodyRegion:
            topBodyRegion.bodyRegion,
          report,
        })
      } catch (error) {
        console.error(
          "기록 데이터 조회 실패:",
          error,
        )

        if (!cancelled) {
          setErrorMessage(
            "기록 정보를 불러오지 못했어요. 잠시 후 다시 시도해주세요.",
          )
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void loadRecords()

    return () => {
      cancelled = true
    }
  }, [requestMonth])

  if (isLoading) {
    return (
      <main className="mx-auto min-h-[852px] w-full max-w-[393px] bg-[#e8c5e5] px-[15px] pt-[110px]">
        <p className="text-center text-[14px] text-[#7a4e88]">
          기록을 불러오는 중이에요.
        </p>
      </main>
    )
  }

  if (errorMessage || !data) {
    return (
      <main className="mx-auto flex min-h-[852px] w-full max-w-[393px] items-center justify-center bg-[#e8c5e5] px-6">
        <p className="text-center text-[14px] leading-[1.6] text-[#6c7278]">
          {errorMessage ??
            "기록을 불러오지 못했어요."}
        </p>
      </main>
    )
  }

  const monthNumber =
    data.requestMonth.slice(5)

  const monthText =
    `${Number(monthNumber)}월`

  const topBodyRegionLabel =
    getBodyRegionLabel(
      data.topBodyRegion,
    )

  const aiReport =
    data.report?.content ?? "---"

  return (
    <main className="mx-auto min-h-[852px] w-full max-w-[393px] overflow-y-auto bg-[#e8c5e5] text-black">
      <section className="relative px-[15px] pb-[8px] pt-[20px]">
        <RecordsSummary
          monthText={monthText}
          count={data.count}
          topBodyRegionLabel={
            topBodyRegionLabel
          }
        />

        <RecordsMonthHeader />

        <RecordsAiReport
          monthText={monthText}
          content={aiReport}
        />
      </section>

      <RecordsCalendar
        requestMonth={
          data.requestMonth
        }
        emotions={data.emotions}
        onMonthChange={
          setRequestMonth
        }
      />
    </main>
  )
}