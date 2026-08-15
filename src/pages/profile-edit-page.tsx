import { useState, type FormEvent } from "react"
import { ArrowLeft, CalendarDays, UserRound } from "lucide-react"
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
    <main className="relative mx-auto min-h-dvh w-full max-w-[393px] bg-[linear-gradient(180deg,#fdf8fc_0%,#ffffff_44%)] px-5 pt-5 pb-8 text-[#26292e]">
      <header className="relative flex h-11 items-center justify-center">
        <button
          aria-label="마이페이지로 돌아가기"
          className="absolute left-0 flex size-10 items-center justify-center rounded-xl text-[#484c52] transition-colors hover:bg-[#f7eef4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f19ed2]/45"
          onClick={() => navigate("/mypage")}
          type="button"
        >
          <ArrowLeft aria-hidden="true" className="size-5" strokeWidth={1.9} />
        </button>

        <span className="text-[16px] leading-6 font-semibold tracking-[-0.2px]">
          회원정보 수정
        </span>
      </header>

      <section aria-labelledby="profile-edit-title" className="mt-8">
        <h1
          className="text-[22px] leading-[31px] font-semibold tracking-[-0.45px] text-[#26292e]"
          id="profile-edit-title"
        >
          회원정보를 수정해주세요
        </h1>
        <p className="mt-1 text-[14px] leading-[21px] tracking-[-0.2px] text-[#7c747a]">
          정확한 정보를 입력하면 더 꼭 맞는 케어를 받을 수 있어요.
        </p>
      </section>

      <form className="mt-8" onSubmit={submitProfile}>
        <section
          aria-labelledby="profile-name-label"
          className="rounded-2xl border border-[#eee9ed] bg-white p-5"
        >
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center text-[#e68ec2]">
              <UserRound aria-hidden="true" className="size-[18px]" strokeWidth={1.8} />
            </span>
            <div>
              <label
                className="block text-[15px] leading-[22.5px] font-semibold tracking-[-0.2px] text-[#3d3d3d]"
                htmlFor="profile-name"
                id="profile-name-label"
              >
                닉네임
              </label>

            </div>
          </div>

          <Input
            aria-describedby="profile-name-helper"
            autoComplete="nickname"
            className="mt-4 h-[50px] rounded-xl border-[#e8e2e6] bg-white px-4 text-[15px] font-medium tracking-[-0.2px] text-[#26292e] shadow-none placeholder:text-[#b6a6b1] focus-visible:border-[#f19ed2] focus-visible:ring-3 focus-visible:ring-[#f19ed2]/15"
            id="profile-name"
            maxLength={20}
            onChange={(event) => setName(event.target.value)}
            placeholder="닉네임을 입력해 주세요"
            required
            value={name}
          />
          <p
            className="mt-2 text-right text-[11px] leading-[16.5px] text-[#aaa2a7]"
            id="profile-name-helper"
          >
            {name.length}/20
          </p>
        </section>

        <section
          aria-labelledby="due-date-label"
          className="mt-4 rounded-2xl border border-[#eee9ed] bg-white p-5"
        >
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center text-[#e68ec2]">
              <CalendarDays aria-hidden="true" className="size-[18px]" strokeWidth={1.8} />
            </span>
            <div>
              <h2
                className="text-[15px] leading-[22.5px] font-semibold tracking-[-0.2px] text-[#3d3d3d]"
                id="due-date-label"
              >
                출산 예정일
              </h2>

            </div>
          </div>

          <div className="mt-5 border-t border-[#f1edf0] pt-5">
            <DateWheelPicker
              maxYear={2035}
              minYear={2025}
              onChange={setDate}
              value={date}
            />
          </div>
        </section>

        <Button
          className="mt-6 h-[52px] w-full rounded-xl bg-[#f19ed2] text-[15px] font-semibold tracking-[-0.2px] text-white shadow-none hover:bg-[#ed8dca] focus-visible:border-[#f19ed2] focus-visible:ring-[#f19ed2]/30"
          disabled={!name.trim()}
          type="submit"
        >
          수정하기
        </Button>
      </form>
    </main>
  )
}
