import { useCallback, useState } from "react";
import { Navbar } from "@/shared/components/ui/navbar";
import { Outlet, useLocation } from "react-router-dom";
import SplashScreen from "@/shared/components/ui/splash-screen";

export type AppOutletContext = {
  restartSplash: () => void;
};

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const { pathname } = useLocation();
  const isImmersivePage = ["/massage-guide", "/mypage/edit"].includes(pathname);
  const restartSplash = useCallback(() => setShowSplash(true), []);

  if (showSplash) {
    return (
      <SplashScreen
        durationMs={5000}
        onFinish={() => setShowSplash(false)}
      />
    );
  }

  return (
    <div className={`min-h-dvh ${isImmersivePage ? "" : "pb-[82px]"}`}>
      <main>
        <Outlet context={{ restartSplash }} />
      </main>

      {isImmersivePage ? null : <Navbar />}
    </div>
  );
}
