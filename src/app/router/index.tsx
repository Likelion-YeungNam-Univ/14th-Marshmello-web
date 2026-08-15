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
import LoginPage from "@/pages/login-page"

const withPageLayout = (pageLayout: PageLayoutConfig) => ({ pageLayout })

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
        handle: withPageLayout({ variant: "home" }),
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "checkin",
        element: <CheckinPage />,
        handle: withPageLayout({ variant: "checkin" }),
      },
      { path: "body-map" },
      { path: "camera" },
      { path: "records" },
      {
        path: "care",
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
        handle: withPageLayout({ variant: "content" }),
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
          showNavbar: false,
          variant: "mypage",
        }),
      },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
])
