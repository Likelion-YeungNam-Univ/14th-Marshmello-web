import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "@/App";
import LoginPage from "@/features/auth/components/ui/login-page";
import { ContentRecommendationSection } from "@/features/care/ui/content-recommendation-section";

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
      {
        path: "home",
        element: <div>Home Page</div>, 
      },
      {
        path: "care",
        element: <ContentRecommendationSection />, 
      },
    ],
  },
]);