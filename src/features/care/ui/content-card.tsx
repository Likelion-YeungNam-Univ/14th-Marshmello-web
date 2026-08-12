import { Link } from "react-router-dom"

import { Card, CardContent } from "@/shared/components/ui/card"

type ContentCardProps = {
  id: string
  image: string
  title: string
  description: string
}

export function ContentCard({
  id,
  image,
  title,
  description,
}: ContentCardProps) {
  return (
    <Link
      aria-label={`${title} 상세 콘텐츠 보기`}
      className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
      to={`/contents/${id}`}
    >
      <Card className="h-[99px] rounded-none border-0 py-0 shadow-none ring-0 transition-colors duration-75 group-active:bg-muted/50">
        <CardContent className="flex h-full items-center gap-[17px] px-10 py-5">
          <img
            alt=""
            className="size-[60px] shrink-0 rounded-[10px] object-cover"
            src={image}
          />
          <div className="min-w-0 flex-1 self-start pt-1">
            <h3 className="line-clamp-1 text-[12px] leading-[1.4] font-medium tracking-[-0.02em]">
              {title}
            </h3>
            <p className="mt-[5px] line-clamp-2 text-[12px] leading-[1.4] font-light tracking-[-0.02em] text-[#484c52]">
              {description}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
