import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"

import { getCareCard } from "@/features/care/api/create-care-card"
import { getMockCareCard } from "@/features/care/model/mock-care-card"
import pregnancyWeekInfoData from "@/data/pregnancy-week-info.json"
import { Button } from "@/shared/components/ui/button"
import { Skeleton } from "@/shared/components/ui/skeleton"

//user이름, 출산 예정일 정보는 추후 db에서 받아와야 함
const DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24
const PREGNANCY_TOTAL_DAYS = 40 * 7
const dueDate = new Date("2027-01-03")
const userName = "다미"
const defaultMessage = "체크인 후에 만나요"
// TODO(Care Card API): 체크인 저장 API 성공 여부 또는 서버의 체크인 상태로 교체합니다.
const isCheckinCompleted = false
// TODO(Care Card API): 체크인 저장 API의 checkInId로 교체합니다.
const checkInId = 1
// TODO(Care Card API): 실제 API 연동 시 false로 변경합니다.
const useMockCareCard = true
const pregnancyWeekInfo: Record<string, { message?: string }> =
  pregnancyWeekInfoData

//출산 예정일까지 남은 주수와 일수를 계산하는 함수
function getRemainingPregnancyTime(date: Date) {
  const today = new Date()

  //시간 차이 때문에 날짜 계산이 달라지지 않도록 UTC 기준으로 변환
  const todayInUtc = Date.UTC(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  )
  const dueDateInUtc = Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  )
  const remainingDays = Math.max(
    0,
    Math.ceil((dueDateInUtc - todayInUtc) / DAY_IN_MILLISECONDS),
  )

  //남은 전체 일수를 주와 일로 나누어 반환
  return {
    weeks: Math.floor(remainingDays / 7),
    days: remainingDays % 7,
    remainingDays,
  }
}

export function HomePage() {
  const {
    data: careCard,
    isError: isCareCardError,
    isFetching: isCareCardFetching,
    isLoading: isCareCardInitialLoading,
    refetch: refetchCareCard,
  } = useQuery({
    queryKey: ["careCard", checkInId, useMockCareCard],
    // TODO(Care Card API): Mock 단계가 끝나면 getCareCard(checkInId!)만 남깁니다.
    queryFn: () =>
      useMockCareCard ? getMockCareCard() : getCareCard(checkInId),
    enabled: isCheckinCompleted && Boolean(checkInId),
  })
  const today = new Date()
  //아기와 만나기까지 남은 기간
  const { weeks, days, remainingDays } = getRemainingPregnancyTime(dueDate)
  const pregnancyDays = PREGNANCY_TOTAL_DAYS - remainingDays
  const pregnancyWeek = Math.floor(pregnancyDays / 7)
  const currentWeekInfo =
    pregnancyWeek >= 1 && pregnancyWeek <= 40
      ? pregnancyWeekInfo[String(pregnancyWeek)]
      : undefined

  //오늘 날짜를 '8월 7일' 형식으로 표시
  const todayLabel = new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
  }).format(today)

  //time 태그의 dateTime 속성에 사용할 날짜 형식
  const todayDateTime = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-")

  const isCareCardLoading = isCareCardInitialLoading || isCareCardFetching
  const displayMessage = isCheckinCompleted
    ? careCard?.actionName ?? defaultMessage
    : defaultMessage

  return (
    <main className="w-full px-4 pb-16 pt-6 text-black sm:px-6">
      <section className="mx-auto w-full max-w-[460px]">
        {/* 이 시기에 흔히 겪는 변화 안내 */}
        {currentWeekInfo?.message && (
          <div className="rounded-full bg-white px-5 py-[17px] text-center shadow-[0_6px_12px_rgba(57,41,62,0.2)]">
            <p className="text-[13px] font-medium leading-[1.65] tracking-[-0.025em] sm:text-sm">
              {currentWeekInfo.message}
            </p>
          </div>
        )}

        {/* 아기와 만나기까지 남은 기간 */}
        <div className="mt-11 px-3 ">
          <p className="text-xl font-medium leading-tight tracking-[-0.04em] sm:text-2xl">
            {userName}님과 아기가 만나기까지
          </p>
          <h1
            id="home-pregnancy-countdown"
            className="mt-1 text-[42px] font-bold leading-none tracking-[-0.04em] sm:text-[46px] mt-[6px]"
          >
            {weeks}주 {days}일
          </h1>
        </div>

        {/* 오늘의 체크인 카드 */}
        <div className="relative mx-auto mt-[66px] w-[calc(100%-16px)] max-w-[430px]">
          {/* 카드가 뒤에 겹쳐 보이도록 만든 배경 레이어 */}
          <div
            aria-hidden="true"
            className="absolute -top-8 bottom-8 left-4 right-12 rounded-[24px] bg-white/70 shadow-sm blur-[2px]"
          />
          <div
            aria-hidden="true"
            className="absolute -top-5 bottom-5 left-10 right-3 rotate-[-4deg] rounded-[24px] bg-white/80 shadow-sm blur-[2px]"
          />

          <article className="relative flex min-h-[332px] flex-col rounded-[22px] bg-white px-9 pb-8 pt-7 shadow-[0_5px_5px_rgba(48,37,52,0.32)]">
            {/* 오늘 날짜 */}
            <time
              dateTime={todayDateTime}
              className="text-center text-[14px] font-medium tracking-[-0.02em]"
            >
              {todayLabel}
            </time>

            {isCheckinCompleted && isCareCardLoading ? (
              <div
                aria-label="케어카드를 불러오는 중"
                className="flex flex-1 flex-col justify-center gap-3 pb-1"
              >
                <Skeleton className="h-7 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            ) : isCheckinCompleted && isCareCardError ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 pb-1 text-center">
                <p className="text-[15px] leading-[1.5] tracking-[-0.02em] text-[#6b6f76]">
                  케어카드를 불러오지 못했어요.
                  <br />
                  다시 시도해주세요.
                </p>
                <Button
                  className="h-10 rounded-xl bg-[#4b4f55] px-5 text-sm text-white hover:bg-[#3f4349]"
                  onClick={() => void refetchCareCard()}
                  type="button"
                >
                  다시 시도
                </Button>
              </div>
            ) : isCheckinCompleted && careCard ? (
              <div className="flex flex-1 flex-col justify-center pb-1">
                <p className="text-left text-[24px] font-medium leading-[1.4] tracking-[-0.04em] text-black">
                  {displayMessage}
                </p>
              </div>
            ) : (
              <>
                <p className="flex flex-1 items-center justify-center pb-1 text-center text-xl text-medium tracking-[-0.04em] text-[#d0d0d0]">
                  {displayMessage}
                </p>

                {/* 누르면 체크인 페이지로 이동 */}
                <Button
                  asChild
                  size="lg"
                  className="h-[51px] w-full rounded-[16px] bg-[#4b4f55] text-base font-medium text-white shadow-none hover:bg-[#3f4349] focus-visible:ring-[#4b4f55]/35"
                >
                  <Link to="/checkin" aria-label="오늘의 체크인 페이지로 이동">
                    체크인하러 가기&nbsp; &gt;&gt;
                  </Link>
                </Button>
              </>
            )}
          </article>
        </div>
      </section>
    </main>
  )
}
