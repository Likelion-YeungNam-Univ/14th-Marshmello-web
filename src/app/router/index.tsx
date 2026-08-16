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

/**
 * 로그인 여부 확인
 */
async function requireAuth() {
  const me = await getMe()

  if (!me) {
    throw redirect("/login")
  }

  return me
}

/**
 * 로그인 + 회원정보 등록 완료 확인
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
 * 로그인 페이지 접근 처리
 *
 * 로그인 안 됨 → 로그인 화면
 *
 * 로그인 됨 + 회원정보 미완료 → 회원정보 등록
 *
 * 로그인 됨 + 회원정보 완료 → 홈
 */
async function loginPageLoader() {
  const me = await getMe()

  if (!me) {
    return null
  }

  const profile = await getUserProfile()

  if (!profile.profileCompleted) {
    throw redirect("/signup/profile")
  }

  throw redirect("/")
}

/**
 * 신규 회원정보 등록 페이지 접근 처리
 *
 * 로그인하지 않았다면 로그인으로
 *
 * 이미 회원정보 등록이 끝났다면 홈으로
 */
async function signupProfileLoader() {
  await requireAuth()

  const profile = await getUserProfile()

  if (profile.profileCompleted) {
    throw redirect("/")
  }

  return profile
}

/**
 * 마이페이지 등
 * 로그인만 필요한 페이지
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
       * 로그인 + 회원정보 등록 완료 필요
       */
      {
        index: true,
        loader: requireProfileComplete,
        element: <HomePage />,
        handle: withPageLayout({
          variant: "home",
        }),
      },

      /**
       * 로그인
       */
      {
        path: "login",
        loader: loginPageLoader,
        element: <LoginPage />,
      },

      /**
       * 신규 회원정보 등록
       */
      {
        path: "signup/profile",
        loader: signupProfileLoader,
        element: <SignupProfilePage />,
        handle: withPageLayout({
          showHeader: false,
          showNavbar: false,
        }),
      },

      /**
       * 체크인
       */
      {
        path: "checkin",
        loader: requireProfileComplete,
        element: <CheckinPage />,
        handle: withPageLayout({
          variant: "checkin",
        }),
      },

      /**
       * 로그인 + 회원정보 등록 완료 필요
       */
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

      /**
       * 케어
       */
      {
        path: "care",
        loader: requireProfileComplete,
        element: <CarePage />,
        handle: withPageLayout({
          variant: "care",
        }),
      },

      /**
       * 마사지 가이드
       */
      {
        path: "massage-guide",
        loader: requireProfileComplete,
        element: <MassageGuidePage />,
        handle: withPageLayout({
          showHeader: false,
          showNavbar: false,
        }),
      },

      /**
       * 콘텐츠 상세
       */
      {
        path: "contents/:contentId",
        loader: requireProfileComplete,
        element: <ContentDetailPage />,
        handle: withPageLayout({
          variant: "content",
        }),
      },

      /**
       * 마이페이지
       *
       * 로그인만 되어 있으면 접근 가능
       */
      {
        path: "mypage",
        loader: authLoader,
        element: <MyPage />,
        handle: withPageLayout({
          variant: "mypage",
        }),
      },

      /**
       * 기존 회원의 회원정보 수정
       *
       * 이 페이지는 기존 코드 그대로 사용
       */
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