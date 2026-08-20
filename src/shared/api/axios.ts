import axios from "axios"

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// 현재 로그인 세션에서 사용할 CSRF 정보
let csrfToken: string | null = null
let csrfHeaderName = "X-CSRF-TOKEN"

// /api/csrf에서 받은 토큰 저장
export function saveCsrfToken(
  token: string,
  headerName: string,
) {
  csrfToken = token
  csrfHeaderName = headerName
}

// 로그아웃 또는 세션 만료 시 토큰 제거
export function clearCsrfToken() {
  csrfToken = null
  csrfHeaderName = "X-CSRF-TOKEN"
}

// 요청을 보내기 직전에 실행되는 공통 처리
apiClient.interceptors.request.use((config) => {
  const method =
    config.method?.toLowerCase()

  const requiresCsrf =
    method === "post" ||
    method === "put" ||
    method === "patch" ||
    method === "delete"

  // 변경 요청이면 저장된 CSRF 토큰을 자동으로 헤더에 추가
  if (requiresCsrf && csrfToken) {
    config.headers.set(
      csrfHeaderName,
      csrfToken,
    )
  }

  return config
})