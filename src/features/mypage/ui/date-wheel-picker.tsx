import { useEffect, useMemo } from "react"

import { WheelPickerColumn } from "@/features/mypage/ui/wheel-picker-column"

export type WheelDate = {
  day: number
  month: number
  year: number
}

export interface DateWheelPickerProps {
  onChange: (value: WheelDate) => void
  value: WheelDate
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate()
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function getToday() {
  const today = new Date()

  return new Date(today.getFullYear(), today.getMonth(), today.getDate())
}

function getDateParts(date: Date): WheelDate {
  return {
    day: date.getDate(),
    month: date.getMonth() + 1,
    year: date.getFullYear(),
  }
}

function getDateValue({ day, month, year }: WheelDate) {
  return new Date(year, month - 1, day).getTime()
}

const MAX_PREGNANCY_DAYS = 40 * 7

export function DateWheelPicker({
  onChange,
  value,
}: DateWheelPickerProps) {
  const minDate = getToday()
  const maxDate = new Date(minDate)
  maxDate.setDate(maxDate.getDate() + MAX_PREGNANCY_DAYS)
  const minDateParts = getDateParts(minDate)
  const maxDateParts = getDateParts(maxDate)
  const lowerYear = minDateParts.year
  const upperYear = maxDateParts.year
  const year = clamp(value.year, lowerYear, upperYear)
  const month = clamp(value.month, 1, 12)
  const lastDay = getDaysInMonth(year, month)
  const day = clamp(value.day, 1, lastDay)
  const selectedDate = { day, month, year }
  const selectedDateValue = getDateValue(selectedDate)
  const minDateValue = minDate.getTime()
  const maxDateValue = maxDate.getTime()
  const normalizedDate =
    selectedDateValue < minDateValue
      ? minDateParts
      : selectedDateValue > maxDateValue
        ? maxDateParts
        : selectedDate
  const normalizedYear = normalizedDate.year
  const normalizedMonth = normalizedDate.month
  const normalizedDay = normalizedDate.day
  const years = useMemo(
    () =>
      Array.from(
        { length: upperYear - lowerYear + 1 },
        (_, index) => upperYear - index,
      ),
    [lowerYear, upperYear],
  )
  const months = useMemo(
    () => {
      const firstMonth =
        normalizedYear === minDateParts.year ? minDateParts.month : 1
      const lastMonth =
        normalizedYear === maxDateParts.year ? maxDateParts.month : 12

      return Array.from(
        { length: lastMonth - firstMonth + 1 },
        (_, index) => firstMonth + index,
      )
    },
    [maxDateParts.month, maxDateParts.year, minDateParts.month, minDateParts.year, normalizedYear],
  )
  const days = useMemo(
    () => {
      const firstDay =
        normalizedYear === minDateParts.year &&
        normalizedMonth === minDateParts.month
          ? minDateParts.day
          : 1
      const lastAvailableDay =
        normalizedYear === maxDateParts.year &&
        normalizedMonth === maxDateParts.month
          ? maxDateParts.day
          : getDaysInMonth(normalizedYear, normalizedMonth)

      return Array.from(
        { length: lastAvailableDay - firstDay + 1 },
        (_, index) => firstDay + index,
      )
    },
    [maxDateParts.day, maxDateParts.month, maxDateParts.year, minDateParts.day, minDateParts.month, minDateParts.year, normalizedMonth, normalizedYear],
  )

  useEffect(() => {
    if (
      normalizedYear !== value.year ||
      normalizedMonth !== value.month ||
      normalizedDay !== value.day
    ) {
      onChange({ day: normalizedDay, month: normalizedMonth, year: normalizedYear })
    }
  }, [normalizedDay, normalizedMonth, normalizedYear, onChange, value.day, value.month, value.year])

  const changeYear = (nextYear: number) => {
    onChange({
      day: normalizedDay,
      month: normalizedMonth,
      year: nextYear,
    })
  }

  const changeMonth = (nextMonth: number) => {
    onChange({
      day: normalizedDay,
      month: nextMonth,
      year: normalizedYear,
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
            value={normalizedYear}
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
            value={normalizedMonth}
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
            onChange={(nextDay) => onChange({ day: nextDay, month: normalizedMonth, year: normalizedYear })}
            value={normalizedDay}
          />
        </div>
      </div>
    </div>
  )
}
