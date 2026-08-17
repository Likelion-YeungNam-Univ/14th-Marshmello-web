import { Link } from "react-router-dom"

import { Button } from "@/shared/components/ui/button"
import svgPaths from "./imports/404페이지/svg-aqhnyybvxb"

const BG_GRADIENT =
  "linear-gradient(114.6569940554643deg, rgb(253, 241, 248) 0%, rgb(253, 243, 249) 7.1429%, rgb(254, 245, 250) 14.286%, rgb(254, 247, 251) 21.429%, rgb(254, 249, 252) 28.571%, rgb(254, 251, 253) 35.714%, rgb(255, 253, 254) 42.857%, rgb(255, 255, 255) 50%, rgb(253, 250, 253) 57.143%, rgb(252, 244, 250) 64.286%, rgb(250, 239, 248) 71.429%, rgb(248, 233, 245) 78.571%, rgb(247, 228, 243) 85.714%, rgb(245, 222, 240) 92.857%, rgb(243, 217, 238) 100%)"

type ProfileIllustrationProps = {
  className?: string
  coreColor?: string
  faceColor?: string
  haloColor?: string
  orbitColor?: string
  orbitShadowColor?: string
}

export function ProfileIllustration({
  className = "size-[208px] overflow-visible",
  coreColor = "#f6cbe6",
  faceColor = "#a06a91",
  haloColor = "#fde7f5",
  orbitColor = "#e0559a",
  orbitShadowColor = "rgba(224, 85, 154, 0.45)",
}: ProfileIllustrationProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      preserveAspectRatio="none"
      viewBox="0 0 207.992 207.992"
    >
      <path
        className="not-found-halo"
        d={svgPaths.pff03871}
        fill={haloColor}
        opacity="0.567147"
      />

      <path d={svgPaths.p2c99a500} fill={coreColor} />

      <g className="not-found-orbit">
        <circle
          cx="104"
          cy="30"
          fill={orbitColor}
          r="7"
          style={{ filter: `drop-shadow(0 0 5px ${orbitShadowColor})` }}
        />
      </g>

      <g className="not-found-face">
        <path
          d={svgPaths.p2cf33d80}
          fill="none"
          stroke={faceColor}
          strokeLinecap="round"
          strokeWidth="4.15984"
        />
        <path
          d={svgPaths.p3059f200}
          fill="none"
          stroke={faceColor}
          strokeLinecap="round"
          strokeWidth="4.15984"
        />
        <path
          d={svgPaths.p31071980}
          fill="none"
          stroke={faceColor}
          strokeLinecap="round"
          strokeWidth="4.15984"
        />
      </g>
    </svg>
  )
}

export function NotFoundPage() {
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

      <div className="relative flex min-h-dvh flex-col items-center px-6 pt-[75px] text-center">
        <span className="logo text-[40px] leading-[42px]" aria-label="품결">
          품결
        </span>

        <p className="mt-[23px] text-sm leading-[21px] font-semibold tracking-[2.24px] text-[#f19ed2]">
          PAGE NOT FOUND
        </p>

        <div className="mt-8">
          <ProfileIllustration />
        </div>

        <h1 className="mt-8 text-[88px] leading-[88px] font-black tracking-[-2px] text-[#26292e]">
          404
        </h1>

        <p className="mt-5 text-[22px] leading-[33px] font-semibold tracking-[-0.3px] text-[#26292e]">
          페이지를 찾을 수 없어요
        </p>

        <p className="mt-2.5 text-base leading-[27.2px] tracking-[-0.16px] text-[#6a6e75]">
          주소가 바뀌었거나 사라진 페이지예요.
          <br />
          잠시 쉬었다가 다시 돌아와요.
        </p>

        <Button
          asChild
          className="mt-10 h-14 w-full max-w-[320px] rounded-[15px] bg-[#f19ed2] text-base font-semibold text-white hover:bg-[#ee90ca] active:scale-[0.98]"
        >
          <Link to="/">홈으로 돌아가기</Link>
        </Button>
      </div>
    </main>
  )
}
