// src/App.tsx
import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "@/shared/components/ui/navbar";
import SplashScreen from "@/shared/components/ui/splash-screen";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const location = useLocation(); // 현재 URL 주소 확인

  //하단 바 숨길 주소 목록
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
    <div className={`min-h-dvh ${shouldHideNavbar ? "" : "pb-[82px]"}`}>
      <main>
        <Outlet />
      </main>

      {/* shouldHideNavbar가 false일 때만 Navbar 렌더링 */}
      {!shouldHideNavbar && <Navbar />}
    </div>
  );
}