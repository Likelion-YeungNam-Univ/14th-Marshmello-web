const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

type CsrfResponse = {
  token: string
  parameterName: string
  headerName: string
}

export async function getMe() {
  const response = await fetch(`${API_BASE_URL}/api/me`, {
    method: "GET",
    credentials: "include",
  })

  if (!response.ok) {
    return null
  }
  const contentType = response.headers.get("content-type") ?? ""

  if (!contentType.includes("application/json")) {
    return null
  }

  return response.json()
}

export async function getUserProfile() {
  const response = await fetch(`${API_BASE_URL}/api/user`, {
    method: "GET",
    credentials: "include",
  })

  if (!response.ok) {
    throw new Error(`회원정보 조회 실패: ${response.status}`)
  }

  return response.json()
}

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