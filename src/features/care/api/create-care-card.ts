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

export async function createCareCard(
  checkInId: number,
): Promise<CareCardResponse> {
  const response = await apiClient.post<CareCardResponse>(
    `/api/check-ins/${checkInId}/care-card`,
  )

  return response.data
}
