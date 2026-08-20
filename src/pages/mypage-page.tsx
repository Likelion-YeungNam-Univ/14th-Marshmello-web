import { useCallback, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import {
  ChevronRight,
  Frown,
  Headphones,
  PenLine,
  type LucideIcon,
} from "lucide-react"
import { useNavigate, useOutletContext } from "react-router-dom"

import type { AppOutletContext } from "@/App"
import { useProfileStore } from "@/features/mypage/model/use-profile-store"
import { AccountWithdrawalDialog } from "@/features/mypage/ui/account-withdrawal-dialog"
import { SupportDialog } from "@/features/mypage/ui/support-dialog"
import { ProfileIllustration } from "@/pages/not-found-page"
import { withdrawUser } from "@/shared/api/auth"

type MyPageMenuItem = {
  icon: LucideIcon
  id: "edit-profile" | "withdraw-account" | "support"
  label: string
}

const menuItems: MyPageMenuItem[] = [
  { icon: PenLine, id: "edit-profile", label: "회원정보 수정하기" },
  { icon: Frown, id: "withdraw-account", label: "계정 탈퇴하기" },
  { icon: Headphones, id: "support", label: "고객센터" },
]

const DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24
const PREGNANCY_TOTAL_DAYS = 40 * 7

type MyPageMenuRowProps = MyPageMenuItem & {
  isLast: boolean
  onClick?: () => void
}

function MyPageMenuRow({
  icon: Icon,
  isLast,
  label,
  onClick,
}: MyPageMenuRowProps) {
  return (
    <button
      aria-label={label}
      className={`flex h-[67px] w-full items-center gap-4 px-5 text-[#3d3d3d] transition-colors hover:bg-white/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f19ed2]/40 ${
        isLast ? "" : "border-b-2 border-white"
      }`}
      onClick={onClick}
      type="button"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-[12px] bg-[#fdf2f8] text-[#f19ed2]">
        <Icon aria-hidden="true" className="size-5" strokeWidth={1.7} />
      </span>

      <span className="text-[15px] leading-[22.5px]">{label}</span>

      <ChevronRight
        aria-hidden="true"
        className="ml-auto size-4 shrink-0 text-[#858b91]"
        strokeWidth={1.8}
      />
    </button>
  )
}

export function MyPage() {
  const [isSupportDialogOpen, setIsSupportDialogOpen] = useState(false)
  const [isWithdrawalDialogOpen, setIsWithdrawalDialogOpen] = useState(false)
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { restartSplash } = useOutletContext<AppOutletContext>()
  const name = useProfileStore((state) => state.name)
  const dueDate = useProfileStore((state) => state.dueDate)
  const today = new Date()
  const todayInUtc = Date.UTC(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  )
  const dueDateValue = new Date(dueDate)
  const dueDateInUtc = Date.UTC(
    dueDateValue.getFullYear(),
    dueDateValue.getMonth(),
    dueDateValue.getDate(),
  )
  const remainingDays = Math.max(
    0,
    Math.ceil((dueDateInUtc - todayInUtc) / DAY_IN_MILLISECONDS),
  )
  const pregnancyDays = PREGNANCY_TOTAL_DAYS - remainingDays
  const pregnancyWeek = Math.floor(pregnancyDays / 7)

  const completeWithdrawal = useCallback(() => {
    queryClient.clear()
    useProfileStore.getState().reset()
    window.localStorage.clear()
    window.sessionStorage.clear()
    navigate("/", { replace: true })
    restartSplash()
  }, [navigate, queryClient, restartSplash])

  const withdraw = useCallback(async () => {
    setIsWithdrawing(true)

    try {
      await withdrawUser()
    } finally {
      setIsWithdrawing(false)
    }
  }, [])

  return (
    <>
      <section
        aria-labelledby="mypage-user-name"
        className="mx-auto min-h-[calc(100dvh-82px)] w-full max-w-[393px] px-5 pt-[69px]"
      >
        <div className="flex flex-col items-center text-center">
          <div className="relative size-[100px] shrink-0">
            <ProfileIllustration
              className="absolute inset-0 size-full overflow-visible"
              coreColor="#fcebf5"
              faceColor="#000000"
              haloColor="#ffe5f5"
              orbitColor="transparent"
              orbitShadowColor="#fbe0f2"
            />
          </div>

          <h1
            className="mt-6 text-[16px] leading-6 font-bold text-[#181d27]"
            id="mypage-user-name"
          >
            {name}님
          </h1>
          <p className="mt-[3px] text-[13px] leading-[19.5px] text-[#9d8d9d]">
            아기와 함께한 지 {pregnancyWeek}주째
          </p>
        </div>

        <ul
          aria-label="마이페이지 메뉴"
          className="mt-[51px] w-full overflow-hidden rounded-[16px] border-2 border-white bg-white/90"
        >
          {menuItems.map((item, index) => (
            <li key={item.id}>
              <MyPageMenuRow
                {...item}
                isLast={index === menuItems.length - 1}
                onClick={
                  item.id === "withdraw-account"
                    ? () => setIsWithdrawalDialogOpen(true)
                    : item.id === "edit-profile"
                      ? () => navigate("/mypage/edit")
                      : () => setIsSupportDialogOpen(true)
                }
              />
            </li>
          ))}
        </ul>
      </section>

      <AccountWithdrawalDialog
        isWithdrawing={isWithdrawing}
        onComplete={completeWithdrawal}
        onOpenChange={setIsWithdrawalDialogOpen}
        onWithdraw={withdraw}
        open={isWithdrawalDialogOpen}
      />

      <SupportDialog
        onOpenChange={setIsSupportDialogOpen}
        open={isSupportDialogOpen}
      />
    </>
  )
}
