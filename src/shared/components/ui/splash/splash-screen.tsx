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
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center gap-7 transition-opacity duration-300 ease-out ${
        isFadingOut ? "opacity-0" : "opacity-100"
      }`}
      role="status"
      style={{
        backgroundImage:
          "linear-gradient(135deg, #fac3de 0%, #fac3de 30%, #fdf3dc 70%, #fdf3dc 100%)",
      }}
    >
      <BrandFaceIcon
        accentDotColor={ACCENT_DOT_COLOR}
        circleColor={CIRCLE_COLOR}
        className="size-[148px] overflow-visible"
        haloColor={HALO_COLOR}
        haloOpacity={0.65}
        strokeColor={FACE_STROKE_COLOR}
      />
      <span aria-label="품결" className="logo text-[44px] leading-none">
        품결
      </span>
      <span className="sr-only">품결 앱을 시작하는 중입니다</span>
    </div>
  )
}
