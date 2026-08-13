// src/app/router.tsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "@/App";
import LoginPage from "@/features/auth/components/login-page";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        // 핵심: "/" 주소로 오면 "/login"으로 무조건 쫓아냅니다(리다이렉트).
        index: true, 
        element: <Navigate to="/login" replace />, 
      },
      {
        path: "login",
        element: <LoginPage />,
      },
    ],
  },
]);