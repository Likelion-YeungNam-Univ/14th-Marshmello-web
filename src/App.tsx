import { useCallback, useState } from "react"
import { Outlet, useMatches } from "react-router-dom"

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
  const matches = useMatches()
  const restartSplash = useCallback(() => setShowSplash(true), [])
  const pageLayout = matches.reduce<PageLayoutConfig | undefined>(
    (currentLayout, match) =>
      (match.handle as RouteHandle | undefined)?.pageLayout ?? currentLayout,
    undefined,
  )

  if (showSplash) {
    return (
      <SplashScreen
        durationMs={5000}
        onFinish={() => setShowSplash(false)}
      />
    )
  }

  return (
    <PageLayout {...pageLayout}>
      <Outlet context={{ restartSplash }} />
    </PageLayout>
  )
}
