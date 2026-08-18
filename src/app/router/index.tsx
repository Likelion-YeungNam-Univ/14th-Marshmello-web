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
import { SignupProfilePage } from "@/pages/signup-profile-page"
import { getMe, getUserProfile } from "@/shared/api/auth"
import type { PageLayoutConfig } from "@/shared/components/layout/page-layout"

const withPageLayout = (pageLayout: PageLayoutConfig) => ({
  pageLayout,
})

async function requireAuth() {
  const me = await getMe()

  if (!me) {
    throw redirect("/login")
  }

  return me
}

/**
 * 로그인 -> 회원정보 등록 완료 여부 확인
 *
 * 로그인 o, 회원정보 등록 x: 신규 회원정보 등록 화면으로 이동
 */
async function requireProfileComplete() {
  await requireAuth()

  const profile = await getUserProfile()

  if (!profile.profileCompleted) {
    throw redirect("/signup/profile")
  }

  return profile
}

/**
 * 신규 회원정보 등록 페이지 접근 처리
 *
 * 로그인 x: 로그인 화면으로 이동
 * 회원정보 등록 o: 홈으로 이동
 */
async function signupProfileLoader() {
  await requireAuth()

  const profile = await getUserProfile()

  if (profile.profileCompleted) {
    throw redirect("/")
  }

  return profile
}

async function homeLoader() {
  const loginStarted =
    localStorage.getItem("loginStarted") === "true"

  if (!loginStarted) {
    throw redirect("/login")
  }

  /**
   * Google/OIDC 인증 확인
   */
  const me = await getMe()

  if (!me) {
    localStorage.removeItem("loginStarted")
    throw redirect("/login")
  }

  /**
   * 우리 서비스의 회원정보 확인
   */
  const profile = await getUserProfile()

  if (!profile.profileCompleted) {
    throw redirect("/signup/profile")
  }

  return profile
}

async function authLoader() {
  return requireAuth()
}

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },

  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        loader: homeLoader,
        element: <HomePage />,
        handle: withPageLayout({
          header: { variant: "default" },
          variant: "home",
        }),
      },

      {
        path: "signup/profile",
        loader: signupProfileLoader,
        element: <SignupProfilePage />,
        handle: withPageLayout({
          showHeader: false,
          showNavbar: false,
        }),
      },

      {
        path: "home",
        loader: requireProfileComplete,
        element: <HomePage />,
        handle: withPageLayout({
          variant: "home",
        }),
      },

      {
        path: "checkin",
        loader: requireProfileComplete,
        element: <CheckinPage />,
        handle: withPageLayout({
          header: {
            title: "오늘의 체크인",
            variant: "back",
          },
          showNavbar: false,
          variant: "checkin",
        }),
      },

      {
        path: "body-map",
        loader: requireProfileComplete,
      },

      {
        path: "camera",
        loader: requireProfileComplete,
      },

      {
        path: "records",
        loader: requireProfileComplete,
      },

      {
        path: "care/:checkInId?",
        loader: requireProfileComplete,
        element: <CarePage />,
        handle: withPageLayout({
          variant: "care",
        }),
      },

      {
        path: "massage-guide",
        loader: requireProfileComplete,
        element: <MassageGuidePage />,
        handle: withPageLayout({
          showHeader: false,
          showNavbar: false,
        }),
      },

      {
        path: "contents/:contentId",
        loader: requireProfileComplete,
        element: <ContentDetailPage />,
        handle: withPageLayout({
          header: {
            title: "추천 콘텐츠",
            variant: "back",
          },
          showHeader: false,
          showNavbar: false,
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
          header: {
            title: "회원정보 수정",
            variant: "back",
          },
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