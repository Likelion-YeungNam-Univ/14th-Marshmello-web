import { useCallback, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { Outlet, useMatches, useNavigate, useParams } from "react-router-dom"

import { LogoutDrawer } from "@/features/auth/ui/logout-drawer"
import { CarePage } from "@/pages/care-page"
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
  const [isLogoutDrawerOpen, setIsLogoutDrawerOpen] = useState(false)
  const [showSplash, setShowSplash] = useState(true)
  const matches = useMatches()
  const navigate = useNavigate()
  const { checkInId: checkInIdParam } = useParams()
  const queryClient = useQueryClient()
  const parsedCheckInId = Number(checkInIdParam)
  const checkInId = Number.isInteger(parsedCheckInId)
    ? parsedCheckInId
    : undefined
  const restartSplash = useCallback(() => setShowSplash(true), [])
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
        onFinish={() => setShowSplash(false)}
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
          onLogout={() => setIsLogoutDrawerOpen(true)}
        >
          <Outlet context={{ restartSplash }} />
        </PageLayout>
      )}

      {isContentDetail ? (
        <PageLayout {...pageLayout}>
          <Outlet context={{ restartSplash }} />
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
