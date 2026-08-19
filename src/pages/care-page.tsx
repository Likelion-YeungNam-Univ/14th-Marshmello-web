import { useQuery } from "@tanstack/react-query"

import {
  getCareCard,
  getLatestCareCard,
} from "@/features/care/api/create-care-card"
import { ContentRecommendationSection } from "@/features/care/ui/content-recommendation-section"
import { MassageGuideButton } from "@/features/care/ui/massage-guide-button"
import { TodayCareCard } from "@/features/care/ui/today-care-card"
import { useProfileStore } from "@/features/mypage/model/use-profile-store"
import { Skeleton } from "@/shared/components/ui/skeleton"

type CarePageProps = {
  checkInId?: number
}

export function CarePage({ checkInId }: CarePageProps) {
  const nickname = useProfileStore((state) => state.name)
  const {
    data: careCard,
    isError,
    isPending,
  } = useQuery({
    queryKey: ["care-card", checkInId ?? "latest"],
    queryFn: () =>
      checkInId === undefined
        ? getLatestCareCard()
        : getCareCard(checkInId),
    retry: false,
  })

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-[393px] flex-col gap-[14px] overflow-x-hidden px-5 pt-4 pb-10">
      <p className="text-[17px] leading-[25.5px] tracking-[-0.01em] text-[#2a2c30]">
        <strong className="font-bold">{nickname}</strong>님, 오늘도{" "}
        <strong className="font-bold text-black">건강한 피부</strong>를
        <br />
        위한 하루 되세요 🌷
      </p>

      {isPending ? (
        <section aria-label="케어카드 불러오는 중" className="relative h-[398px] w-full">
          <Skeleton className="h-[430px] w-full rounded-[26px] bg-[#ffeefe]" />
        </section>
      ) : null}

      {isError ? (
        <p className="py-10 text-center text-[15px] text-[#6b6f76]" role="alert">
          케어카드를 불러오지 못했어요. 잠시 후 다시 시도해주세요.
        </p>
      ) : null}

      {!isError && careCard ? (
        <TodayCareCard
          card={{
            id: String(careCard.careCardId),
            title: careCard.actionName,
            description: careCard.actionReason,
            category: careCard.category,
            source: careCard.source,
            createdDate: careCard.createdDate,
          }}
        />
      ) : null}

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
