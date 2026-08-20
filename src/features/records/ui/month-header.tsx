import {
  ChevronRight,
  Folder,
} from "lucide-react"
import { useNavigate } from "react-router-dom"

export function RecordsMonthHeader() {
  const navigate = useNavigate()

  return (
    <button
      className="mt-[11px] ml-auto flex h-[52px] w-[231px] items-center gap-4 rounded-[15px] border-b border-white bg-white/80 px-5"
      type="button"
      onClick={() =>
        navigate("/status")
      }
    >
      <span className="flex size-[36px] items-center justify-center rounded-[12px] bg-[#fdf2f8] text-[#c88ab7]">
        <Folder
          size={20}
          strokeWidth={1.7}
        />
      </span>

      <span className="flex-1 text-left text-[14px] text-[#3d3d3d]">
        관리 현황 확인하기
      </span>

      <ChevronRight
        size={16}
        strokeWidth={1.8}
        className="text-[#888]"
      />
    </button>
  )
}