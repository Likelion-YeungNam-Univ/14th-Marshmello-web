export const brandFaceIconPaths = {
  halo: "M103.996 35.359C141.902 35.359 172.633 66.09 172.633 103.996C172.633 141.902 141.902 172.633 103.996 172.633C66.09 172.633 35.359 141.902 35.359 103.996C35.359 66.09 66.09 35.359 103.996 35.359Z",
  circle:
    "M103.996 54.078C131.565 54.078 153.914 76.427 153.914 103.996C153.914 131.565 131.565 153.914 103.996 153.914C76.427 153.914 54.078 131.565 54.078 103.996C54.078 76.427 76.427 54.078 103.996 54.078Z",
  eyeLeft:
    "M72.797 100.876C76.957 105.036 83.197 105.036 87.356 100.876",
  eyeRight:
    "M120.636 100.876C124.796 105.036 131.036 105.036 135.195 100.876",
  mouth:
    "M89.437 121.676C98.797 130.996 109.196 130.996 118.555 121.676",
} as const

const HALO_CENTER = 103.996
const HALO_RADIUS = (172.633 - 35.359) / 2 

export type BrandFaceIconProps = {
  className?: string
  haloColor?: string
  haloOpacity?: number
  circleColor?: string
  strokeColor?: string
  strokeWidth?: number
  accentDotColor?: string
  accentDotRadius?: number
  accentDotAngleDeg?: number
  accentDotAnimated?: boolean
  accentDotOrbitDurationMs?: number
}

export function BrandFaceIcon({
  className,
  haloColor = "#fde7f5",
  haloOpacity = 0.567147,
  circleColor = "#f6cbe6",
  strokeColor = "#a06a91",
  strokeWidth = 4.15984,
  accentDotColor,
  accentDotRadius = 9,
  accentDotAngleDeg = 42,
  accentDotAnimated = true,
  accentDotOrbitDurationMs = 4000,
}: BrandFaceIconProps) {
  const accentDotAngleRad = (accentDotAngleDeg * Math.PI) / 180
  const accentDotCx = HALO_CENTER + HALO_RADIUS * Math.cos(accentDotAngleRad)
  const accentDotCy = HALO_CENTER + HALO_RADIUS * Math.sin(accentDotAngleRad)

  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      preserveAspectRatio="none"
      viewBox="0 0 207.992 207.992"
    >
      <path d={brandFaceIconPaths.halo} fill={haloColor} opacity={haloOpacity} />
      <path d={brandFaceIconPaths.circle} fill={circleColor} />
      <g>
        <path
          d={brandFaceIconPaths.eyeLeft}
          fill="none"
          stroke={strokeColor}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
        />
        <path
          d={brandFaceIconPaths.eyeRight}
          fill="none"
          stroke={strokeColor}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
        />
        <path
          d={brandFaceIconPaths.mouth}
          fill="none"
          stroke={strokeColor}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
        />
      </g>
      {accentDotColor ? (
        <g>
          {accentDotAnimated ? (
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              dur={`${accentDotOrbitDurationMs}ms`}
              from={`0 ${HALO_CENTER} ${HALO_CENTER}`}
              repeatCount="indefinite"
              to={`360 ${HALO_CENTER} ${HALO_CENTER}`}
              type="rotate"
            />
          ) : null}
          <circle
            cx={accentDotCx}
            cy={accentDotCy}
            fill={accentDotColor}
            r={accentDotRadius}
          />
        </g>
      ) : null}
    </svg>
  )
}
