import { recommendationContents } from "@/features/care/model/recommendation-contents"
import { ContentCard } from "@/features/care/ui/content-card"

type ContentRecommendationSectionProps = {
  nickname: string
}

export function ContentRecommendationSection({
  nickname,
}: ContentRecommendationSectionProps) {
  return (
    <section aria-labelledby="content-recommendation-title" className="py-6">
      <h2
        className="px-10 text-[18px] leading-[1.4] font-semibold tracking-[-0.02em]"
        id="content-recommendation-title"
      >
        품결이 {nickname}에게 추천하는 콘텐츠
      </h2>
      <div className="mt-3">
        {recommendationContents.map((content) => (
          <ContentCard key={content.id} {...content} />
        ))}
      </div>
    </section>
  )
}
