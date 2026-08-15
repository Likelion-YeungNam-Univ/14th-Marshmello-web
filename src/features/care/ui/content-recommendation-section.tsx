import { recommendationContents } from "@/features/care/model/recommendation-contents"
import { ContentCard } from "@/features/care/ui/content-card"

export function ContentRecommendationSection() {
  return (
    <section
      aria-labelledby="content-recommendation-title"
      className="w-full pt-3.5"
    >
      <p className="text-[15px] leading-[20.625px] tracking-[-0.01em] text-[#3c3d3f]">
        여기저기 다른 말들, 뭐가 맞는지 헷갈린다면?
      </p>
      <h2
        className="mt-3 h-[35px] text-[15px] leading-[22.5px] tracking-[-0.01em] text-[#2a2c30]"
        id="content-recommendation-title"
      >
        <span className="logo mr-0.5 text-[18px]">품결</span>이 믿을 수 있는 정보만
        모아봤어요
      </h2>

      <div className="mt-3 h-[274px] overflow-hidden rounded-[16px] border border-white/70 bg-[#fcf6fb] shadow-[0px_10px_30px_-16px_rgba(120,70,120,0.45)]">
        {recommendationContents.map((content, index) => (
          <ContentCard
            {...content}
            isLast={index === recommendationContents.length - 1}
            key={content.id}
          />
        ))}
      </div>
    </section>
  )
}
