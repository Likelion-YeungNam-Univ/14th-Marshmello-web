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

//Outlet으로 렌더링되는 자식 페이지에 전달할 공통 함수 타입
export type AppOutletContext = {
  restartSplash: () => void
  setHeaderBackAction: (action?: () => void) => void
}

type RouteHandle = {
  pageLayout?: PageLayoutConfig
}

export default function App() {
  // 로그아웃 창, 헤더 뒤로가기 동작, 스플래시 표시 여부 관리
  const [isLogoutDrawerOpen, setIsLogoutDrawerOpen] = useState(false)
  const [pageHeaderBackAction, setPageHeaderBackAction] = useState<
    (() => void) | undefined
  >()
  const [showSplash, setShowSplash] = useState(true)

  // 현재 라우트 정보, 페이지 이동 함수, URL의 checkInId를 가져옴
  const matches = useMatches()
  const navigate = useNavigate()
  const { checkInId: checkInIdParam } = useParams()
  const queryClient = useQueryClient()

  // URL에서 받은 checkInId를 숫자로 변환하고 유효하지 않으면 undefined 처리
  const parsedCheckInId = Number(checkInIdParam)
  const checkInId = Number.isInteger(parsedCheckInId)
    ? parsedCheckInId
    : undefined

  // 스플래시 화면을 다시 표시
  const restartSplash = useCallback(() => setShowSplash(true), [])

  // 현재 페이지에서 사용할 헤더 뒤로가기 동작을 등록
  const setHeaderBackAction = useCallback((action?: () => void) => {
    setPageHeaderBackAction(() => action)
  }, [])

  // 현재 매칭된 라우트 중 가장 구체적인 페이지 레이아웃 설정을 선택
  const pageLayout = matches.reduce<PageLayoutConfig | undefined>(
    (currentLayout, match) =>
      (match.handle as RouteHandle | undefined)?.pageLayout ?? currentLayout,
    undefined,
  )

  //로그아웃 처리
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
