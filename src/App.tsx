import { useCallback, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import {
  Outlet,
  useLocation,
  useMatches,
  useNavigate,
  useParams,
} from "react-router-dom"

import { LogoutDrawer } from "@/features/auth/logout/ui/logout-drawer"
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

  const { pathname } = useLocation()
  const matches = useMatches()
  const navigate = useNavigate()
  const { checkInId: checkInIdParam } = useParams()
  const queryClient = useQueryClient()

  // 로그인 화면에서는 PageLayout을 사용하지 않음
  const isLoginPage = pathname === "/login"

  const parsedCheckInId = Number(checkInIdParam)
  const checkInId = Number.isInteger(parsedCheckInId)
    ? parsedCheckInId
    : undefined

  const restartSplash = useCallback(() => {
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

  // 로그아웃
  const logout = useCallback(() => {
    queryClient.clear()
    window.sessionStorage.clear()

    setIsLogoutDrawerOpen(false)

    navigate("/", { replace: true })

    restartSplash()
  }, [navigate, queryClient, restartSplash])

  const isContentDetail = pageLayout?.variant === "content"
  const isCareFlow = isContentDetail || pageLayout?.variant === "care"

  // Splash Screen
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

  // 로그인 페이지
  // PageLayout / Header / Navbar 전부 사용하지 않음
  if (isLoginPage) {
    return (
      <main className="min-h-dvh w-full">
        <Outlet context={{ restartSplash, setHeaderBackAction }} />
      </main>
    )
  }

  // 나머지 페이지
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
              ? {
                  ...pageLayout?.header,
                  onBack: pageHeaderBackAction,
                }
              : pageLayout?.header
          }
          onLogout={() => setIsLogoutDrawerOpen(true)}
        >
          <Outlet context={{ restartSplash, setHeaderBackAction }} />
        </PageLayout>
      )}

      <LogoutDrawer
        onConfirm={logout}
        onOpenChange={setIsLogoutDrawerOpen}
        open={isLogoutDrawerOpen}
      />
    </>
  )
}