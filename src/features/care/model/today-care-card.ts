export type TodayCareCardData = {
  id: string
  title: string
  tip: string[]
  description: string[]
  source?: string
}

export const mockTodayCareCard: TodayCareCardData = {
  id: "daily-care-1",
  title: "오늘의 케어카드",
  tip: [
    "100% 순면 소재의 넉넉한 속옷과",
    "통풍이 잘 되는 옷을 입으세요",
  ],
  description: [
    "마찰 자극과 혈액순환 방해를 줄일 수 있다고 알려져 있습니다.",
    "이유이유이유 설명설명설명 블라블라블라",
    "어쩌구저쩌구 샬라샬라샬라 얄리얄리얄라셩",
  ],
  source: "BabyCenter",
}
