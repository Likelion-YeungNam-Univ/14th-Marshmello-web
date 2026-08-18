export type MockCareCard = {
  actionName: string
}

// Care Card API 연동 전, 체크인 완료 상태의 안내 문구를 확인하기 위한 임시 데이터입니다.
export const mockCareCard: MockCareCard = {
  actionName: "100% 순면 소재의 넉넉한 속옷과 통풍이 잘 되는 옷을 입으세요.",
}

// Care Card API 연동 전 스켈레톤 UI를 확인하기 위한 임시 조회 함수입니다.
export async function getMockCareCard(): Promise<MockCareCard> {
  await new Promise((resolve) => window.setTimeout(resolve, 1500))

  return mockCareCard
}
