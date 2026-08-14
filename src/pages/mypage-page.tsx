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
import profilePlaceholder from "@/assets/mypage/profile-placeholder.svg"
import { useProfileStore } from "@/features/mypage/model/use-profile-store"
import { AccountWithdrawalDialog } from "@/features/mypage/ui/account-withdrawal-dialog"
import { UnavailableFeatureDialog } from "@/features/mypage/ui/unavailable-feature-dialog"

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

type MyPageMenuRowProps = MyPageMenuItem & {
  onClick?: () => void
}

function MyPageMenuRow({ icon: Icon, label, onClick }: MyPageMenuRowProps) {
  return (
    <button
      aria-label={label}
      className="flex h-[54px] w-full items-center border-b border-[#e8e8e8] text-[#555] transition-colors hover:text-[#181d27] focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f19ed2]/40"
      onClick={onClick}
      type="button"
    >
      <span className="ml-4 flex size-6 shrink-0 items-center justify-center">
        <Icon aria-hidden="true" className="size-6" strokeWidth={1.7} />
      </span>

      <span aria-hidden="true" className="ml-[15px] h-9 w-px bg-[#e8e8e8]" />

      <span className="ml-[15px] text-[16px] leading-[19.5px]">{label}</span>

      <ChevronRight
        aria-hidden="true"
        className="ml-auto mr-[5px] size-6 shrink-0"
        strokeWidth={1.7}
      />
    </button>
  )
}

export function MyPage() {
  const [isSupportDialogOpen, setIsSupportDialogOpen] = useState(false)
  const [isWithdrawalDialogOpen, setIsWithdrawalDialogOpen] = useState(false)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { restartSplash } = useOutletContext<AppOutletContext>()
  const email = useProfileStore((state) => state.email)
  const name = useProfileStore((state) => state.name)

  const completeWithdrawal = useCallback(() => {
    queryClient.clear()
    useProfileStore.getState().reset()
    window.localStorage.clear()
    window.sessionStorage.clear()
    navigate("/", { replace: true })
    restartSplash()
  }, [navigate, queryClient, restartSplash])

  return (
    <>
      <section
        aria-labelledby="mypage-user-name"
        className="mx-auto min-h-[calc(100svh-82px)] w-full max-w-[393px] px-5 pt-[117px]"
      >
        <div className="flex flex-col items-center text-center">
          <img
            alt={`${name} 프로필`}
            className="size-[72px] shrink-0"
            src={profilePlaceholder}
          />

          <h1
            className="mt-[21px] text-[16px] leading-6 font-bold text-[#181d27]"
            id="mypage-user-name"
          >
            {name}님
          </h1>
          <p className="text-[13px] leading-[19.5px] text-[#ababab]">
            {email}
          </p>
        </div>

        <ul aria-label="마이페이지 메뉴" className="mt-10 w-[343px] max-w-full">
          {menuItems.map((item) => (
            <li className="mb-[11px] last:mb-0" key={item.id}>
              <MyPageMenuRow
                {...item}
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
        onComplete={completeWithdrawal}
        onOpenChange={setIsWithdrawalDialogOpen}
        open={isWithdrawalDialogOpen}
      />

      <UnavailableFeatureDialog
        onOpenChange={setIsSupportDialogOpen}
        open={isSupportDialogOpen}
      />
    </>
  )
}
