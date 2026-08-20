import {
  useEffect,
  useState,
} from "react"

import {
  useNavigate,
} from "react-router-dom"

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
  changeMonth,
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

function hasEmotionRecord(
  emotions: EmotionByDate[],
) {
  return emotions.some(
    (item) =>
      item != null &&
      item.emotion != null,
  )
}

export function RecordsPage() {
  const navigate =
    useNavigate()

  const [data, setData] =
    useState<RecordsData | null>(
      null,
    )

  const [requestMonth, setRequestMonth] =
    useState(() =>
      getCurrentMonth(),
    )

  const [isInitialLoading, setIsInitialLoading] =
    useState(true)

  const [errorMessage, setErrorMessage] =
    useState<string | null>(
      null,
    )

  useEffect(() => {
    let cancelled = false

    const loadRecords = async () => {
      try {
        setErrorMessage(null)

        const reportMonth =
          changeMonth(
            requestMonth,
            -1,
          )

        const [
          count,
          emotionsResponse,
          topBodyRegion,
          reportCount,
          reportEmotionsResponse,
        ] = await Promise.all([
          getcheckInCount(
            requestMonth,
          ),
          getCheckInEmotions(
            requestMonth,
          ),
          getcheckInRegion(
            requestMonth,
          ),
          getcheckInCount(
            reportMonth,
          ),
          getCheckInEmotions(
            reportMonth,
          ),
        ])

        const emotions =
          emotionsResponse as unknown as EmotionByDate[]

        const reportEmotions =
          reportEmotionsResponse as unknown as EmotionByDate[]

        const hasReportMonthRecord =
          reportCount.count > 0 &&
          hasEmotionRecord(
            reportEmotions,
          )

        let report:
          | ReportResponse
          | null = null

        if (
          hasReportMonthRecord
        ) {
          try {
            await createReport(
              reportMonth,
            )
          } catch {
            // 이미 생성된 리포트인 경우 무시
          }

          try {
            report =
              await getReport(
                reportMonth,
              )
          } catch {
            report = null
          }
        }

        if (cancelled) {
          return
        }

        setData({
          requestMonth,
          count:
            count.count,
          achievedCount:
            count.achievedCount,
          emotions,
          topBodyRegion:
            topBodyRegion.bodyRegion,
          report,
        })
      } catch {
        if (!cancelled) {
          setErrorMessage(
            "기록 정보를 불러오지 못했어요. 잠시 후 다시 시도해주세요.",
          )
        }
      } finally {
        if (!cancelled) {
          setIsInitialLoading(false)
        }
      }
    }

    void loadRecords()

    return () => {
      cancelled = true
    }
  }, [requestMonth])

  if (
    isInitialLoading ||
    !data
  ) {
    return (
      <main className="mx-auto min-h-[852px] w-full max-w-[393px] bg-white" />
    )
  }

  if (errorMessage) {
    return (
      <main className="mx-auto flex min-h-[852px] w-full max-w-[393px] items-center justify-center bg-white px-6">
        <p className="text-center text-[14px] leading-[1.6] text-[#6c7278]">
          {errorMessage}
        </p>
      </main>
    )
  }

  const monthNumber =
    data.requestMonth.slice(5)

  const monthText =
    `${Number(monthNumber)}월`

  const reportMonth =
    changeMonth(
      data.requestMonth,
      -1,
    )

  const reportMonthNumber =
    reportMonth.slice(5)

  const reportMonthText =
    `${Number(reportMonthNumber)}월`

  const topBodyRegionLabel =
    getBodyRegionLabel(
      data.topBodyRegion,
    )

  const hasCurrentMonthRecord =
    data.count > 0 &&
    hasEmotionRecord(
      data.emotions,
    )

  const reportText =
    data.report?.content ??
    (hasCurrentMonthRecord
      ? "저번 달 기록이 없어서 리포트를 준비할 수 없어요"
      : "저번 달 기록이 없어서 리포트를 준비할 수 없어요")

  return (
    <main className="mx-auto min-h-[852px] w-full max-w-[393px] overflow-y-auto bg-white text-black">
      <section className="relative bg-[#e8c5e5] px-[15px] pb-[8px] pt-[20px]">
        <RecordsSummary
          monthText={
            monthText
          }
          count={
            data.count
          }
          topBodyRegionLabel={
            topBodyRegionLabel
          }
        />

        <RecordsMonthHeader />

        <RecordsAiReport
          monthText={
            reportMonthText
          }
          content={
            reportText
          }
        />
      </section>

      <RecordsCalendar
        requestMonth={
          data.requestMonth
        }
        emotions={
          data.emotions
        }
        onMonthChange={
          setRequestMonth
        }
        onDateClick={(
          date,
        ) => {
          navigate(
            `/records/timeline?date=${date}`,
          )
        }}
      />
    </main>
  )
}