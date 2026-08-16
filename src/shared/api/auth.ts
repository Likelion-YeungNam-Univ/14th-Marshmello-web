const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

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

export async function getCsrf() {
  const response = await fetch(`${API_BASE_URL}/api/csrf`, {
    method: "GET",
    credentials: "include",
  })

  if (!response.ok) {
    throw new Error("CSRF 요청 실패")
  }

  return response.json()
}