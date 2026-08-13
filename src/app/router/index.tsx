import { createBrowserRouter } from "react-router-dom"

import App from "@/App"
import { CarePage } from "@/pages/care-page"
import { CheckinPage } from "@/pages/checkin-page"
import { ContentDetailPage } from "@/pages/content-detail-page"
import { HomePage } from "@/pages/home-page"
import { LogoutPage } from "@/pages/logout-page"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "checkin", element: <CheckinPage /> },
      { path: "body-map" },
      { path: "camera" },
      { path: "records" },
      { path: "care", element: <CarePage /> },
      { path: "contents/:contentId", element: <ContentDetailPage /> },
    ],
  },
  { path: "/logout", element: <LogoutPage /> },
])
