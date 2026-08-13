// src/App.tsx
import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "@/shared/components/ui/navbar";
import SplashScreen from "@/shared/components/ui/splash-screen";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const location = useLocation(); // 현재 URL 주소 확인 도구

  // 1. 하단 바를 숨길 주소 목록
  const hideNavbarPaths = ["/login", "/signup"];
  const shouldHideNavbar = hideNavbarPaths.includes(location.pathname);

  if (showSplash) {
    return (
      <SplashScreen
        durationMs={5000}
        onFinish={() => setShowSplash(false)}
      />
    );
  }

  return (
    // Navbar가 없을 때는 하단 여백(pb-[82px])도 제거
    <div className={`min-h-dvh ${shouldHideNavbar ? "" : "pb-[82px]"}`}>
      <main>
        <Outlet />
      </main>

      {/* 2. shouldHideNavbar가 false일 때만 Navbar 렌더링 */}
      {!shouldHideNavbar && <Navbar />}
    </div>
  );
}