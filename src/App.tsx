import { useState } from "react";
import { Header } from "@/shared/components/ui/header";
import { Navbar } from "@/shared/components/ui/navbar";
import { Outlet } from "react-router-dom";
import SplashScreen from "@/shared/components/ui/splash-screen";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return (
      <SplashScreen
        durationMs={5000}
        onFinish={() => setShowSplash(false)}
      />
    );
  }

  return (
    <div className="min-h-dvh pb-[82px]">
      <Header className="mt-[20px]" />

      <main>
        <Outlet />
      </main>

      <Navbar />
    </div>
  );
}
