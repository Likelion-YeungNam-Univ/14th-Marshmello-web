import { useCallback, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { Outlet, useMatches, useNavigate, useParams } from "react-router-dom"

import { LogoutDrawer } from "@/features/auth/ui/logout-drawer"
import { CarePage } from "@/pages/care-page"
import {
  PageLayout,
  type PageLayoutConfig,
} from "@/shared/components/layout/page-layout"
import SplashScreen from "@/shared/components/ui/splash/splash-screen"

export type AppOutletContext = {
  restartSplash: () => void
  setHeaderBackAction: (action?: () => void) => void
}

type RouteHandle = {
  pageLayout?: PageLayoutConfig
}

// 같은 세션(탭)에서 스플래시를 이미 보여줬는지 기록하는 키.
// 새로고침하거나 /home, /care 등 다른 라우트로 이동해도 다시 뜨지 않도록 막아줌.
const SPLASH_SESSION_KEY = "poomgyeol:splash-shown"

function hasSplashAlreadyShown() {
  if (typeof window === "undefined") return false
  return window.sessionStorage.getItem(SPLASH_SESSION_KEY) === "1"
}

export default function App() {
  const [isLogoutDrawerOpen, setIsLogoutDrawerOpen] = useState(false)
  const [pageHeaderBackAction, setPageHeaderBackAction] = useState<
    (() => void) | undefined
  >()
  const [showSplash, setShowSplash] = useState(() => !hasSplashAlreadyShown())
  const matches = useMatches()
  const navigate = useNavigate()
  const { checkInId: checkInIdParam } = useParams()
  const queryClient = useQueryClient()
  const parsedCheckInId = Number(checkInIdParam)
  const checkInId = Number.isInteger(parsedCheckInId)
    ? parsedCheckInId
    : undefined
  const restartSplash = useCallback(() => {
    // 로그아웃 등 명시적으로 재진입 플로우를 태울 때만 스플래시를 다시 보여줌
    window.sessionStorage.removeItem(SPLASH_SESSION_KEY)
    setShowSplash(true)
  }, [])
  const setHeaderBackAction = useCallback((action?: () => void) => {
    setPageHeaderBackAction(() => action)
  }, [])
  const pageLayout = matches.reduce<PageLayoutConfig | undefined>(
    (currentLayout, match) =>
      (match.handle as RouteHandle | undefined)?.pageLayout ?? currentLayout,
    undefined,
  )
  const logout = useCallback(() => {
    queryClient.clear()
    window.sessionStorage.clear()
    setIsLogoutDrawerOpen(false)
    navigate("/", { replace: true })
    restartSplash()
  }, [navigate, queryClient, restartSplash])
  const isContentDetail = pageLayout?.variant === "content"
  const isCareFlow = isContentDetail || pageLayout?.variant === "care"

  if (showSplash) {
    return (
      <SplashScreen
        durationMs={5000}
        onFinish={() => {
          window.sessionStorage.setItem(SPLASH_SESSION_KEY, "1")
          setShowSplash(false)
        }}
      />
    )
  }

  return (
    <>
      {isCareFlow ? (
        <PageLayout
          onLogout={() => setIsLogoutDrawerOpen(true)}
          variant="care"
        >
          <CarePage checkInId={checkInId} />
        </PageLayout>
      ) : (
        <PageLayout
          {...pageLayout}
          header={
            pageHeaderBackAction
              ? { ...pageLayout?.header, onBack: pageHeaderBackAction }
              : pageLayout?.header
          }
          onLogout={() => setIsLogoutDrawerOpen(true)}
        >
          <Outlet context={{ restartSplash, setHeaderBackAction }} />
        </PageLayout>
      )}

      {isContentDetail ? (
        <PageLayout
          {...pageLayout}
          header={
            pageHeaderBackAction
              ? { ...pageLayout?.header, onBack: pageHeaderBackAction }
              : pageLayout?.header
          }
        >
          <Outlet context={{ restartSplash, setHeaderBackAction }} />
        </PageLayout>
      ) : null}

      <LogoutDrawer
        onConfirm={logout}
        onOpenChange={setIsLogoutDrawerOpen}
        open={isLogoutDrawerOpen}
      />
    </>
  )
}
