import {
  useEffect,
  useState,
} from "react"

import {
  useLocation,
  useNavigate,
} from "react-router-dom"

import {
  deleteTimelineCheckIn,
  getTimelineCheckIn,
  getTimelineImageUrl,
} from "@/features/records/api/timeline-api"

import type {
  TimelineDetailData,
} from "@/features/records/model/timeline-types"

import {
  TimelineDetail,
} from "@/features/records/ui/timeline/timeline-detail"

export function TimelinePage() {
  const navigate =
    useNavigate()

  const location =
    useLocation()

  const searchParams =
    new URLSearchParams(
      location.search,
    )

  const date =
    searchParams.get("date")

  const [
    data,
    setData,
  ] =
    useState<TimelineDetailData | null>(
      null,
    )

  const [
    isLoading,
    setIsLoading,
  ] =
    useState(true)

  const [
    errorMessage,
    setErrorMessage,
  ] =
    useState<string | null>(
      null,
    )

  const [
    isDeleting,
    setIsDeleting,
  ] =
    useState(false)

  useEffect(() => {
    let cancelled = false

    const loadTimeline =
      async () => {
        if (!date) {
          setErrorMessage(
            "조회할 날짜가 없습니다.",
          )
          setIsLoading(false)
          return
        }

        try {
          setIsLoading(true)
          setErrorMessage(null)

          const checkIns =
            await getTimelineCheckIn(
              date,
            )

          if (
            checkIns.length === 0
          ) {
            throw new Error(
              "해당 날짜의 체크인 기록이 없습니다.",
            )
          }

          const checkIn =
            checkIns[0]

          let imageUrl:
            | string
            | null = null

          if (checkIn.imageId) {
            try {
              imageUrl =
                await getTimelineImageUrl(
                  checkIn.imageId,
                )
            } catch {
              imageUrl = null
            }
          }

          if (cancelled) {
            return
          }

          setData({
            checkIn,
            imageUrl,
          })
        } catch (error) {
          console.error(
            "타임라인 조회 실패:",
            error,
          )

          if (!cancelled) {
            setErrorMessage(
              "해당 날짜의 기록을 불러오지 못했어요.",
            )
          }
        } finally {
          if (!cancelled) {
            setIsLoading(false)
          }
        }
      }

    void loadTimeline()

    return () => {
      cancelled = true
    }
  }, [date])

  const handleDelete =
    async () => {
      if (
        !date ||
        !data ||
        isDeleting
      ) {
        return
      }

      try {
        setIsDeleting(true)

        await deleteTimelineCheckIn(
          data.checkIn.checkInId,
          date,
        )

        navigate("/records", {
          replace: true,
        })
      } catch (error) {
        console.error(
          "기록 삭제 실패:",
          error,
        )

        window.alert(
          "기록을 삭제하지 못했어요. 잠시 후 다시 시도해주세요.",
        )
      } finally {
        setIsDeleting(false)
      }
    }

  if (isLoading) {
    return (
if (isLoading) {
  return (
    <main className="mx-auto min-h-dvh w-full max-w-[393px] bg-white" />
  )
}
    )
  }

  if (
    errorMessage ||
    !data
  ) {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-[393px] items-center justify-center bg-white px-6">
        <div className="text-center">
          <p className="text-[14px] leading-[1.6] text-[#6c7278]">
            {errorMessage ??
              "기록을 불러오지 못했어요."}
          </p>

          <button
            className="mt-[20px] text-[14px] font-medium text-[#ef9bce]"
            type="button"
            onClick={() =>
              navigate(-1)
            }
          >
            돌아가기
          </button>
        </div>
      </main>
    )
  }

  return (
    <TimelineDetail
      data={data}
      onBack={() =>
        navigate(-1)
      }
      onDelete={
        handleDelete
      }
      isDeleting={
        isDeleting
      }
    />
  )
}
