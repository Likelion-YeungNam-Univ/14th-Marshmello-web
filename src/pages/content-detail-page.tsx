import { useLayoutEffect, useRef } from "react"
import { ChevronLeft } from "lucide-react"
import { Link, useParams } from "react-router-dom"

import { recommendationContents } from "@/features/care/model/recommendation-contents"
import { ScrollArea } from "@/shared/components/ui/scroll-area"

const articleCategoryById: Record<string, string> = {
  "1": "튼살 이야기",
  "2": "보습 이야기",
  "3": "튼살 이야기",
}

function BackButton() {
  return (
    <Link
      aria-label="케어카드로 돌아가기"
      className="flex size-9 items-center justify-center rounded-full transition-colors hover:bg-black/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:bg-black/[0.05]"
      to="/care"
    >
      <ChevronLeft aria-hidden="true" className="size-[22px]" strokeWidth={1.8} />
    </Link>
  )
}

export function ContentDetailPage() {
  const { contentId } = useParams<{ contentId: string }>()
  const content = recommendationContents.find(({ id }) => id === contentId)
  const articleViewportRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
    articleViewportRef.current?.scrollTo(0, 0)
  }, [contentId])

  if (!content) {
    return (
      <div className="article-page-push fixed inset-0 z-50 mx-auto h-dvh w-full max-w-[393px] bg-white">
        <ScrollArea
          aria-label="Article content"
          className="size-full"
          viewportRef={articleViewportRef}
        >
        <header className="flex h-[52px] items-center border-b border-black/5 px-3">
          <BackButton />
        </header>
        <section className="px-6 py-10">
          <h1 className="text-[24px] leading-[29.4px] font-semibold text-[#2a2c30]">
            콘텐츠를 찾을 수 없어요.
          </h1>
        </section>
        </ScrollArea>
      </div>
    )
  }

  return (
    <div className="article-page-push fixed inset-0 z-50 mx-auto h-dvh w-full max-w-[393px] bg-white">
      <ScrollArea
        aria-label="Article content"
        className="size-full"
        viewportRef={articleViewportRef}
      >
      <header className="flex h-[52px] items-center border-b border-black/5 px-3">
        <BackButton />
      </header>

      <article>
        <div className="relative h-[208px] w-full overflow-hidden">
          <img
            alt=""
            className="size-full object-cover"
            src={content.image}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"
          />
          <span className="absolute bottom-[11px] left-4 rounded-full bg-white/90 px-2.5 py-1 text-[11px] leading-[16.5px] font-medium tracking-[-0.01em] text-[#f19ed2]">
            {articleCategoryById[content.id] ?? "피부 이야기"}
          </span>
        </div>

        <div className="bg-[#fdf2f8]/[0.32] px-6 pt-5 pb-6">
          <h1 className="text-[24px] leading-[29.4px] font-semibold tracking-[-0.01em] text-[#2a2c30]">
            {content.title}
          </h1>

          <div
            aria-hidden="true"
            className="mt-5 h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent"
          />

          <div className="mt-5 space-y-4 text-[16px] leading-[27.75px] tracking-[-0.01em] text-[#6b6f76]">
            {content.content.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          {content.source ? (
            <p className="mt-6 text-[16px] leading-[18px] tracking-[-0.01em] text-[#6b6f76]/70">
              출처: {content.source}
            </p>
          ) : null}
        </div>
      </article>
      </ScrollArea>
    </div>
  )
}
