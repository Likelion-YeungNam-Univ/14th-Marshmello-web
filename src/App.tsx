import { useCallback, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import {
  Outlet,
  useLocation,
  useMatches,
  useNavigate,
} from "react-router-dom"

import { LogoutDrawer } from "@/features/auth/logout/ui/logout-drawer"
import {
  PageLayout,
  type PageLayoutConfig,
} from "@/shared/components/layout/page-layout"
import SplashScreen from "@/shared/components/ui/splash-screen"

export type AppOutletContext = {
  restartSplash: () => void
}

type RouteHandle = {
  pageLayout?: PageLayoutConfig
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true)
  const [isLogoutDrawerOpen, setIsLogoutDrawerOpen] = useState(false)

  const { pathname } = useLocation()
  const matches = useMatches()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // 로그인 화면에서는 PageLayout 자체를 사용하지 않음
  const isLoginPage = pathname === "/login"

  // 기존 PageLayout 설정
  const pageLayout = matches.reduce<PageLayoutConfig | undefined>(
    (currentLayout, match) =>
      (match.handle as RouteHandle | undefined)?.pageLayout ?? currentLayout,
    undefined,
  )

  // Splash 재시작
  const restartSplash = useCallback(() => {
    setShowSplash(true)
  }, [])

  // 로그아웃
  const logout = useCallback(() => {
    queryClient.clear()
    window.sessionStorage.clear()

    setIsLogoutDrawerOpen(false)

    navigate("/", { replace: true })

    restartSplash()
  }, [navigate, queryClient, restartSplash])

  // Splash Screen
  if (showSplash) {
    return (
      <SplashScreen
        durationMs={5000}
        onFinish={() => setShowSplash(false)}
      />
    )
  }

  // 로그인 페이지
  // PageLayout / Header / Navbar 전부 거치지 않음
  if (isLoginPage) {
    return (
      <main className="min-h-dvh w-full">
        <Outlet context={{ restartSplash }} />
      </main>
    )
  }

  // 나머지 모든 페이지
  return (
    <>
      <PageLayout
        {...pageLayout}
        onLogout={() => setIsLogoutDrawerOpen(true)}
      >
        <Outlet context={{ restartSplash }} />
      </PageLayout>

      <LogoutDrawer
        onConfirm={logout}
        onOpenChange={setIsLogoutDrawerOpen}
        open={isLogoutDrawerOpen}
      />
    </>
  )
}