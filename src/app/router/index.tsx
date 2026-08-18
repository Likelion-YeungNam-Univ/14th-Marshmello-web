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
import {
  getCsrf,
  getUserProfile,
} from "@/shared/api/auth"
import type { PageLayoutConfig } from "@/shared/components/layout/page-layout"
import { TestPage } from "@/pages/test-page"

const withPageLayout = (pageLayout: PageLayoutConfig) => ({
  pageLayout,
})

/**
 * 로그인 상태 확인
 *
 * GET /api/csrf
 * GET /api/user
 */
async function requireAuth() {
  try {
    await getCsrf()

    const profile = await getUserProfile()

    if (!profile) {
      throw redirect("/login")
    }

    return profile
  } catch (error) {
    if (error instanceof Response) {
      throw error
    }

    console.error("로그인 확인 실패:", error)
    throw redirect("/login")
  }
}

/**
 * 로그인 + 회원정보 등록 완료 여부 확인
 *
 * profileCompleted === false
 * → 신규 회원정보 등록
 *
 * profileCompleted === true
 * → 서비스 이용 가능
 */
async function requireProfileComplete() {
  const profile = await requireAuth()

  if (!profile.profileCompleted) {
    throw redirect("/signup/profile")
  }

  return profile
}

/**
 * 신규 회원정보 등록 페이지 접근 처리
 *
 * 로그인하지 않음
 * → /login
 *
 * 이미 회원정보 등록 완료
 * → /
 */
async function signupProfileLoader() {
  const profile = await requireAuth()

  if (profile.profileCompleted) {
    throw redirect("/")
  }

  return profile
}

/**
 * 첫 화면 처리
 *
 * 로그인 버튼을 누르기 전:
 * → /login
 *
 * 로그인 버튼을 누른 후 Google OAuth 완료:
 * → GET /api/csrf
 * → GET /api/user
 *
 * profileCompleted === false
 * → /signup/profile
 *
 * profileCompleted === true
 * → HomePage
 */
async function homeLoader() {
  const loginStarted =
    localStorage.getItem("loginStarted") === "true"

  /**
   * 로그인 버튼을 누르지 않았다면
   * API 호출 없이 로그인 화면으로 이동
   */
  if (!loginStarted) {
    throw redirect("/login")
  }

  try {
    /**
     * 로그인 후 CSRF 확인
     */
    await getCsrf()

    /**
     * 서비스 회원정보 확인
     */
    const profile = await getUserProfile()

    /**
     * 로그인되지 않은 상태
     */
    if (!profile) {
      localStorage.removeItem("loginStarted")
      throw redirect("/login")
    }

    /**
     * 신규 회원
     */
    if (!profile.profileCompleted) {
      throw redirect("/signup/profile")
    }

    /**
     * 기존 회원
     */
    return profile
  } catch (error) {
    if (error instanceof Response) {
      throw error
    }

    console.error("로그인 확인 실패:", error)

    localStorage.removeItem("loginStarted")
    throw redirect("/login")
  }
}

/**
 * 로그인만 필요한 페이지
 */
async function authLoader() {
  return requireAuth()
}

export const router = createBrowserRouter([
  /**
   * 로그인 페이지
   *
   * App 밖에 있어서 Header / Navbar가 표시되지 않는다.
   */
  {
    path: "/login",
    element: <LoginPage />,
  },

  /**
   * 서비스 영역
   */
  {
    path: "/",
    element: <App />,
    children: [
      /**
       * 로그인 + 회원정보 등록 완료 필요
       */
      {
        index: true,
        loader: homeLoader,
        element: <HomePage />,
        handle: withPageLayout({
          header: {
            variant: "default",
          },
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
    path: "/test",
    element: <TestPage />,
  },

  {
    path: "*",
    element: <NotFoundPage />,
  },
])