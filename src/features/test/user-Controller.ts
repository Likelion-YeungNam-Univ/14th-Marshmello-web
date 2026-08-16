import { apiClient } from "@/shared/api/axios"


{/*------------------------------------------------------------ */}

//# user-controller, /api/user

//## 요청보낼 양식 

// GET /api/user는 보낼 값이 없음

// PATCH /api/user에서 보내는 JSON 양식
export type updateUserProfileRequest = {
  nickname: string
  // 최소 2자, 최대 15자

  expectedDeliveryDate?: string
  // 양식: YYYY-MM-DD
}

//## 응답받는 양식

// GET 사용자 정보 조회 응답
export type getUserProfileResponse = {
  nickname: string
  expectedDeliveryDate: string
  profileCompleted: boolean
}

// PATCH 사용자 정보 수정 응답
export type updateUserProfileResponse = {
  nickname: string
  expectedDeliveryDate: string
  //YYYY-MM-DD
  profileCompleted: boolean
}

//## 요청 함수

// 현재 로그인한 사용자 정보 조회
export async function getUserProfile():
Promise<getUserProfileResponse> {
  const url = "/api/user"

  const response =
    await apiClient.get<getUserProfileResponse>(
      url,
    )

  return response.data
}

// 사용자 정보 수정
export async function updateUserProfile(
  request: updateUserProfileRequest,
): Promise<updateUserProfileResponse> {
  const url = "/api/user"

  const response =
    await apiClient.patch<updateUserProfileResponse>(
      url,
      request,
    )

  return response.data
}

//## API 실행 테스트 함수

export const handleGetUserProfile = async () => {
  const profile = await getUserProfile()

  console.log("사용자 정보 조회 결과:", profile)

  return profile
}

export const handleUpdateUserProfile =
  async () => {
    const profile = await updateUserProfile({
      nickname: "테스트닉네임",
      expectedDeliveryDate: "2026-12-31",
    })

    console.log("사용자 정보 수정 결과:", profile)

    return profile
  }