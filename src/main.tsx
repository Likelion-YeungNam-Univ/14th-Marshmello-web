// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

import { AppProviders } from "@/app/providers/app-providers";
import App from "./App"; 
import LoginPage from "@/features/auth/components/login-page";

import "./index.css";

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
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  </StrictMode>
);