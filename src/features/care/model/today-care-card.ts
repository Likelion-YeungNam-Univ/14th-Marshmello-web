export type TodayCareCardData = {
  id: string
  title: string
  description: string
  category?: string
  source?: string
  createdDate?: string
}

export const mockTodayCareCard: TodayCareCardData = {
  id: "daily-care-1",
  title: "100% 순면 소재의 넉넉한 속옷과 통풍이 잘 되는 옷을 입으세요",
  description:
    "마찰과 땀은 피부를 자극하고 예민하게 만들 수 있다고 알려져 있어요. 순면 소재는 통기성이 좋고 흡수력이 뛰어나 습기를 빠르게 배출하고, 넉넉한 핏은 피부에 닿는 마찰 자체를 줄여줘요.",
  source: "Babycenter",
}
