import { mockTodayCareCard } from "@/features/care/model/today-care-card"
import { ContentRecommendationSection } from "@/features/care/ui/content-recommendation-section"
import { MassageGuideButton } from "@/features/care/ui/massage-guide-button"
import { TodayCareCard } from "@/features/care/ui/today-care-card"
import { useProfileStore } from "@/features/mypage/model/use-profile-store"

export function CarePage() {
  const nickname = useProfileStore((state) => state.name)

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-[393px] flex-col gap-[14px] overflow-x-hidden px-5 pt-4 pb-10">
      <p className="text-[17px] leading-[25.5px] tracking-[-0.01em] text-[#2a2c30]">
        <strong className="font-bold">{nickname}</strong>님, 오늘도{" "}
        <strong className="font-bold text-black">건강한 피부</strong>를
        <br />
        위한 하루 되세요 🌷
      </p>

      <TodayCareCard card={mockTodayCareCard} />

      <section aria-labelledby="massage-guide-title" className="w-full pt-12">
        <p
          className="text-[15px] leading-[20.625px] tracking-[-0.01em] text-[#3c3d3f]"
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
