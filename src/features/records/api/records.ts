const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export type CheckInCountResponse = {
  requestMonth: string
  count: number
  achievedCount: number
}

export type EmotionByDate = {
  date: string
  emotion: number
}

export type TopBodyRegionResponse = {
  bodyRegion: number
}

export type ReportResponse = {
  reportId: number
  yearMonth: string
  content: string
}

/**
 * 현재 월의 체크인 수 / 성취 수 조회
 */
export async function getCheckInCount(
  month: string,
): Promise<CheckInCountResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/check-ins/count?month=${encodeURIComponent(month)}`,
    {
      method: "GET",
      credentials: "include",
    },
  )

  if (!response.ok) {
    throw new Error(`체크인 수 조회 실패: ${response.status}`)
  }

  return response.json()
}

/**
 * 날짜별 감정 조회
 */
export async function getEmotionsByMonth(
  month: string,
): Promise<EmotionByDate[]> {
  const response = await fetch(
    `${API_BASE_URL}/api/check-ins/emotions?month=${encodeURIComponent(month)}`,
    {
      method: "GET",
      credentials: "include",
    },
  )

  if (!response.ok) {
    throw new Error(`날짜별 감정 조회 실패: ${response.status}`)
  }

  return response.json()
}

/**
 * 가장 많이 기록된 신체 부위 조회
 */
export async function getTopBodyRegion(
  month: string,
): Promise<TopBodyRegionResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/check-ins/body-diaries/top-region?month=${encodeURIComponent(month)}`,
    {
      method: "GET",
      credentials: "include",
    },
  )

  if (!response.ok) {
    throw new Error(`대표 신체 부위 조회 실패: ${response.status}`)
  }

  return response.json()
}

/**
 * 이전 달 리포트 생성
 */
export async function createReport(
  month: string,
): Promise<ReportResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/report?month=${encodeURIComponent(month)}`,
    {
      method: "POST",
      credentials: "include",
    },
  )

  if (!response.ok) {
    throw new Error(`리포트 생성 실패: ${response.status}`)
  }

  return response.json()
}

/**
 * 이전 달 리포트 조회
 */
export async function getReport(
  month: string,
): Promise<ReportResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/report?month=${encodeURIComponent(month)}`,
    {
      method: "GET",
      credentials: "include",
    },
  )

  if (!response.ok) {
    throw new Error(`리포트 조회 실패: ${response.status}`)
  }

  return response.json()
}

/**
 * YYYY-MM 형식의 연월에서 이전 달 계산
 *
 * 예:
 * 2026-08 → 2026-07
 * 2026-01 → 2025-12
 */
export function getPreviousMonth(yearMonth: string): string {
  const [year, month] = yearMonth.split("-").map(Number)

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    month < 1 ||
    month > 12
  ) {
    throw new Error(`잘못된 연월 형식입니다: ${yearMonth}`)
  }

  const previousMonth = month === 1 ? 12 : month - 1
  const previousYear = month === 1 ? year - 1 : year

  return `${previousYear}-${String(previousMonth).padStart(2, "0")}`
}