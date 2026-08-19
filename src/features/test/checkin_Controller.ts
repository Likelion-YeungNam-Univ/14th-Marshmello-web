import { apiClient } from "@/shared/api/axios"

//# check-in-controller, /api/check-ins, /api/check-ins/emotions

//## 요청보낼 양식 


export type checkInRequest = {
  date: string
  //양식: YYYY-MM-DD
}

//GET 요청 /api/check-ins/count , /api/check-ins/body-diaries/top-region
export type checkinCountRequest = {
  month: string,
  //YYYY-MM
}

//## 응답받는 양식

//GET /api/check-ins 응답
export type checkInResponse = [
  {
    checkInId: number,
    imageId: number,
    achieved: boolean,
    checkInDate: string,
    diary: string,
    emotion: number,
    bodyDiaries: bodyDiaryRequest[]
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

// GET /api/check-ins/count 응답 항목
export type checkInCountResponse = {
  requestMonth: string
  count: number
  achievedCount: number
}

// GET /api/check-ins/body-diraries/top-region 응답 항목
export type checkInRegion = {
  bodyRegion: number | null
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
  date: string,
  request: checkInCreateRequest,
): Promise<checkInCreateResponse> {
  const url = "/api/check-ins"

  const response =
    await apiClient.post<checkInCreateResponse>(
      url,
      request,
      {
        params: {
          date,
        },
      },  
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

//체크인 한 횟수
export async function getcheckInCount(
  month: string,
) : Promise<checkInCountResponse> {
  const url = 
    `/api/check-ins/count?month=${month}`

  const response =
    await apiClient.get<checkInCountResponse>(url)

  return response.data
}

//그 달에 가장 많이 불편함을 호소한 부위
export async function getcheckInRegion(
  month: string,
) : Promise<checkInRegion> {
  const url = 
    `/api/check-ins/body-diaries/top-region?month=${month}`

  const response =
    await apiClient.get<checkInRegion>(url)

  return response.data
}

//## API 실행 테스트 함수

// GET /api/check-ins 테스트
export const handleGetCheckInsByDate =
  async (date: string) => {
    const result =
      await getCheckInsByDate(date)

    console.log(
      "체크인 목록 조회 결과:",
      result,
    )

    return result
  }

// POST /api/check-ins 테스트
export const handleCreateCheckIn =
  async (date: string, request: checkInCreateRequest) => {
    const result =
      await createCheckIn(date, request)

    console.log(
      "체크인 생성 결과:",
      result,
    )

    return result
  }

// GET /api/check-ins/emotions 테스트
export const handleGetCheckInEmotions =
  async (month: string) => {
    const result =
      await getCheckInEmotions(month)

    console.log(
      "감정 기록 조회 결과:",
      result,
    )

    return result
  }
