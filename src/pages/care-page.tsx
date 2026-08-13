import { mockTodayCareCard } from "@/features/care/model/today-care-card"
import { ContentRecommendationSection } from "@/features/care/ui/content-recommendation-section"
import { MassageGuideButton } from "@/features/care/ui/massage-guide-button"
import { TodayCareCard } from "@/features/care/ui/today-care-card"

export function CarePage() {
  return (
    <main className="mx-auto min-h-svh w-full max-w-[393px] overflow-hidden bg-background pt-8">
      <TodayCareCard card={mockTodayCareCard} />

      <section aria-labelledby="massage-guide-title" className="mt-8">
        <p
          className="px-[37px] text-[11px] leading-[1.4] tracking-[-0.02em] text-[#484c52]"
          id="massage-guide-title"
        >
          꾸준히 추천되는 마사지, 제대로 따라 하고 싶다면?
        </p>
        <MassageGuideButton />
      </section>

      <ContentRecommendationSection />
    </main>
  )
}
