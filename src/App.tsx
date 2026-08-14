import { useCallback, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { Outlet, useMatches, useNavigate } from "react-router-dom"

import { LogoutDrawer } from "@/features/auth/ui/logout-drawer"
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
  const queryClient = useQueryClient()
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
