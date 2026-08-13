import { Play } from "lucide-react"
import { Link } from "react-router-dom"

export function MassageGuideButton() {
  return (
    <Link
      className="mx-auto mt-3 flex h-[35px] w-[221px] items-center justify-center gap-[27px] rounded-[10px] bg-[#e8c5e5] text-[12px] leading-[1.4] tracking-[-0.02em] transition-opacity active:opacity-70"
      to="/massage-guide"
    >
      마사지 가이드 보러가기
      <Play aria-hidden="true" className="size-[13px] fill-current" />
    </Link>
  )
}
