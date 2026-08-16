import { apiClient } from "@/shared/api/axios"

//# check-in-image-controller, /api/check-ins/images/analyze, api/check-ins/images/{imageId}/url

//## 요청보낼 양식

// POST 이미지 분석 파일 양식
export type analyzeImageRequest = {
  image: File
}

// GET 이미지 URL 조회 path 양식
export type getImageUrlRequest = {
  imageId: number
  // 0보다 큰 숫자
}

//## 응답받는 양식 

// POST 이미지 분석 응답
export type analyzeImageResponse = {
  detected: boolean
  imageId: number
}

// GET 이미지 URL 조회 응답
export type getImageUrlResponse = {
  imageId: number
  url: string
  expiresAt: string
  // 날짜와 시간이 포함된 문자열
}

//## 요청 함수

// 이미지 파일을 백엔드로 보내 분석
export async function analyzeCheckInImage(
  request: analyzeImageRequest,
): Promise<analyzeImageResponse> {
  const url = "/api/check-ins/images/analyze"

  const formData = new FormData()

  formData.append("image", request.image)

  const response =
    await apiClient.post<analyzeImageResponse>(
      url,
      formData,
    )

  return response.data
}

// imageId로 이미지 URL 조회
export async function getCheckInImageUrl(
  request: getImageUrlRequest,
): Promise<getImageUrlResponse> {
  const url =
    `/api/check-ins/images/${request.imageId}/url`

  const response =
    await apiClient.get<getImageUrlResponse>(url)

  return response.data
}

//## API 실행 테스트 함수

export const handleAnalyzeCheckInImage =
  async (image: File) => {
    const result = await analyzeCheckInImage({
      image,
    })

    console.log("이미지 분석 결과:", result)

    return result
  }

export const handleGetCheckInImageUrl =
  async (imageId: number) => {
    const result = await getCheckInImageUrl({
      imageId,
    })

    console.log("이미지 URL 조회 결과:", result)

    return result
  }
