import { createBrowserRouter, redirect } from "react-router-dom"

import App from "@/App"
import { CarePage } from "@/pages/care-page"
import { CheckinPage } from "@/pages/checkin-page"
import { ContentDetailPage } from "@/pages/content-detail-page"
import { HomePage } from "@/pages/home-page"
import LoginPage from "@/pages/login-page"
import { MassageGuidePage } from "@/pages/massage-guide-page"
import { MyPage } from "@/pages/mypage-page"
import { NotFoundPage } from "@/pages/not-found-page"
import { ProfileEditPage } from "@/pages/profile-edit-page"
import { getMe } from "@/shared/api/auth"
import type { PageLayoutConfig } from "@/shared/components/layout/page-layout"

const withPageLayout = (pageLayout: PageLayoutConfig) => ({
  pageLayout,
})

/**
 * 로그인 여부 확인
 *
 * 로그인되어 있지 않으면 로그인 페이지로 이동
 */
async function requireAuth() {
  const me = await getMe()

  if (!me) {
    throw redirect("/login")
  }

  return me
}

/**
 * 로그인 페이지 접근 처리
 *
 * 이미 로그인된 사용자가 /login으로 들어오면 홈으로 이동
 */
async function redirectIfAuthenticated() {
  const me = await getMe()

  if (me) {
    throw redirect("/")
  }

  return null
}

/**
 * 로그인 후 필요한 CSRF 토큰 준비
 */
async function authLoader() {
  return requireAuth()
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      /**
       * 홈
       *
       * 로그인한 사용자만 접근 가능
       */
      {
        index: true,
        loader: authLoader,
        element: <HomePage />,
        handle: withPageLayout({
          variant: "home",
        }),
      },

      /**
       * 로그인
       *
       * 이미 로그인한 상태라면 홈으로 이동
       */
      {
        path: "login",
        element: <LoginPage />,
      },

      /**
       * 로그인 필요
       */
      {
        path: "checkin",
        loader: authLoader,
        element: <CheckinPage />,
        handle: withPageLayout({
          variant: "checkin",
        }),
      },

      {
        path: "body-map",
        loader: authLoader,
      },

      {
        path: "camera",
        loader: authLoader,
      },

      {
        path: "records",
        loader: authLoader,
      },

      {
        path: "care",
        loader: authLoader,
        element: <CarePage />,
        handle: withPageLayout({
          variant: "care",
        }),
      },

      {
        path: "massage-guide",
        loader: authLoader,
        element: <MassageGuidePage />,
        handle: withPageLayout({
          showHeader: false,
          showNavbar: false,
        }),
      },

      {
        path: "contents/:contentId",
        loader: authLoader,
        element: <ContentDetailPage />,
        handle: withPageLayout({
          variant: "content",
        }),
      },

      {
        path: "mypage",
        loader: authLoader,
        element: <MyPage />,
        handle: withPageLayout({
          variant: "mypage",
        }),
      },

      {
        path: "mypage/edit",
        loader: authLoader,
        element: <ProfileEditPage />,
        handle: withPageLayout({
          showHeader: false,
          showNavbar: false,
          variant: "mypage",
        }),
      },
    ],
  },

  {
    path: "*",
    element: <NotFoundPage />,
  },
])