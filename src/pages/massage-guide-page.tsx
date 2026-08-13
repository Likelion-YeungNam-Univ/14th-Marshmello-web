import { ChevronLeft } from "lucide-react"
import { Link } from "react-router-dom"

import introIllustration from "@/assets/massage-guide/intro-illustration.png"

export function MassageGuidePage() {
  return (
    <main className="min-h-svh bg-white">
      <article className="mx-auto flex min-h-[849px] w-full max-w-[393px] flex-col bg-white">
        <header className="flex items-center px-5 pt-6">
          <Link
            aria-label="케어 화면으로 돌아가기"
            className="relative size-5 rounded-sm transition-opacity after:absolute after:-inset-3 hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f19ed2] active:opacity-50"
            to="/care"
          >
            <ChevronLeft aria-hidden="true" className="size-full" strokeWidth={1.5} />
          </Link>
        </header>

        <div className="flex flex-col items-center px-8 pt-4 pb-[37px]">
          <p className="text-center text-[13px] leading-[19.5px] font-semibold tracking-[1.82px] text-[#f19ed2]">
            MASSAGE GUIDE
          </p>
          <h1 className="mt-[25.5px] text-center text-[22px] leading-[33px] font-semibold tracking-[-0.4px] text-[#26292e]">
            마사지 가이드
          </h1>

          <div className="mt-[25px] flex h-[411px] w-full items-center justify-center overflow-hidden rounded-[26px] bg-[linear-gradient(128.6768deg,#fdf1f8_0%,#fdf3f9_7.1429%,#fef5fa_14.286%,#fef7fb_21.429%,#fef9fc_28.571%,#fefbfd_35.714%,#fffdfE_42.857%,#fff_50%,#fefdfE_57.143%,#fefafc_64.286%,#fdf8fb_71.429%,#fdf5fa_78.571%,#fcf3f9_85.714%,#fcf0f7_92.857%,#fbeef6_100%)] pt-[22px]">
            <div className="relative h-[395px] w-[371px] shrink-0">
              <img
                alt="임산부가 배를 부드럽게 마사지하는 모습"
                className="absolute top-[9.89%] left-[17.79%] h-[80.54%] w-[64.89%] max-w-none"
                src={introIllustration}
              />
            </div>
          </div>

          <div className="mt-[43px] text-center text-[19px] leading-[30.4px] tracking-[-0.2px]">
            <p className="font-semibold text-[#26292e]">
              몸이 편해지는 마사지 시간
            </p>
            <p className="font-medium text-[#6a6e75]">시작해볼까요?</p>
          </div>

          <button
            className="mt-[78.2px] flex h-14 w-full items-center justify-center rounded-[15px] bg-[#f19ed2] text-[16px] leading-6 font-semibold text-white shadow-[0_10px_12px_rgba(241,158,210,0.8)] transition-[filter,transform] hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f19ed2] focus-visible:ring-offset-2 active:translate-y-px active:brightness-90"
            type="button"
          >
            시작하기
          </button>
        </div>
      </article>
    </main>
  )
}
