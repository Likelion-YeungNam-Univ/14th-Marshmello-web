import { useState } from "react"

import { LoginIllustration } from "@/features/auth/login/ui/login-illustration"
import { GoogleLoginButton } from "@/features/auth/login/ui/google-login-button"
import SplashScreen from "@/shared/components/ui/splash/splash-screen"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const SPLASH_SESSION_KEY = "poomgyeol:splash-shown"

const BG_GRADIENT =
  "linear-gradient(114.6569940554643deg, rgb(253, 241, 248) 0%, rgb(253, 243, 249) 7.1429%, rgb(254, 245, 250) 14.286%, rgb(254, 247, 251) 21.429%, rgb(254, 249, 252) 28.571%, rgb(254, 251, 253) 35.714%, rgb(255, 253, 254) 42.857%, rgb(255, 255, 255) 50%, rgb(253, 250, 253) 57.143%, rgb(252, 244, 250) 64.286%, rgb(250, 239, 248) 71.429%, rgb(248, 233, 245) 78.571%, rgb(247, 228, 243) 85.714%, rgb(245, 222, 240) 92.857%, rgb(243, 217, 238) 100%)"

export default function LoginPage() {
  const [showSplash, setShowSplash] = useState(() => {
    if (typeof window === "undefined") return true

    return (
      window.sessionStorage.getItem(SPLASH_SESSION_KEY) !== "1"
    )
  })

  const handleGoogleLogin = () => {
    window.location.href =
      `${API_BASE_URL}/oauth2/authorization/oidc`
  }

  if (showSplash) {
    return (
      <SplashScreen
        durationMs={5000}
        onFinish={() => {
          window.sessionStorage.setItem(
            SPLASH_SESSION_KEY,
            "1",
          )
          setShowSplash(false)
        }}
      />
    )
  }

  return (
    <main
      className="relative mx-auto min-h-dvh w-full max-w-[402px] overflow-hidden"
      style={{ backgroundImage: BG_GRADIENT }}
    >
      <div
        aria-hidden="true"
        className="absolute -top-24 -left-24 size-72 rounded-full bg-[#fbe0f1] blur-[64px]"
      />

      <div
        aria-hidden="true"
        className="absolute -right-16 -bottom-24 size-80 rounded-full bg-[#efc9e6] opacity-70 blur-[64px]"
      />

      <div className="relative min-h-dvh">
        <div className="absolute left-6 top-[120px] text-left">
          <h1
            className="logo -ml-2 text-[80px] leading-[1.1] font-normal tracking-tight text-[#1a1a1a]"
            aria-label="품결"
          >
            품결
          </h1>

          <p className="mt-3 text-[18px] leading-[1.4] font-medium text-[#4a4d55]">
            임신의 시간을{" "}
            <span className="font-bold text-[#e756be]">품</span>은
            <br />
            피부<span className="font-bold text-[#e756be]">결</span>의 기록
          </p>
        </div>

        <div className="absolute left-0 top-[46.5%] w-full overflow-visible">
          <LoginIllustration />
        </div>

        <div className="absolute bottom-[16%] left-6 right-6">
          <GoogleLoginButton />
        </div>
      </div>
    </main>
  )
}