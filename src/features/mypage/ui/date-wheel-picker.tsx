import { useEffect, useMemo } from "react"

import { WheelPickerColumn } from "@/features/mypage/ui/wheel-picker-column"

export type WheelDate = {
  day: number
  month: number
  year: number
}

export interface DateWheelPickerProps {
  maxYear?: number
  minYear?: number
  onChange: (value: WheelDate) => void
  value: WheelDate
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate()
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export function DateWheelPicker({
  maxYear = 2035,
  minYear = 2025,
  onChange,
  value,
}: DateWheelPickerProps) {
  const lowerYear = Math.min(minYear, maxYear)
  const upperYear = Math.max(minYear, maxYear)
  const year = clamp(value.year, lowerYear, upperYear)
  const month = clamp(value.month, 1, 12)
  const lastDay = getDaysInMonth(year, month)
  const day = clamp(value.day, 1, lastDay)
  const years = useMemo(
    () =>
      Array.from(
        { length: upperYear - lowerYear + 1 },
        (_, index) => upperYear - index,
      ),
    [lowerYear, upperYear],
  )
  const months = useMemo(
    () => Array.from({ length: 12 }, (_, index) => index + 1),
    [],
  )
  const days = useMemo(
    () => Array.from({ length: lastDay }, (_, index) => index + 1),
    [lastDay],
  )

  useEffect(() => {
    if (year !== value.year || month !== value.month || day !== value.day) {
      onChange({ day, month, year })
    }
  }, [day, month, onChange, value.day, value.month, value.year, year])

  const changeYear = (nextYear: number) => {
    onChange({
      day: Math.min(day, getDaysInMonth(nextYear, month)),
      month,
      year: nextYear,
    })
  }

  const changeMonth = (nextMonth: number) => {
    onChange({
      day: Math.min(day, getDaysInMonth(year, nextMonth)),
      month: nextMonth,
      year,
    })
  }

  return (
    <div aria-label="출산 예정일 선택" className="grid w-full grid-cols-3 gap-3" role="group">
      <div className="flex min-w-0 flex-col items-center">
        <span className="text-[12px] leading-[18px] font-medium text-[#7c747a]">
          년
        </span>
        <div className="mt-3 w-full">
          <WheelPickerColumn
            ariaLabel="연도 선택"
            items={years}
            onChange={changeYear}
            value={year}
          />
        </div>
      </div>

      <div className="flex min-w-0 flex-col items-center">
        <span className="text-[12px] leading-[18px] font-medium text-[#7c747a]">
          월
        </span>
        <div className="mt-3 w-full">
          <WheelPickerColumn
            ariaLabel="월 선택"
            items={months}
            onChange={changeMonth}
            value={month}
          />
        </div>
      </div>

      <div className="flex min-w-0 flex-col items-center">
        <span className="text-[12px] leading-[18px] font-medium text-[#7c747a]">
          일
        </span>
        <div className="mt-3 w-full">
          <WheelPickerColumn
            ariaLabel="일 선택"
            items={days}
            onChange={(nextDay) => onChange({ day: nextDay, month, year })}
            value={day}
          />
        </div>
      </div>
    </div>
  )
}
