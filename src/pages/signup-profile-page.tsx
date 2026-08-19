import { useState, type FormEvent } from "react"
import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { useProfileStore } from "@/features/mypage/model/use-profile-store"
import {
  DateWheelPicker,
  type WheelDate,
} from "@/features/mypage/ui/date-wheel-picker"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { updateUserProfile } from "@/shared/api/auth"
import { TermsDialog } from "@/features/terms-agreement/ui/terms-dialog"

export function SignupProfilePage() {
  const navigate = useNavigate()

  const updateProfile = useProfileStore((state) => state.updateProfile)

  const [name, setName] = useState("")

  const [date, setDate] = useState<WheelDate>({
    day: 1,
    month: 1,
    year: 2026,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  // 약관 팝업 표시 여부
  const [isTermsOpen, setIsTermsOpen] = useState(false)

  const submitProfile = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    const trimmedName = name.trim()

    if (!trimmedName || isSubmitting) {
      return
    }

    const expectedDeliveryDate = [
      date.year,
      String(date.month).padStart(2, "0"),
      String(date.day).padStart(2, "0"),
    ].join("-")

    try {
      setIsSubmitting(true)

      // 백엔드 회원정보 등록
      const updatedProfile = await updateUserProfile({
        nickname: trimmedName,
        expectedDeliveryDate,
      })

      // 프론트 상태 저장
      updateProfile({
        name: updatedProfile.nickname,
        dueDate: updatedProfile.expectedDeliveryDate,
      })

      // 팝업 띄우기
      setIsTermsOpen(true)
    } catch (error) {
      console.error("회원정보 등록 실패:", error)
      alert("회원정보 등록에 실패했습니다.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTermsComplete = () => {
    setIsTermsOpen(false)

    navigate("/care", {
      replace: true,
    })
  }

  return (
    <>
      <main className="relative mx-auto min-h-[852px] w-full max-w-[393px] overflow-hidden px-5 pt-[27px] text-black">
        <button
          aria-label="로그인 화면으로 돌아가기"
          className="flex size-6 items-center justify-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f19ed2]/40"
          onClick={() => navigate("/login")}
          type="button"
        >
          <ArrowLeft
            aria-hidden="true"
            className="size-6"
            strokeWidth={1.8}
          />
        </button>

        <h1 className="mt-8 text-[12px] leading-[1.4] font-medium tracking-[-0.12px]">
          회원정보를 등록해주세요
        </h1>

        <form className="mt-8" onSubmit={submitProfile}>
          <label
            className="block text-[12px] leading-[1.6] font-medium tracking-[-0.24px] text-[#6c7278]"
            htmlFor="signup-profile-name"
          >
            닉네임을 입력해주세요
          </label>

          <Input
            autoComplete="nickname"
            className="mt-0.5 h-[46px] rounded-[10px] border-[#edf1f3] bg-white px-[14px] text-[14px] font-medium tracking-[-0.14px] text-[#1a1c1e] shadow-[0_1px_2px_rgba(228,229,231,0.24)] focus-visible:border-[#f19ed2] focus-visible:ring-[#f19ed2]/20"
            id="signup-profile-name"
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
                onChange={setDate}
                value={date}
              />
            </div>
          </fieldset>

          <Button
            className="mt-[101px] h-12 w-full rounded-[10px] bg-[#f19ed2] text-[15px] font-semibold tracking-[-0.15px] text-white shadow-none hover:bg-[#ed8dca] focus-visible:border-[#f19ed2] focus-visible:ring-[#f19ed2]/30"
            disabled={!name.trim() || isSubmitting}
            type="submit"
          >
            {isSubmitting ? "등록 중..." : "다음"}
          </Button>
        </form>
      </main>

      <TermsDialog
        open={isTermsOpen}
        onOpenChange={setIsTermsOpen}
        onConfirm={handleTermsComplete}
      />
    </>
  )
}
