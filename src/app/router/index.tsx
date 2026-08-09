import { createBrowserRouter } from "react-router-dom"

import App from "@/App"
import { CheckinPage } from "@/pages/checkin-page"
import { HomePage } from "@/pages/home-page"

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
      { path: "care" },
    ],
  },
])
