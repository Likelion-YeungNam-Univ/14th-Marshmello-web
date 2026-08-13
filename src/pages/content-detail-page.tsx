import { useEffect } from "react"
import { X } from "lucide-react"
import { Link, useParams } from "react-router-dom"

import { recommendationContents } from "@/features/care/model/recommendation-contents"

function CloseContentButton() {
  return (
    <Link
      aria-label="콘텐츠 닫기"
      className="absolute top-3 right-3 flex size-10 items-center justify-center rounded-full text-[#484c52] transition-colors hover:bg-muted active:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      to="/care"
    >
      <X aria-hidden="true" className="size-6" />
    </Link>
  )
}

export function ContentDetailPage() {
  const { contentId } = useParams<{ contentId: string }>()
  const content = recommendationContents.find(({ id }) => id === contentId)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [contentId])

  if (!content) {
    return (
      <main className="mx-auto min-h-svh w-full max-w-[393px] bg-[#f5f6f7] p-4">
        <article className="relative rounded-[24px] bg-white px-6 pt-16 pb-8 shadow-[0_8px_24px_rgba(2,20,51,0.08)]">
          <CloseContentButton />
          <h1 className="text-xl font-semibold">콘텐츠를 찾을 수 없습니다.</h1>
          <Link className="mt-6 inline-block text-sm underline" to="/care">
            케어 화면으로 돌아가기
          </Link>
        </article>
      </main>
    )
  }

  return (
    <main className="mx-auto min-h-svh w-full max-w-[393px] bg-[#f5f6f7] p-4">
      <article className="relative rounded-[24px] bg-white px-6 pt-16 pb-8 shadow-[0_8px_24px_rgba(2,20,51,0.08)]">
        <CloseContentButton />
        <img
          alt=""
          className="aspect-video w-full rounded-[10px] object-cover"
          src={content.image}
        />
        <h1 className="mt-6 text-xl leading-snug font-semibold">
          {content.title}
        </h1>
        <div className="mt-3 space-y-4 text-sm leading-6 text-[#484c52]">
          {content.content.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        {content.source ? (
          <p className="mt-6 text-xs leading-5 font-medium text-muted-foreground">
            출처: {content.source}
          </p>
        ) : null}
      </article>
    </main>
  )
}
