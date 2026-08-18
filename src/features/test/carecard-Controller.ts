import { apiClient } from "@/shared/api/axios"

{/*------------------------------------------------------------ */}

//# care-card-controller, /api/check-ins/{checkInId}/care-card, /api/care-cards/{careCardId}/feedback


//## 요청보낼 양식 

// GET 케어카드 조회 path 양식 , POST 케어카드 생성 path 양식
export type getCareCardRequest = {
  checkInId: number
  // 0보다 큰 숫자
}

// PATCH 피드백 수정 path 양식
export type careCardFeedbackPathRequest = {
  careCardId: number
  // 0보다 큰 숫자
}

// PATCH 피드백 수정 JSON 양식
export type careCardFeedbackRequest = {
  helpfulnessScore?: number
  // 범위: 1~5
}
//## 응답받는 양식

// GET 케어카드 조회 응답
export type getCareCardResponse = {
  careCardId: number
  checkInId: number
  actionName: string
  actionReason: string
  category: string
  source: string
  createdDate: string
}

// POST 케어카드 생성 응답
export type createCareCardResponse = {
  careCardId: number
  checkInId: number
  actionName: string
  actionReason: string
  category: string
  source: string
  createdDate: string
}

//## 요청 함수

// checkInId로 케어카드 조회
export async function getCareCard(
  request: getCareCardRequest,
): Promise<getCareCardResponse> {
  const url =
    `/api/check-ins/${request.checkInId}/care-card`

  const response =
    await apiClient.get<getCareCardResponse>(url)

  return response.data
}

// checkInId로 케어카드 생성
export async function createCareCard(
  request: getCareCardRequest,
): Promise<createCareCardResponse> {
  const url =
    `/api/check-ins/${request.checkInId}/care-card`

  const response =
    await apiClient.post<createCareCardResponse>(
      url,
    )

  return response.data
}

// careCardId로 케어카드 피드백 수정
export async function updateCareCardFeedback(
  pathRequest: careCardFeedbackPathRequest,
  bodyRequest: careCardFeedbackRequest,
): Promise<void> {
  const url =
    `/api/care-cards/${pathRequest.careCardId}/feedback`

  const response =
    await apiClient.patch<void>(
      url,
      bodyRequest,
    )

  return response.data
}

//최근에 케어카드를 받은 날짜
export async function getCareCardLatest(): Promise<createCareCardResponse> {
  const url = "/api/care-cards/latest"

  const response =
    await apiClient.get<createCareCardResponse>(url)

  return response.data
}

//## API 실행 테스트 함수

export const handleGetCareCard = async (checkInId: number,) => {
  const careCard = await getCareCard({
    checkInId,
  })

  console.log("케어카드 조회 결과:", careCard)

  return careCard
}

export const handleCreateCareCard = async (checkInId: number,) => {
  const careCard = await createCareCard({
    checkInId,
  })

  console.log("케어카드 생성 결과:", careCard)

  return careCard
}

export const handleUpdateCareCardFeedback = async (careCardId: number) => {
    await updateCareCardFeedback(
      {
        careCardId,
      },
      {
        helpfulnessScore: 5,
      },
    )

    console.log("케어카드 피드백 수정 성공")
  }