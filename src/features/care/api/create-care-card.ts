import { apiClient } from "@/shared/api/axios"

export interface CareCardResponse {
  careCardId: number
  checkInId: number
  actionName: string
  actionReason: string
  category: string
  source: string
  createdDate: string
}

// TODO(Care Card API): 체크인 완료 뒤 생성된 케어카드를 조회할 때 사용합니다.
// 홈 화면에서는 actionName을 완료 카드의 제목으로 표시하도록 연결할 예정입니다.
// 실제 호출은 checkInId를 확보한 뒤 Query 훅 등에서 실행합니다.
export async function getCareCard(
  checkInId: number,
): Promise<CareCardResponse> {
  const response = await apiClient.get<CareCardResponse>(
    `/api/check-ins/${checkInId}/care-card`,
  )

  return response.data
}

// TODO(Care Card API): 현재 서버 생성 API 명세를 확인한 뒤 유지하거나 제거합니다.
export async function createCareCard(
  checkInId: number,
): Promise<CareCardResponse> {
  const response = await apiClient.post<CareCardResponse>(
    `/api/check-ins/${checkInId}/care-card`,
  )

  return response.data
}
