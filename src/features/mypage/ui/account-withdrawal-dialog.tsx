import { useEffect, useState } from "react"
import { CircleCheck, TriangleAlert } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/shared/components/ui/dialog"

const COMPLETE_DIALOG_DURATION_MS = 1500

type AccountWithdrawalDialogProps = {
  onComplete: () => void
  onOpenChange: (open: boolean) => void
  open: boolean
}

type DialogStep = "confirm" | "complete"

export function AccountWithdrawalDialog({
  onComplete,
  onOpenChange,
  open,
}: AccountWithdrawalDialogProps) {
  const [step, setStep] = useState<DialogStep>("confirm")
  const isComplete = step === "complete"

  useEffect(() => {
    if (!open || !isComplete) {
      return
    }

    const timer = window.setTimeout(onComplete, COMPLETE_DIALOG_DURATION_MS)

    return () => window.clearTimeout(timer)
  }, [isComplete, onComplete, open])

  const closeDialog = () => {
    setStep("confirm")
    onOpenChange(false)
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && !isComplete) {
      closeDialog()
    }
  }

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogContent
        className={`flex h-[234px] w-[300px] max-w-[calc(100%-32px)] flex-col items-center gap-0 overflow-hidden rounded-[10px] border bg-white p-0 text-black shadow-none ring-0 ${
          isComplete ? "border-[#16a34a]" : "border-[#ca8a04]"
        }`}
        onEscapeKeyDown={(event) => {
          if (isComplete) event.preventDefault()
        }}
        onInteractOutside={(event) => {
          if (isComplete) event.preventDefault()
        }}
        overlayClassName="bg-black/15 backdrop-blur-none supports-backdrop-filter:backdrop-blur-none"
        showCloseButton={false}
      >
        {isComplete ? (
          <>
            <div className="mt-16 flex size-14 shrink-0 items-center justify-center rounded-full bg-[#dcfce7] text-[#16a34a]">
              <CircleCheck aria-hidden="true" className="size-7" strokeWidth={2} />
            </div>
            <DialogTitle className="mt-6 text-[13px] leading-normal font-medium text-black">
              완료되었습니다
            </DialogTitle>
            <DialogDescription className="sr-only">
              회원 탈퇴가 완료되어 로그아웃됩니다.
            </DialogDescription>
          </>
        ) : (
          <>
            <div className="mt-16 flex size-14 shrink-0 items-center justify-center rounded-full bg-[#fef9c3] text-[#ca8a04]">
              <TriangleAlert aria-hidden="true" className="size-7" strokeWidth={2} />
            </div>
            <DialogTitle className="mt-[17px] text-[13px] leading-normal font-medium text-black">
              정말 탈퇴하시겠습니까?
            </DialogTitle>
            <DialogDescription className="sr-only">
              회원 탈퇴 여부를 선택해 주세요.
            </DialogDescription>

            <div className="mt-[11px] flex gap-[15px]">
              <button
                className="h-[26px] w-[54px] rounded-[10px] border-[0.5px] border-[#484c52] bg-white text-[12px] leading-none text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ca8a04]/40"
                onClick={() => setStep("complete")}
                type="button"
              >
                예
              </button>
              <button
                className="h-[26px] w-[54px] rounded-[10px] border-[0.5px] border-[#484c52] bg-white text-[11px] leading-none text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#484c52]/30"
                onClick={closeDialog}
                type="button"
              >
                아니요
              </button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
