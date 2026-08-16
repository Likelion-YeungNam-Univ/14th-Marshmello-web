import { apiClient } from "@/shared/api/axios"

//# check-in-controller, /api/check-ins, /api/check-ins/emotions

//## 요청보낼 양식 
export type checkInRequest = {
  date: string
  //양식: YYYY-MM-DD
}

//## 응답받는 양식
export type checkInResponse = [
  {
    checkInId: number,
    imageId: number,
    checkInDate: string,
    achieved: boolean,
    emotion: number,
  }
]

export type bodyDiaryRequest = {
  bodyRegion?: number
  // 범위: 1~8

  stretchMark?: boolean

  comment?: string
  // 최대 50자
}


// POST /api/check-ins에서 보내는 JSON 양식
export type checkInCreateRequest = {
  imageId: number
  achieved?: boolean
  diary?: string
  // 최대 255자

  emotion?: number
  // 범위: 1~4

  bodyDiaries: bodyDiaryRequest[]
}

// POST /api/check-ins 응답 양식
export type checkInCreateResponse = {
  checkInId: number
  imageId: number
  achieved: boolean
  checkInDate: string
  diary: string
  emotion: number
  bodyDiaries: bodyDiaryResponse[]
}

export type bodyDiaryResponse = {
  bodyRegion: number
  stretchMark: boolean
  comment: string
}

// GET /api/check-ins/emotions 응답 항목
export type checkInEmotionResponse = {
  date: string
  emotion: number
}

//## 요청 함수

// 날짜를 이용해 체크인 목록 조회
export async function getCheckInsByDate(
  date: string,
): Promise<checkInResponse> {
  const url = `/api/check-ins?date=${date}`

  const response =
    await apiClient.get<checkInResponse>(url)

  return response.data
}

// 체크인 JSON을 백엔드로 보내서 새로운 체크인 생성
export async function createCheckIn(
  request: checkInCreateRequest,
): Promise<checkInCreateResponse> {
  const url = "/api/check-ins"

  const response =
    await apiClient.post<checkInCreateResponse>(
      url,
      request,
    )

  return response.data
}

// 해당 월의 감정 기록 조회
export async function getCheckInEmotions(
  month: string,
): Promise<checkInEmotionResponse> {
  const url =
    `/api/check-ins/emotions?month=${month}`

  const response =
    await apiClient.get<checkInEmotionResponse>(url)

  return response.data
}


//## API 실행 테스트 함수
