import { ContentRecommendationSection } from "@/features/care/ui/content-recommendation-section"

export function CarePage() {
  return (
    <main className="mx-auto min-h-svh w-full max-w-[393px] bg-background">
      <ContentRecommendationSection nickname="회원님" />
    </main>
  )
}
