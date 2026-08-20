import {
  useState,
  type FormEvent,
} from "react"
import {
  motion,
  type Variants,
} from "framer-motion"
import {
  ArrowLeft,
  CalendarDays,
  UserRound,
} from "lucide-react"
import { useNavigate } from "react-router-dom"

import {
  TermsDialog,
} from "@/features/terms-agreement/ui/terms-dialog"
import type {
  TermsAgreementResult,
} from "@/features/terms-agreement/model/types"
import {
  useProfileStore,
} from "@/features/mypage/model/use-profile-store"
import {
  DateWheelPicker,
  type WheelDate,
} from "@/features/mypage/ui/date-wheel-picker"
import {
  updateUserProfile,
} from "@/shared/api/auth"
import {
  Button,
} from "@/shared/components/ui/button"
import {
  Input,
} from "@/shared/components/ui/input"

const fadeUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 14,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
    y: 0,
  },
}

const formVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.16,
      staggerChildren: 0.1,
    },
  },
}

function getToday(): WheelDate {
  const today = new Date()

  return {
    day: today.getDate(),
    month: today.getMonth() + 1,
    year: today.getFullYear(),
  }
}

export function SignupProfilePage() {
  const navigate = useNavigate()

  const updateProfile =
    useProfileStore(
      (state) => state.updateProfile,
    )

  const [name, setName] = useState("")

  const [date, setDate] =
    useState<WheelDate>(getToday)

  const [isSubmitting, setIsSubmitting] =
    useState(false)

  const [isTermsOpen, setIsTermsOpen] =
    useState(false)

  const submitProfile = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    const trimmedName = name.trim()

    if (
      !trimmedName ||
      isSubmitting
    ) {
      return
    }

    // 다음 버튼에서는 저장하지 않고 약관만 표시
    setIsTermsOpen(true)
  }  

  const handleTermsComplete = async (
    result: TermsAgreementResult,
  ) => {
     if (!result.requiredAgreed || isSubmitting) {
      return
    }

    const trimmedName = name.trim()

    if (!trimmedName) {
      setIsTermsOpen(false)
      return
    }  
    const expectedDeliveryDate = [
      date.year,
      String(date.month).padStart(2, "0"),
      String(date.day).padStart(2, "0"),
    ].join("-")

    try {
      setIsSubmitting(true)

      const updatedProfile =
        await updateUserProfile({
          nickname: trimmedName,
          expectedDeliveryDate,
        })

      updateProfile({
        name: updatedProfile.nickname,
        dueDate:
          updatedProfile.expectedDeliveryDate,
      })

      setIsTermsOpen(false)

      navigate("/", {
        replace: true,
      })
    } catch (error) {
      console.error(
        "회원정보 등록 실패:",
        error,
      )

      alert(
        "회원정보 등록에 실패했습니다.",
      )
    } finally {
      setIsSubmitting(false)
    }

  }

  return (
    <>
      <main className="relative mx-auto min-h-dvh w-full max-w-[393px] bg-[linear-gradient(180deg,#fdf8fc_0%,#ffffff_44%)] px-5 pb-8 pt-5 text-[#26292e]">
        <motion.header
          animate="visible"
          className="relative flex h-11 items-center justify-center"
          initial="hidden"
          transition={{ delay: 0.04 }}
          variants={fadeUpVariants}
        >
          <button
            aria-label="로그인 화면으로 돌아가기"
            className="absolute left-0 flex size-10 items-center justify-center rounded-xl text-[#484c52] transition-colors hover:bg-[#f7eef4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f19ed2]/45"
            onClick={() =>
              navigate("/login")
            }
            type="button"
          >
            <ArrowLeft
              aria-hidden="true"
              className="size-5"
              strokeWidth={1.9}
            />
          </button>

          <span className="text-[16px] font-semibold leading-6 tracking-[-0.2px]">
            회원정보 등록
          </span>
        </motion.header>

        <motion.section
          animate="visible"
          aria-labelledby="signup-profile-title"
          className="mt-8"
          initial="hidden"
          transition={{ delay: 0.1 }}
          variants={fadeUpVariants}
        >
          <h1
            className="text-[22px] font-semibold leading-[31px] tracking-[-0.45px] text-[#26292e]"
            id="signup-profile-title"
          >
            회원정보를 등록해주세요
          </h1>

          <p className="mt-1 text-[14px] leading-[21px] tracking-[-0.2px] text-[#7c747a]">
            정확한 정보를 입력하면 더 꼭 맞는 케어를 받을 수 있어요.
          </p>
        </motion.section>

        <motion.form
          animate="visible"
          className="mt-8"
          initial="hidden"
          onSubmit={submitProfile}
          variants={formVariants}
        >
          <motion.section
            aria-labelledby="signup-profile-name-label"
            className="rounded-2xl border border-[#eee9ed] bg-white p-5"
            variants={fadeUpVariants}
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center text-[#e68ec2]">
                <UserRound
                  aria-hidden="true"
                  className="size-[18px]"
                  strokeWidth={1.8}
                />
              </span>

              <div>
                <label
                  className="block text-[15px] font-semibold leading-[22.5px] tracking-[-0.2px] text-[#3d3d3d]"
                  htmlFor="signup-profile-name"
                  id="signup-profile-name-label"
                >
                  닉네임
                </label>
              </div>
            </div>

            <Input
              aria-describedby="signup-profile-name-helper"
              autoComplete="nickname"
              className="mt-4 h-[50px] rounded-xl border-[#e8e2e6] bg-white px-4 text-[15px] font-medium tracking-[-0.2px] text-[#26292e] shadow-none placeholder:text-[#b6a6b1] focus-visible:border-[#f19ed2] focus-visible:ring-3 focus-visible:ring-[#f19ed2]/15"
              id="signup-profile-name"
              maxLength={15}
              onChange={(event) =>
                setName(
                  event.target.value,
                )
              }
              placeholder="닉네임을 입력해 주세요"
              required
              value={name}
            />

            <p
              className="mt-2 text-right text-[11px] leading-[16.5px] text-[#aaa2a7]"
              id="signup-profile-name-helper"
            >
              {name.length}/15
            </p>
          </motion.section>

          <motion.section
            aria-labelledby="signup-profile-due-date-label"
            className="mt-4 rounded-2xl border border-[#eee9ed] bg-white p-5"
            variants={fadeUpVariants}
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center text-[#e68ec2]">
                <CalendarDays
                  aria-hidden="true"
                  className="size-[18px]"
                  strokeWidth={1.8}
                />
              </span>

              <div>
                <h2
                  className="text-[15px] font-semibold leading-[22.5px] tracking-[-0.2px] text-[#3d3d3d]"
                  id="signup-profile-due-date-label"
                >
                  출산 예정일
                </h2>
              </div>
            </div>

            <div className="mt-5 border-t border-[#f1edf0] pt-5">
              <DateWheelPicker
                onChange={setDate}
                value={date}
              />
            </div>
          </motion.section>

          <motion.div
            className="mt-6"
            variants={fadeUpVariants}
          >
            <Button
              className="h-[52px] w-full rounded-xl bg-[#f19ed2] text-[15px] font-semibold tracking-[-0.2px] text-white shadow-none hover:bg-[#ed8dca] focus-visible:border-[#f19ed2] focus-visible:ring-[#f19ed2]/30 disabled:bg-[#f5d7e9]"
              disabled={
                !name.trim() ||
                isSubmitting
              }
              type="submit"
            >
              {isSubmitting
                ? "등록 중..."
                : "다음"}
            </Button>
          </motion.div>
        </motion.form>
      </main>

      <TermsDialog
        open={isTermsOpen}
        onConfirm={handleTermsComplete}
        onOpenChange={setIsTermsOpen}
      />
    </>
  )
}