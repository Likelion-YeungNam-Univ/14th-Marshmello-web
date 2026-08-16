import { apiClient } from "@/shared/api/axios"

export type ReportMonthQuery = {
  month: string
}

export type ReportResponse = {
  reportId: number
  yearMonth: string
  content: string
}

const REPORTS_PATH = "/api/reports"

// GET /api/reports?month=YYYY-MM
export async function getReport({
  month,
}: ReportMonthQuery): Promise<ReportResponse> {
  const response = await apiClient.get<ReportResponse>(REPORTS_PATH, {
    params: { month },
  })

  return response.data
}

// POST /api/reports?month=YYYY-MM
// Swagger 명세에는 JSON 요청 본문이 없으므로 두 번째 인자는 undefined로 둔다.
export async function createReport({
  month,
}: ReportMonthQuery): Promise<ReportResponse> {
  const response = await apiClient.post<ReportResponse>(
    REPORTS_PATH,
    undefined,
    {
      params: { month },
    },
  )

  return response.data
}
