import { apiClient, saveCsrfToken } from "@/shared/api/axios"

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

  const csrf = response.data
  
  saveCsrfToken(
    csrf.token,
    csrf.headerName,
  )

  return csrf
}

//## API 실행 테스트 함수

export const handleGetCsrfToken = async () => {
  const csrfToken = await getCsrfToken()

  console.log("CSRF 토큰 조회 결과:", csrfToken)

  return csrfToken
}