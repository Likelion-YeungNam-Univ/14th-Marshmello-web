import { apiClient } from "@/shared/api/axios"


{/*------------------------------------------------------------ */}

//# token-status-controller, /api/token-status

//## 요청보낼 양식 , x
//## 응답받는 양식 

// Swagger에 내부 속성이 정해져 있지 않은 객체로 표시됨
export type tokenStatusResponse = {
  [key: string]: unknown
}


//## 요청 함수

// 현재 토큰 상태 조회
export async function getTokenStatus():
Promise<tokenStatusResponse> {
  const url = "/api/token-status"

  const response =
    await apiClient.get<tokenStatusResponse>(url)

  return response.data
}

//## API 실행 테스트 함수

export const handleGetTokenStatus = async () => {
  const tokenStatus = await getTokenStatus()

  console.log("토큰 상태 조회 결과:", tokenStatus)

  return tokenStatus
}