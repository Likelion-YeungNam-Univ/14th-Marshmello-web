import {
  useRef,
} from "react"

import type {
  PointerEvent,
} from "react"

import type {
  checkInCountResponse,
} from "@/features/test/checkin_Controller"

type ChartProps = {
  data: checkInCountResponse[]
  selectedIndex: number
  onSelect: (index: number) => void
}

type Point = {
  x: number
  y: number
}

function formatMonth(
  yearMonth: string,
) {
  return `${Number(
    yearMonth.slice(5),
  )}월`
}

function createSmoothPath(
  points: Point[],
): string {
  if (points.length === 0) {
    return ""
  }

  if (points.length === 1) {
    return `M ${points[0].x} ${points[0].y}`
  }

  let path =
    `M ${points[0].x} ${points[0].y}`

  for (
    let index = 0;
    index < points.length - 1;
    index += 1
  ) {
    const current =
      points[index]

    const next =
      points[index + 1]

    const previous =
      points[index - 1] ??
      current

    const following =
      points[index + 2] ??
      next

    const controlPoint1 = {
      x:
        current.x +
        (next.x - previous.x) / 6,
      y:
        current.y +
        (next.y - previous.y) / 6,
    }

    const controlPoint2 = {
      x:
        next.x -
        (following.x - current.x) / 6,
      y:
        next.y -
        (following.y - current.y) / 6,
    }

    path +=
      ` C ${controlPoint1.x} ${controlPoint1.y}, ` +
      `${controlPoint2.x} ${controlPoint2.y}, ` +
      `${next.x} ${next.y}`
  }

  return path
}

export function Chart({
  data,
  selectedIndex,
  onSelect,
}: ChartProps) {
  const width = 300
  const height = 300

  const isDragging =
    useRef(false)

  const getIndexFromPointer = (
    event: PointerEvent<HTMLDivElement>,
  ) => {
    if (data.length <= 1) {
      return 0
    }

    const rect =
      event.currentTarget.getBoundingClientRect()

    const relativeX =
      event.clientX - rect.left

    const clampedX =
      Math.max(
        0,
        Math.min(
          relativeX,
          rect.width,
        ),
      )

    const ratio =
      clampedX / rect.width

    const index =
      Math.round(
        ratio * (data.length - 1),
      )

    return Math.max(
      0,
      Math.min(
        index,
        data.length - 1,
      ),
    )
  }

  const handlePointerDown = (
    event: PointerEvent<HTMLDivElement>,
  ) => {
    isDragging.current = true

    event.currentTarget.setPointerCapture(
      event.pointerId,
    )

    onSelect(
      getIndexFromPointer(event),
    )
  }

  const handlePointerMove = (
    event: PointerEvent<HTMLDivElement>,
  ) => {
    if (!isDragging.current) {
      return
    }

    onSelect(
      getIndexFromPointer(event),
    )
  }

  const handlePointerUp = (
    event: PointerEvent<HTMLDivElement>,
  ) => {
    isDragging.current = false

    if (
      event.currentTarget.hasPointerCapture(
        event.pointerId,
      )
    ) {
      event.currentTarget.releasePointerCapture(
        event.pointerId,
      )
    }
  }

  const maxCount = Math.max(
    ...data.map(
      (item) => item.count,
    ),
    30,
  )

  const points = data.map(
    (item, index) => {
      const x =
        data.length > 1
          ? (index /
              (data.length - 1)) *
            width
          : width / 2

      const y =
        height -
        (item.count / maxCount) *
          height

      return {
        x,
        y,
      }
    },
  )

  const linePath =
    createSmoothPath(points)

  const areaPath =
    `${linePath} L ${width} ${height} L 0 ${height} Z`

  const selectedPoint =
    points[selectedIndex] ??
    points[points.length - 1]

  const selectedData =
    data[selectedIndex] ??
    data[data.length - 1]

  const selectedLeft =
    (selectedPoint.x / width) *
    100

  return (
    <div className="relative mt-[80px] ml-[30px] h-[340px] w-[300px] touch-none select-none">
      <div
        className="absolute left-0 top-0 h-[300px] w-[300px] cursor-grab active:cursor-grabbing"
        onPointerDown={
          handlePointerDown
        }
        onPointerMove={
          handlePointerMove
        }
        onPointerUp={
          handlePointerUp
        }
        onPointerCancel={
          handlePointerUp
        }
      >
        <div className="pointer-events-none absolute inset-0">
          {[0, 1, 2, 3].map(
            (index) => (
              <div
                className="absolute left-0 right-0 border-t border-[#d9dfe4]"
                key={index}
                style={{
                  top: `${index * 33.333}%`,
                }}
              />
            ),
          )}
        </div>

        <div className="pointer-events-none absolute -left-[23px] top-[-6px] text-[12px] leading-none text-[#54555a]">
          {maxCount}
        </div>

        <div className="pointer-events-none absolute -left-[23px] top-[94px] text-[12px] leading-none text-[#54555a]">
          {Math.round(
            maxCount * 0.67,
          )}
        </div>

        <div className="pointer-events-none absolute -left-[23px] top-[194px] text-[12px] leading-none text-[#54555a]">
          {Math.round(
            maxCount * 0.33,
          )}
        </div>

        <div className="pointer-events-none absolute -left-[12px] bottom-[-1px] text-[12px] leading-none text-[#54555a]">
          0
        </div>

        <svg
          className="pointer-events-none absolute inset-0 h-[300px] w-[300px] overflow-visible"
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient
              id="status-chart-gradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor="#f19ed2"
                stopOpacity="0.3"
              />

              <stop
                offset="100%"
                stopColor="#f19ed2"
                stopOpacity="0.08"
              />
            </linearGradient>
          </defs>

          <path
            d={areaPath}
            fill="url(#status-chart-gradient)"
          />

          <path
            d={linePath}
            fill="none"
            stroke="#f19ed2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
          />
        </svg>

        <div
          className="pointer-events-none absolute top-0 h-[300px] w-[2px] bg-[#404040]"
          style={{
            left: `${selectedLeft}%`,
          }}
        />

        <div
          className="pointer-events-none absolute size-[10px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4a4a4a]"
          style={{
            left: `${selectedLeft}%`,
            top: `${selectedPoint.y}px`,
          }}
        />

        <div
          className="pointer-events-none absolute -top-[53px] w-[96px] -translate-x-1/2 rounded-[15px] bg-[#d9d9d9] px-[8px] py-[12px] text-center"
          style={{
            left: `${selectedLeft}%`,
          }}
        >
          <p className="whitespace-nowrap text-[11px] leading-none text-[#404040]">
            {formatMonth(
              selectedData.requestMonth,
            )}{" "}
            체크인
          </p>

          <p className="mt-[7px] whitespace-nowrap text-[16px] font-medium leading-none">
            총 {selectedData.count}회
          </p>
        </div>
      </div>

      <div className="absolute left-0 top-[300px] h-[40px] w-[300px]">
        {data.map(
          (item, index) => {
            const left =
              data.length > 1
                ? (index /
                    (data.length - 1)) *
                  100
                : 50

            return (
              <div
                key={item.requestMonth}
                className="absolute top-0 h-[40px] w-[2px]"
                style={{
                  left: `calc(${left}% - 1px)`,
                }}
              >
                <div className="h-[14px] w-[2px] bg-[#54555a]" />

                <button
                  aria-label={`${formatMonth(
                    item.requestMonth,
                  )} 선택`}
                  className="absolute left-1/2 top-[12px] -translate-x-1/2 whitespace-nowrap px-[4px] py-[6px] text-[12px] leading-none text-[#54555a]"
                  type="button"
                  onPointerDown={(
                    event,
                  ) => {
                    event.stopPropagation()
                  }}
                  onClick={() =>
                    onSelect(index)
                  }
                >
                  {formatMonth(
                    item.requestMonth,
                  )}
                </button>
              </div>
            )
          },
        )}
      </div>
    </div>
  )
}