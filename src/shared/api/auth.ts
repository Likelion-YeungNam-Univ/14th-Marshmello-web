import { apiClient, saveCsrfToken } from "./axios"
import  axios  from "axios"
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export type CsrfResponse = {
  token: string
  parameterName: string
  headerName: string
}

export type UserProfile = {
  nickname: string | null
  expectedDeliveryDate: string | null
  profileCompleted: boolean
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
export async function updateUserProfile(data: {
  nickname: string
  expectedDeliveryDate: string
}) {
  const response = await apiClient.patch<UserProfile>(
    "/api/user", //url
    data, 
  )

  return response.data
}