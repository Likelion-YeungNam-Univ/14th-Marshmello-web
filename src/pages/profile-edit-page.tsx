import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"

import { useProfileStore } from "@/features/mypage/model/use-profile-store"
import {
  DateWheelPicker,
  type WheelDate,
} from "@/features/mypage/ui/date-wheel-picker"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"

export function ProfileEditPage() {
  const navigate = useNavigate()
  const currentName = useProfileStore((state) => state.name)
  const currentDueDate = useProfileStore((state) => state.dueDate)
  const updateProfile = useProfileStore((state) => state.updateProfile)
  const [initialYear, initialMonth, initialDay] = currentDueDate
    .split("-")
    .map(Number)

  const [name, setName] = useState(currentName)
  const [date, setDate] = useState<WheelDate>({
    day: initialDay,
    month: initialMonth,
    year: initialYear,
  })

  const submitProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedName = name.trim()
    if (!trimmedName) return

    updateProfile({
      dueDate: [
        date.year,
        String(date.month).padStart(2, "0"),
        String(date.day).padStart(2, "0"),
      ].join("-"),
      name: trimmedName,
    })
    navigate("/mypage", { replace: true })
  }

  return (
    <main className="relative mx-auto min-h-[852px] w-full max-w-[393px] overflow-hidden px-5 pt-[27px] text-black">
      <h1 className="text-[12px] leading-[1.4] font-medium tracking-[-0.12px]">
        회원정보를 수정해주세요
      </h1>

      <form className="mt-8" onSubmit={submitProfile}>
        <label
          className="block text-[12px] leading-[1.6] font-medium tracking-[-0.24px] text-[#6c7278]"
          htmlFor="profile-name"
        >
          닉네임을 입력해주세요
        </label>
        <Input
          autoComplete="nickname"
          className="mt-0.5 h-[46px] rounded-[10px] border-[#edf1f3] bg-white px-[14px] text-[14px] font-medium tracking-[-0.14px] text-[#1a1c1e] shadow-[0_1px_2px_rgba(228,229,231,0.24)] focus-visible:border-[#f19ed2] focus-visible:ring-[#f19ed2]/20"
          id="profile-name"
          maxLength={20}
          onChange={(event) => setName(event.target.value)}
          required
          value={name}
        />

        <fieldset className="mt-[46px]">
          <legend className="text-[12px] leading-[1.6] font-medium tracking-[-0.24px] text-[#6c7278]">
            출산예정일을 입력해주세요
          </legend>

          <div className="mt-[23px] w-full">
            <DateWheelPicker
              maxYear={2035}
              minYear={2025}
              onChange={setDate}
              value={date}
            />
          </div>
        </fieldset>

        <Button
          className="mt-[101px] h-12 w-full rounded-[10px] bg-[#f19ed2] text-[15px] font-semibold tracking-[-0.15px] text-white shadow-none hover:bg-[#ed8dca] focus-visible:border-[#f19ed2] focus-visible:ring-[#f19ed2]/30"
          disabled={!name.trim()}
          type="submit"
        >
          수정하기
        </Button>
      </form>
    </main>
  )
}
