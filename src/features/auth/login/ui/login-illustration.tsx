export function LoginIllustration() {
  return (
    <svg
      aria-hidden="true"
      className="block h-[260px] w-full overflow-visible"
      viewBox="0 0 402 260"
      preserveAspectRatio="none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id="archOuterGradient"
          x1="0"
          y1="0"
          x2="402"
          y2="260"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#F6BFE0" />
          <stop offset="50%" stopColor="#F0A0D0" />
          <stop offset="100%" stopColor="#E572B8" />
        </linearGradient>

        <linearGradient
          id="archInnerGradient"
          x1="0"
          y1="0"
          x2="402"
          y2="260"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#F1D4EC" />
          <stop offset="50%" stopColor="#E8C0E0" />
          <stop offset="100%" stopColor="#D89ED2" />
        </linearGradient>
      </defs>

      <style>
        {`
          @keyframes arch-float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-6px); }
          }
          @keyframes arch-dot-pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.35); opacity: 0.65; }
          }
          .arch-float {
            animation: arch-float 6s ease-in-out infinite;
          }
          .arch-dot {
            animation: arch-dot-pulse 2.4s ease-in-out infinite;
            transform-box: fill-box;
            transform-origin: center;
          }
          @media (prefers-reduced-motion: reduce) {
            .arch-float,
            .arch-dot {
              animation: none;
            }
          }
        `}
      </style>

      <g className="arch-float">
        <path
          d="
            M 0 60
            Q 201 -90 402 60
            L 402 125
            Q 201 -44 0 125
            Z
          "
          fill="url(#archOuterGradient)"
        />

        <path
          d="
            M 0 125
            Q 201 -44 402 125
            L 402 230
            Q 201 -5 0 230
            Z
          "
          fill="url(#archInnerGradient)"
        />

        <circle className="arch-dot" cx="201" cy="169" r="7" fill="#80D8C9" />
      </g>
    </svg>
  );
}