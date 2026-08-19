import { useEffect, useRef, useState, type FormEvent } from "react"
import { AnimatePresence, motion, type Variants } from "framer-motion"
import { ArrowLeft, CalendarDays, CircleCheck, UserRound } from "lucide-react"
import { useLoaderData, useNavigate } from "react-router-dom"

import { useProfileStore } from "@/features/mypage/model/use-profile-store"
import {
  DateWheelPicker,
  type WheelDate,
} from "@/features/mypage/ui/date-wheel-picker"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import {
  type UserProfile,
  updateUserProfile,
} from "@/shared/api/auth"

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

const SUCCESS_OVERLAY_DURATION_MS = 1200
const SUCCESS_OVERLAY_EXIT_DURATION_MS = 180

export function ProfileEditPage() {
  const navigate = useNavigate()
  const userProfile = useLoaderData() as UserProfile
  const updateProfile = useProfileStore((state) => state.updateProfile)
  const [initialYear, initialMonth, initialDay] = userProfile.expectedDeliveryDate
    .split("-")
    .map(Number)

  const [name, setName] = useState(userProfile.nickname)
  const [date, setDate] = useState<WheelDate>({
    day: initialDay,
    month: initialMonth,
    year: initialYear,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSaveSuccessVisible, setIsSaveSuccessVisible] = useState(false)
  const hideSuccessTimeoutRef = useRef<number | null>(null)
  const navigateTimeoutRef = useRef<number | null>(null)

  useEffect(
    () => () => {
      if (hideSuccessTimeoutRef.current !== null) {
        window.clearTimeout(hideSuccessTimeoutRef.current)
      }

      if (navigateTimeoutRef.current !== null) {
        window.clearTimeout(navigateTimeoutRef.current)
      }
    },
    [],
  )

  const submitProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedName = name.trim()
    if (!trimmedName || isSubmitting) return

    const expectedDeliveryDate = [
      date.year,
      String(date.month).padStart(2, "0"),
      String(date.day).padStart(2, "0"),
    ].join("-")

    try {
      setIsSubmitting(true)

      const updatedProfile = await updateUserProfile({
        expectedDeliveryDate,
        nickname: trimmedName,
      })

      updateProfile({
        dueDate: updatedProfile.expectedDeliveryDate,
        name: updatedProfile.nickname,
      })
      setIsSaveSuccessVisible(true)

      hideSuccessTimeoutRef.current = window.setTimeout(() => {
        setIsSaveSuccessVisible(false)
      }, SUCCESS_OVERLAY_DURATION_MS)

      navigateTimeoutRef.current = window.setTimeout(() => {
        navigate("/mypage", { replace: true })
      }, SUCCESS_OVERLAY_DURATION_MS + SUCCESS_OVERLAY_EXIT_DURATION_MS)
    } catch (error) {
      console.error("회원정보 수정 실패:", error)
      setIsSaveSuccessVisible(false)
      alert("회원정보 수정에 실패했습니다.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="relative mx-auto min-h-dvh w-full max-w-[393px] bg-[linear-gradient(180deg,#fdf8fc_0%,#ffffff_44%)] px-5 pt-5 pb-8 text-[#26292e]">
      <motion.header
        animate="visible"
        className="relative flex h-11 items-center justify-center"
        initial="hidden"
        transition={{ delay: 0.04 }}
        variants={fadeUpVariants}
      >
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
      </motion.header>

      <motion.section
        animate="visible"
        aria-labelledby="profile-edit-title"
        className="mt-8"
        initial="hidden"
        transition={{ delay: 0.1 }}
        variants={fadeUpVariants}
      >
        <h1
          className="text-[22px] leading-[31px] font-semibold tracking-[-0.45px] text-[#26292e]"
          id="profile-edit-title"
        >
          회원정보를 수정해주세요
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
          aria-labelledby="profile-name-label"
          className="rounded-2xl border border-[#eee9ed] bg-white p-5"
          variants={fadeUpVariants}
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
            maxLength={15}
            onChange={(event) => setName(event.target.value)}
            placeholder="닉네임을 입력해 주세요"
            required
            value={name}
          />
          <p
            className="mt-2 text-right text-[11px] leading-[16.5px] text-[#aaa2a7]"
            id="profile-name-helper"
          >
            {name.length}/15
          </p>
        </motion.section>

        <motion.section
          aria-labelledby="due-date-label"
          className="mt-4 rounded-2xl border border-[#eee9ed] bg-white p-5"
          variants={fadeUpVariants}
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
        </motion.section>

        <motion.div className="mt-6" variants={fadeUpVariants}>
          <Button
            className="h-[52px] w-full rounded-xl bg-[#f19ed2] text-[15px] font-semibold tracking-[-0.2px] text-white shadow-none hover:bg-[#ed8dca] focus-visible:border-[#f19ed2] focus-visible:ring-[#f19ed2]/30"
            disabled={!name.trim() || isSubmitting || isSaveSuccessVisible}
            type="submit"
          >
            수정하기
          </Button>
        </motion.div>
      </motion.form>

      <AnimatePresence>
        {isSaveSuccessVisible ? (
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[2px]"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <motion.div
              animate={{ opacity: 1, scale: 1 }}
              className="flex size-24 items-center justify-center rounded-full bg-white shadow-[0_12px_32px_rgba(38,41,46,0.2)]"
              exit={{ opacity: 0, scale: 0.92 }}
              initial={{ opacity: 0, scale: 0.56 }}
              transition={{ type: "spring", stiffness: 360, damping: 22 }}
            >
              <CircleCheck
                aria-label="저장 완료"
                className="size-14 text-[#f19ed2]"
                strokeWidth={1.8}
              />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  )
}
