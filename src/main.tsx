// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { AppProviders } from "@/app/providers/app-providers";
import App from "./App"; 
import LoginPage from "@/features/auth/components/login-page";

import "./index.css";

// .env 파일에서 아이디 가져오기
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

// main.tsx 안에서 직접 라우터 만들어줆.
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true, // 기본 주소(/)로 오면
        element: <Navigate to="/login" replace />, // /login으로 쫓아냄
      },
      {
        path: "login",
        element: <LoginPage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    </GoogleOAuthProvider>
  </StrictMode>

);