import { useEffect, useState } from "react"

import { BrandFaceIcon } from "@/shared/components/ui/splash/face-icon"

const HALO_COLOR = "#fbdcec"
const CIRCLE_COLOR = "#f6c7e0"
const FACE_STROKE_COLOR = "#a97591"
const ACCENT_DOT_COLOR = "#ec5698"

export type SplashScreenProps = {
  durationMs?: number
  onFinish?: () => void
}

const FADE_OUT_MS = 300

export default function SplashScreen({
  durationMs = 5000,
  onFinish,
}: SplashScreenProps) {
  const [isFadingOut, setIsFadingOut] = useState(false)

  useEffect(() => {
    const fadeTimer = window.setTimeout(
      () => setIsFadingOut(true),
      Math.max(durationMs - FADE_OUT_MS, 0),
    )

    const finishTimer = window.setTimeout(() => {
      onFinish?.()
    }, durationMs)

    return () => {
      window.clearTimeout(fadeTimer)
      window.clearTimeout(finishTimer)
    }
  }, [durationMs, onFinish])

  return (
    <div
      className={`fixed inset-x-0 top-0 z-50 mx-auto flex min-h-dvh w-full max-w-[393px] flex-col items-center justify-center overflow-hidden transition-opacity duration-300 ease-out ${
        isFadingOut ? "opacity-0" : "opacity-100"
      }`}
      role="status"
      style={{
        backgroundColor: "#fbebf5",
        backgroundImage: `
          radial-gradient(
            circle 650px at 12% 21%,
            #f8a2d8 0%,
            #f8a9da 15%,
            #f8bae1 30%,
            #fad3eb 50%,
            #fae2f1 70%,
            #fae8f3 85%,
            rgba(250, 234, 244, 0) 100%
          )
        `,
      }}
    >
      <div className="-translate-y-20 flex flex-col items-center">
        <BrandFaceIcon
          accentDotColor={ACCENT_DOT_COLOR}
          circleColor={CIRCLE_COLOR}
          className="size-[148px] overflow-visible"
          haloColor={HALO_COLOR}
          haloOpacity={0.65}
          strokeColor={FACE_STROKE_COLOR}
        />

        <span
          aria-label="품결"
          className="logo mt-2 text-[44px] leading-none"
        >
          품결
        </span>
      </div>

      <span className="sr-only">
        품결 앱을 시작하는 중입니다
      </span>
    </div>
  )
}
