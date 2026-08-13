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