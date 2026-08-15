import { Play } from "lucide-react"
import { Link } from "react-router-dom"

export function MassageGuideButton() {
  return (
    <Link
      className="mt-3 flex h-[50px] w-full items-center justify-between rounded-[16px] bg-[#e8c5e5] py-3.5 pl-5 pr-4 text-[14px] leading-[21px] font-medium tracking-[-0.01em] text-[#2a2c30] transition-opacity active:opacity-70"
      to="/massage-guide"
    >
      마사지 가이드 보러가기
      <span className="flex size-7 items-center justify-center rounded-full bg-white/[0.83]">
        <Play aria-hidden="true" className="size-3 fill-current" strokeWidth={0} />
      </span>
    </Link>
  )
}
