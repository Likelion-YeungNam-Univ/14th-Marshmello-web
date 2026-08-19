import { createBrowserRouter, redirect } from "react-router-dom"

import App from "@/App"
import { CarePage } from "@/pages/care-page"
import { CheckinPage } from "@/pages/checkin-page"
import { ContentDetailPage } from "@/pages/content-detail-page"
import { useProfileStore } from "@/features/mypage/model/use-profile-store"
import { HomePage } from "@/pages/home-page"
import LoginPage from "@/pages/login-page"
import { MassageGuidePage } from "@/pages/massage-guide-page"
import { MyPage } from "@/pages/mypage-page"
import { NotFoundPage } from "@/pages/not-found-page"
import { ProfileEditPage } from "@/pages/profile-edit-page"
import { RecordsPage } from "@/pages/records-page"
import { SignupProfilePage } from "@/pages/signup-profile-page"
import {
  getCsrf,
  getUserProfile,
  type UserProfile,
} from "@/shared/api/auth"
import type { PageLayoutConfig } from "@/shared/components/layout/page-layout"
import { TestPage } from "@/pages/test-page"

const withPageLayout = (pageLayout: PageLayoutConfig) => ({
  pageLayout,
})

function syncProfileStore(profile: UserProfile) {
  useProfileStore.getState().updateProfile({
    dueDate: profile.expectedDeliveryDate,
    name: profile.nickname,
  })
}

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

    syncProfileStore(profile)

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
 */
async function homeLoader() {
  const loginStarted =
    localStorage.getItem("loginStarted") === "true"

  if (!loginStarted) {
    throw redirect("/login")
  }

  try {
    await getCsrf()

    const profile = await getUserProfile()

    if (!profile) {
      localStorage.removeItem("loginStarted")
      throw redirect("/login")
    }

    syncProfileStore(profile)

    if (!profile.profileCompleted) {
      throw redirect("/signup/profile")
    }

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
       * 홈
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
          header: {
            title: "오늘의 체크인",
            variant: "back",
          },
          showNavbar: false,
          variant: "checkin",
        }),
      },

      // 로컬 UI 확인용 경로이며, 배포 번들에는 포함되지 않습니다.
      ...(import.meta.env.DEV
        ? [{
            path: "checkin-preview/:previewStep",
            element: <CheckinPage />,
            handle: withPageLayout({
              header: {
                title: "오늘의 체크인",
                variant: "back",
              },
              showNavbar: false,
              variant: "checkin",
            }),
          }]
        : []),

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
        element: <RecordsPage />,
        handle: withPageLayout({
          variant: "records",
        }),
      },

      /**
       * Care
       */
      {
        path: "care/:checkInId?",
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
          header: {
            title: "추천 콘텐츠",
            variant: "back",
          },
          showHeader: false,
          showNavbar: false,
          variant: "content",
        }),
      },

      /**
       * 마이페이지
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
       */
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

  /**
   * 404
   */
  {
    path: "/test",
    loader: requireAuth,
    element: <TestPage />,
  },

  {
    path: "*",
    element: <NotFoundPage />,
  },
])
