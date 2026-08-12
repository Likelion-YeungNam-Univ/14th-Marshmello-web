import { Link, useParams } from "react-router-dom"

import { recommendationContents } from "@/features/care/model/recommendation-contents"

export function ContentDetailPage() {
  const { contentId } = useParams<{ contentId: string }>()
  const content = recommendationContents.find(({ id }) => id === contentId)

  if (!content) {
    return (
      <main className="mx-auto min-h-svh w-full max-w-[393px] px-10 py-12">
        <h1 className="text-xl font-semibold">콘텐츠를 찾을 수 없습니다.</h1>
        <Link className="mt-6 inline-block text-sm underline" to="/care">
          케어 화면으로 돌아가기
        </Link>
      </main>
    )
  }

  return (
    <main className="mx-auto min-h-svh w-full max-w-[393px] px-10 py-8">
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
    </main>
  )
}
