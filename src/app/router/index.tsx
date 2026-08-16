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
 *
 * 로그인되어 있지 않으면 로그인 화면으로 이동
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
 *
 * 로그인은 되어 있지만 회원정보가 등록되지 않았다면
 * 신규 회원정보 등록 페이지로 이동
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
 * 로그인하지 않았다면 로그인 화면으로 이동
 * 이미 회원정보 등록이 완료되었다면 홈으로 이동
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
 * 로그인 후 첫 화면 처리
 *
 * 로그인 버튼을 누르기 전에는
 * 브라우저에 기존 쿠키가 있어도 로그인 화면을 보여준다.
 *
 * 로그인 버튼을 눌러 localStorage에 loginStarted가 저장된 후
 * Google OAuth 인증을 완료하면 인증 상태를 확인한다.
 */
async function rootLoader() {
  const loginStarted =
    localStorage.getItem("loginStarted") === "true"

  /**
   * 아직 로그인 버튼을 누르지 않았다면
   * 무조건 로그인 화면으로 이동
   */
  if (!loginStarted) {
    throw redirect("/login")
  }

  const me = await getMe()

  /**
   * 로그인 버튼을 눌렀지만 인증에 실패한 경우
   */
  if (!me) {
    localStorage.removeItem("loginStarted")
    throw redirect("/login")
  }

  const profile = await getUserProfile()

  /**
   * 신규 회원
   */
  if (!profile.profileCompleted) {
    throw redirect("/signup/profile")
  }

  /**
   * 기존 회원
   *
   * App이 렌더링되고 HomePage가 표시됨
   */
  return profile
}

/**
 * 로그인만 필요한 페이지
 */
async function authLoader() {
  return requireAuth()
}

export const router = createBrowserRouter([
  /**
   * 로그인 화면
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
    loader: rootLoader,
    element: <App />,
    children: [
      /**
       * 홈
       *
       * 로그인 + 회원정보 등록 완료 상태에서만 접근
       */
      {
        index: true,
        element: <HomePage />,
        handle: withPageLayout({
          variant: "home",
        }),
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
       * 별도 홈 경로
       */
      {
        path: "home",
        loader: requireProfileComplete,
        element: <HomePage />,
        handle: withPageLayout({
          variant: "home",
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
       * Body Map
       */
      {
        path: "body-map",
        loader: requireProfileComplete,
      },

      /**
       * Camera
       */
      {
        path: "camera",
        loader: requireProfileComplete,
      },

      /**
       * Records
       */
      {
        path: "records",
        loader: requireProfileComplete,
      },

      /**
       * Care
       *
       * 로그인 + 회원정보 등록 완료 필요
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
       * 기존 회원정보 수정
       *
       * 기존 ProfileEditPage 그대로 사용
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

  /**
   * 존재하지 않는 경로
   */
  {
    path: "*",
    element: <NotFoundPage />,
  },
])