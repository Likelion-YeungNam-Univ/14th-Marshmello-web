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
  const response = await fetch(`${API_BASE_URL}/api/csrf`, {
    method: "GET",
    credentials: "include",
  })

  if (!response.ok) {
    throw new Error(`CSRF 조회 실패: ${response.status}`)
  }

  return response.json()
}

/**
 * 현재 사용자 회원정보 조회
 *
 * 로그인하지 않은 상태에서는 401을 반환하므로
 * null로 처리한다.
 */
export async function getUserProfile(): Promise<UserProfile | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/user`, {
      method: "GET",
      credentials: "include",
    })

    if (response.status === 401) {
      return null
    }

    if (!response.ok) {
      throw new Error(`회원정보 조회 실패: ${response.status}`)
    }

    return response.json()
  } catch (error) {
    console.error("GET /api/user 실패:", error)
    return null
  }
}

/**
 * 회원정보 등록 / 수정
 *
 * GET /api/csrf
 * → PATCH /api/user
 */
export async function updateUserProfile(data: {
  nickname: string
  expectedDeliveryDate: string
}) {
  const csrf = await getCsrf()

  const response = await fetch(`${API_BASE_URL}/api/user`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      [csrf.headerName]: csrf.token,
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`회원정보 등록 실패: ${response.status}`)
  }

  return response.json()
}