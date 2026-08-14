import { Link } from "react-router-dom"

import { Button } from "@/shared/components/ui/button"

//user이름, 출산 예정일 정보는 추후 db에서 받아와야 함
const DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24
const dueDate = new Date("2027-02-03")
const userName = "다미"

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
  }
}

export function HomePage() {
  const today = new Date()
  //아기와 만나기까지 남은 기간
  const { weeks, days } = getRemainingPregnancyTime(dueDate)

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

  return (
    <main className="w-full px-4 pb-16 pt-6 text-black sm:px-6">
      <section className="mx-auto w-full max-w-[460px]">
        {/* 이 시기에 흔히 겪는 변화 안내 */}
        <div className="rounded-full bg-white px-5 py-[17px] text-center shadow-[0_6px_12px_rgba(57,41,62,0.2)]">
          <p className="text-[13px] font-medium leading-[1.65] tracking-[-0.025em] sm:text-sm">
            임신 중반 초산모의 대다수가 7주차에 배와 가슴 피부가 당기는 걸
            느껴요. 자연스러운 변화예요.
          </p>
        </div>

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

            {/* 체크인 전 안내 문구 */}
            <p className="flex flex-1 items-center justify-center pb-1 text-center text-xl text-medium tracking-[-0.04em] text-[#d0d0d0]">
              체크인 후에 만나요
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
          </article>
        </div>
      </section>
    </main>
  )
}
