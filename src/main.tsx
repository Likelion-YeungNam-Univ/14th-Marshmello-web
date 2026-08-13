// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

import { AppProviders } from "@/app/providers/app-providers";
import App from "./App";
import LoginPage from "@/features/auth/components/login-page";

import "./index.css";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
      children: [
        {
          index: true,
          element: <Navigate to="/login" replace />,
        },
        {
          path: "login",
          element: <LoginPage />,
        },
      ],
    },
  ],
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  </StrictMode>
);