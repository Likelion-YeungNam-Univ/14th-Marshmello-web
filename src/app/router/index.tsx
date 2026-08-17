import { createBrowserRouter } from "react-router-dom"

import App from "@/App"
import { CarePage } from "@/pages/care-page"
import { CheckinPage } from "@/pages/checkin-page"
import { ContentDetailPage } from "@/pages/content-detail-page"
import { HomePage } from "@/pages/home-page"
import { MassageGuidePage } from "@/pages/massage-guide-page"
import { MyPage } from "@/pages/mypage-page"
import { NotFoundPage } from "@/pages/not-found-page"
import { ProfileEditPage } from "@/pages/profile-edit-page"
import type { PageLayoutConfig } from "@/shared/components/layout/page-layout"
//테스트 페이지라서 이거 지울거에요
import { TestPage } from "@/pages/test-page"


const withPageLayout = (pageLayout: PageLayoutConfig) => ({ pageLayout })

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
        handle: withPageLayout({
          header: { variant: "default" },
          variant: "home",
        }),
      },
      {
        path: "checkin",
        element: <CheckinPage />,
        handle: withPageLayout({
          header: { title: "오늘의 체크인", variant: "back" },
          showNavbar: false,
          variant: "checkin",
        }),
      },
      { path: "body-map" },
      { path: "camera" },
      { path: "records" },
      {
        path: "care/:checkInId?",
        element: <CarePage />,
        handle: withPageLayout({ variant: "care" }),
      },
      {
        path: "massage-guide",
        element: <MassageGuidePage />,
        handle: withPageLayout({
          showHeader: false,
          showNavbar: false,
        }),
      },
      {
        path: "contents/:contentId",
        element: <ContentDetailPage />,
        handle: withPageLayout({
          header: { title: "추천 콘텐츠", variant: "back" },
          showHeader: false,
          showNavbar: false,
          variant: "content",
        }),
      },
      {
        path: "mypage",
        element: <MyPage />,
        handle: withPageLayout({ variant: "mypage" }),
      },
      {
        path: "mypage/edit",
        element: <ProfileEditPage />,
        handle: withPageLayout({
          showHeader: false,
          header: { title: "회원정보 수정", variant: "back" },
          showNavbar: false,
          variant: "mypage",
        }),
      },
    ],
  },
  //이거 테스트페이지라서 지울거에요
  { path: "/test", element: <TestPage /> },
  { path: "*", element: <NotFoundPage /> },
])
