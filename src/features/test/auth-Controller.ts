import { apiClient } from "@/shared/api/axios"

//# auth-controller, /api/me, /api/model-gate

//## 요청보낼 양식

// GET /api/me는 보낼 값이 없음

// GET /api/model-gate는 보낼 값이 없음


//## 응답받는 양식

// GET /api/me 응답 양식
export type authMeResponse = {
  authenticated: boolean

  protocol: "oidc" | "unknown"

  subject?: string
  // OIDC 사용자를 구분하는 고유 식별자

  email?: string | null

  emailVerified?: boolean | null
  // 이메일 인증 여부

  issuer?: string | null
  // OIDC 토큰 발급자 주소

  audience?: string[]
  // 토큰을 사용할 수 있는 대상

  authorities?: string[]
  // 현재 로그인 사용자에게 부여된 권한 목록
}

// GET /api/model-gate 응답 양식
export type modelGateResponse = {
  authorized: boolean

  message: string

  principal: string
  // 현재 로그인 사용자의 고유 식별자
}


//## 요청 함수

// 현재 로그인한 사용자 인증 정보 조회
export async function getAuthMe():
Promise<authMeResponse> {
  const url = "/api/me"

  const response =
    await apiClient.get<authMeResponse>(url)

  return response.data
}

// 모델 API 접근 권한 확인
export async function getModelGate():
Promise<modelGateResponse> {
  const url = "/api/model-gate"

  const response =
    await apiClient.get<modelGateResponse>(url)

  return response.data
}


//## API 실행 테스트 함수

// 현재 로그인한 사용자 인증 정보 테스트
export const handleGetAuthMe = async () => {
  const authMe = await getAuthMe()

  console.log(
    "현재 로그인 사용자 인증 정보:",
    authMe,
  )

  return authMe
}

// 모델 API 접근 권한 테스트
export const handleGetModelGate = async () => {
  const modelGate = await getModelGate()

  console.log(
    "모델 API 접근 권한 결과:",
    modelGate,
  )

  return modelGate
}