import { ChevronRight } from "lucide-react"
import { Link } from "react-router-dom"

type ContentCardProps = {
  description: string
  id: string
  image: string
  isLast: boolean
  title: string
}

export function ContentCard({
  description,
  id,
  image,
  isLast,
  title,
}: ContentCardProps) {
  return (
    <Link
      aria-label={`${title} 상세 콘텐츠 보기`}
      className={`group flex h-[91px] items-center gap-3.5 p-3.5 transition-colors duration-75 active:bg-black/[0.03] ${
        isLast ? "" : "border-b-2 border-black/5"
      }`}
      to={`/contents/${id}`}
    >
      <img
        alt=""
        className="size-[60px] shrink-0 rounded-[10px] object-cover"
        src={image}
      />
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-[13px] leading-[19.5px] font-medium tracking-[-0.01em] text-[#2a2c30]">
          {title}
        </h3>
        <p className="mt-1 line-clamp-2 h-9 text-[12px] leading-[18px] tracking-[-0.01em] text-[#6b6f76]">
          {description}
        </p>
      </div>
      <ChevronRight
        aria-hidden="true"
        className="size-[18px] shrink-0 text-[#6b6f76]/55"
        strokeWidth={1.7}
      />
    </Link>
  )
}
