import {
  useEffect,
  useState,
} from "react"

import {
  ChevronLeft,
} from "lucide-react"

import {
  getcheckInCount,
  type checkInCountResponse,
} from "@/features/test/checkin_Controller"

import {
  Chart,
} from "@/features/status/ui/chart"

import {
  Summary,
} from "@/features/status/ui/summary"

function getRecentSixMonths() {
  const now = new Date()

  return Array.from(
    { length: 6 },
    (_, index) => {
      const date = new Date(
        now.getFullYear(),
        now.getMonth() -
          (5 - index),
        1,
      )

      return `${date.getFullYear()}-${String(
        date.getMonth() + 1,
      ).padStart(2, "0")}`
    },
  )
}

export function StatusPage() {
  const [
    monthlyData,
    setMonthlyData,
  ] = useState<checkInCountResponse[]>([])

  const [
    selectedMonthIndex,
    setSelectedMonthIndex,
  ] = useState(0)

  const [
    isLoading,
    setIsLoading,
  ] = useState(true)

  const [
    errorMessage,
    setErrorMessage,
  ] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const loadStatus = async () => {
      try {
        setIsLoading(true)
        setErrorMessage(null)

        const months =
          getRecentSixMonths()

        const responses =
          await Promise.all(
            months.map((month) =>
              getcheckInCount(month),
            ),
          )

        if (cancelled) {
          return
        }

        setMonthlyData(responses)

        setSelectedMonthIndex(
          responses.length - 1,
        )
      } catch (error) {
        console.error(
          "관리 현황 조회 실패:",
          error,
        )

        if (!cancelled) {
          setErrorMessage(
            "관리 현황을 불러오지 못했어요. 잠시 후 다시 시도해주세요.",
          )
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void loadStatus()

    return () => {
      cancelled = true
    }
  }, [])

  if (isLoading) {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-[393px] items-center justify-center overflow-x-hidden bg-white">
        <p className="text-[14px] text-[#7a4e88]">
          관리 현황을 불러오는 중이에요.
        </p>
      </main>
    )
  }

  if (
    errorMessage ||
    monthlyData.length === 0
  ) {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-[393px] items-center justify-center overflow-x-hidden bg-white px-6">
        <p className="text-center text-[14px] leading-[1.6] text-[#6c7278]">
          {errorMessage ??
            "관리 현황을 불러오지 못했어요."}
        </p>
      </main>
    )
  }

  const selectedData =
    monthlyData[
      selectedMonthIndex
    ] ??
    monthlyData[
      monthlyData.length - 1
    ]

  return (
    <main className="mx-auto min-h-dvh w-full max-w-[393px] overflow-x-hidden overflow-y-auto bg-white">
      <header className="relative h-[87px]">
        <button
          aria-label="뒤로가기"
          className="absolute left-[14px] top-[20px] flex size-[36px] items-center justify-center"
          type="button"
          onClick={() =>
            window.history.back()
          }
        >
          <ChevronLeft
            size={22}
            strokeWidth={1.8}
          />
        </button>

        <h1 className="absolute left-1/2 top-[25px] -translate-x-1/2 text-[16px] font-semibold tracking-[-0.16px]">
          지난 관리 현황
        </h1>
      </header>

      <section className="h-[500px] bg-white px-[29px] pt-[20px]">
        <p className="text-[16px] leading-[1.4]">
          지나간 시간을 함께 돌아봐요.
        </p>

        <Chart
          data={monthlyData}
          selectedIndex={
            selectedMonthIndex
          }
          onSelect={
            setSelectedMonthIndex
          }
        />
      </section>

      <div className="mt-[10px]">
        <Summary
          data={selectedData}
        />
      </div>

      <div className="flex h-[34px] items-end justify-center bg-[rgba(232,197,229,0.75)] pb-[8px]" />
    </main>
  )
}