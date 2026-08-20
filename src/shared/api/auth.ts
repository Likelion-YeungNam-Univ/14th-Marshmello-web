import { apiClient, clearCsrfToken, saveCsrfToken } from "./axios"
import  axios  from "axios"
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export type CsrfResponse = {
  token: string
  parameterName: string
  headerName: string
}

export type UserProfile = {
  nickname: string
  expectedDeliveryDate: string
  profileCompleted: boolean
}

export type UpdateUserProfileRequest = {
  nickname: string
  expectedDeliveryDate: string
}

/**
 * CSRF 토큰 조회
 */
export async function getCsrf(): Promise<CsrfResponse> {
  const response = 
    await apiClient.get<CsrfResponse>("/api/csrf")

    //csrf토큰 받아서 axios 공통 저장소에 저장
    saveCsrfToken(
      response.data.token,
      response.data.headerName,
    )
  return response.data
}

/**
 * 현재 사용자 회원정보 조회
 *
 * 로그인하지 않은 상태에서는 401을 반환하므로
 * null로 처리한다.
 */
export async function getUserProfile():
Promise<UserProfile | null> {
  try {
    const response = await apiClient.get<UserProfile>("/api/user")

    return response.data
  } 
  catch (error) {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401
    ) {
      return null
    }

    console.error("GET /api/user 실패:", error)
    throw error
  }  
}

/**
 * 회원정보 등록 / 수정
 * csrf 토큰 조회 (axios 저장소에서 가져옴)
 */
export async function updateUserProfile(
  data: UpdateUserProfileRequest,
): Promise<UserProfile> {
  const response = await apiClient.patch<UserProfile>(
    "/api/user", //url
    data, 
  )

  return response.data
}

/**
 * 현재 사용자 계정을 탈퇴 처리합니다.
 */
export async function withdrawUser(): Promise<void> {
  const csrf = await getCsrf()
  const response = await apiClient.delete("/api/user", {
    headers: {
      [csrf.headerName]: csrf.token,
    },
  })

  if (response.status !== 204) {
    throw new Error(`회원 탈퇴 실패: ${response.status}`)
  }

  clearCsrfToken()
}

/**
 * 현재 로그인 세션을 종료합니다.
 */
export async function logout(): Promise<void> {
  const csrf = await getCsrf()
  const response = await apiClient.post("/logout", null, {
    headers: {
      [csrf.headerName]: csrf.token,
    },
  })

  if (response.status !== 204) {
    throw new Error(`로그아웃 실패: ${response.status}`)
  }

  clearCsrfToken()
}
