type Step = {
  background?: "pink" | "warm"
  image?: string
  imageAlt?: string
  press?: boolean
  ring?: boolean
  sweep?: boolean
  sweepBig?: boolean
}

type IllustrationProps = {
  step: Step
}

const SOFT_GLOW = "drop-shadow(0 0 5px rgba(244, 169, 208, 0.5))"
const STRONG_GLOW = "drop-shadow(0 0 6px rgba(224, 85, 154, 0.55))"

export default function Illustration({ step }: IllustrationProps) {
  const backgroundClassName =
    step.background === "warm"
      ? "bg-[linear-gradient(125.8735deg,#fff1cf_0%,#feeed3_14%,#fde7dc_28%,#fce0e4_43%,#fbd9ec_57%,#f8cfe9_72%,#f3c2e4_100%)]"
      : "bg-[linear-gradient(127deg,#fdf1f8_0%,#fef5fa_20%,#fef9fc_40%,#fff_50%,#fdf8fb_70%,#fbeef6_100%)]"

  return (
    <div
      className={`relative aspect-[337/438] w-full overflow-hidden rounded-[22px] ${backgroundClassName}`}
    >
      {step.image ? (
        <img
          alt={step.imageAlt ?? ""}
          className="size-full object-contain"
          src={step.image}
        />
      ) : null}

      {step.ring ? (
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute top-[calc(50%+2px)] left-1/2 size-[46%] -translate-x-1/2 -translate-y-[52%] overflow-visible"
          viewBox="0 0 200 200"
        >
          <circle
            cx="100"
            cy="28"
            fill="#f4a9d0"
            r="13"
            style={{
              animation: "orbit 3.2s linear infinite",
              filter: STRONG_GLOW,
              transformOrigin: "100px 100px",
            }}
          />
        </svg>
      ) : null}

      {step.sweep ? (
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 size-[62%] -translate-x-1/2 -translate-y-1/2 overflow-visible"
          viewBox="0 0 200 200"
        >
          <path
            d="M58 132 Q42 100 58 72"
            fill="none"
            stroke="#f4a9d0"
            strokeLinecap="round"
            strokeWidth="7"
            style={{
              animation: "sweepUp 1.8s ease-in-out infinite",
              filter: SOFT_GLOW,
            }}
          />
          <path
            d="M164 132 Q180 100 164 72"
            fill="none"
            stroke="#f4a9d0"
            strokeLinecap="round"
            strokeWidth="7"
            style={{
              animation: "sweepUp 1.8s ease-in-out 0.4s infinite",
              filter: SOFT_GLOW,
            }}
          />
        </svg>
      ) : null}

      {step.press ? (
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 size-full overflow-visible"
          viewBox="0 0 200 200"
        >
          <circle
            cx="66"
            cy="113"
            fill="#f4a9d0"
            r="9"
            style={{
              animation: "orbit 2.8s linear infinite",
              filter: SOFT_GLOW,
              transformOrigin: "66px 128px",
            }}
          />
          <circle
            cx="134"
            cy="113"
            fill="#f4a9d0"
            r="9"
            style={{
              animation: "orbit 2.8s linear 0.6s infinite reverse",
              filter: SOFT_GLOW,
              transformOrigin: "134px 128px",
            }}
          />
        </svg>
      ) : null}

      {step.sweepBig ? (
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 size-[86%] -translate-x-1/2 -translate-y-1/2 overflow-visible"
          viewBox="0 0 200 200"
        >
          <circle
            cx="100"
            cy="22"
            fill="#f4a9d0"
            r="11"
            style={{
              animation: "orbit 5s linear infinite",
              filter: SOFT_GLOW,
              transformOrigin: "100px 100px",
            }}
          />
        </svg>
      ) : null}
    </div>
  )
}
