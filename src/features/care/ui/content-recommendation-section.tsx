import { recommendationContents } from "@/features/care/model/recommendation-contents"
import { ContentCard } from "@/features/care/ui/content-card"

export function ContentRecommendationSection() {
  return (
    <section aria-labelledby="content-recommendation-title" className="mt-[31px]">
      <p className="px-[37px] text-[11px] leading-[1.4] tracking-[-0.02em] text-[#484c52]">
        여기저기 다른 말들, 뭐가 맞는지 헷갈린다면?
      </p>
      <h2
        className="mt-4 px-[34px] text-[12px] leading-[1.4] font-normal tracking-[-0.02em]"
        id="content-recommendation-title"
      >
        <span className="logo">품결</span>이 믿을 수 있는 정보만 모아봤어요
      </h2>
      <div>
        {recommendationContents.map((content) => (
          <ContentCard key={content.id} {...content} />
        ))}
      </div>
    </section>
  )
}
