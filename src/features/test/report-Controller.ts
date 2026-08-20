import { apiClient } from "@/shared/api/axios"

//# Report-Controller 부분 , /api/reports

//## 요청보낼 양식 
export type ReportRequest = {
  month: string
  //양식: YYYY-MM
}

//## 응답받는 양식 
export type ReportResponse = {
  reportId: number
  yearMonth: string
  content: string
}

//## 요청 함수
export async function getReport(
  month: string,
): Promise<ReportResponse> {
  const url = `/api/reports?month=${month}`

  //응답을 기다리는 비동기 작업
  const response =
    await apiClient.get<ReportResponse>(url)

  return response.data
}


export async function createReport(
  month: string,
): Promise<ReportResponse> {
  const url = `/api/reports?month=${month}`

  const response =
    await apiClient.post<ReportResponse>(url)

  return response.data
}

//## API 실행 테스트 함수


