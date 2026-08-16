import { apiClient } from "@/shared/api/axios"

{/*------------------------------------------------------------ */}

//# csrf-controller, /api/csrf

//## 요청보낼 양식 , x
//## 응답받는 양식 

export type csrfResponse = {
  token: string
  parameterName: string
  headerName: string
}

//## 요청 함수

// CSRF 토큰 조회
export async function getCsrfToken():
Promise<csrfResponse> {
  const url = "/api/csrf"

  const response =
    await apiClient.get<csrfResponse>(url)

  return response.data
}

//## API 실행 테스트 함수

export const handleGetCsrfToken = async () => {
  const csrfToken = await getCsrfToken()

  console.log("CSRF 토큰 조회 결과:", csrfToken)

  return csrfToken
}