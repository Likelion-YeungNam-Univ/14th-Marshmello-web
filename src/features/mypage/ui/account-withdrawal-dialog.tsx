import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { CircleCheck, TriangleAlert } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/shared/components/ui/dialog"

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
        className={`w-[300px] max-w-[calc(100%-32px)] overflow-hidden rounded-[15px] border-[1.25px] bg-[linear-gradient(159.54deg,#ffffff_58.3%,#fdf1f8_91.51%)] p-0 text-black shadow-[0_8px_40px_rgba(241,158,210,0.18),0_2px_12px_rgba(0,0,0,0.07)] ring-0 ${
          isComplete
            ? "gap-5 border-[rgba(125,211,192,0.25)]"
            : "gap-[29px] border-[rgba(255,234,85,0.25)]"
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
        <AnimatePresence mode="wait">
          <motion.div
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className={`flex w-full flex-col items-center px-8 pt-10 pb-8 ${
              isComplete ? "gap-5" : "gap-[29px]"
            }`}
            exit={{ opacity: 0, scale: 0.98, y: -4 }}
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            key={isComplete ? "complete" : "confirm"}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
        {isComplete ? (
          <>
            <CompletionIcon />

            <div className="flex flex-col items-center gap-2 text-center">
              <DialogTitle className="text-[16px] leading-6 font-normal tracking-[-0.3px] text-[#26292e]">
                탈퇴가 완료되었습니다
              </DialogTitle>
              <DialogDescription className="text-[13px] leading-[20.8px] text-[#9ca3af]">
                그동안 소중한 변화의 순간을
                <br />
                함께해 주셔서 감사합니다.
              </DialogDescription>
            </div>

            <button
              className="h-[47px] w-[234px] rounded-[15px] bg-[#7dd3c0] text-[14px] leading-[21px] font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7dd3c0]/50 focus-visible:ring-offset-2"
              onClick={onComplete}
              type="button"
            >
              확인
            </button>
          </>
        ) : (
          <>
            <WithdrawalAlertIcon />

            <div className="flex flex-col items-center gap-2 text-center">
              <DialogTitle className="text-[16px] leading-6 font-normal tracking-[-0.3px] text-[#26292e]">
                정말 탈퇴하시겠습니까?
              </DialogTitle>
              <DialogDescription className="text-[13px] leading-[21.45px] text-[#ababab]">
                탈퇴 후에는 계정 정보를 복구할 수 없어요.
              </DialogDescription>
            </div>

            <div className="flex w-[234px] gap-2.5">
              <button
                className="h-[50px] w-[114px] rounded-[15px] border-[1.25px] border-[#e5e7eb] bg-[#fafafa] text-[14px] leading-[21px] font-medium text-[#6b7280] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ca8a04]/40"
                onClick={() => setStep("complete")}
                type="button"
              >
                탈퇴할게요
              </button>
              <button
                className="h-[50px] w-[114px] rounded-[15px] bg-[#f59e0b] text-[14px] leading-[21px] font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f59e0b]/50 focus-visible:ring-offset-2"
                onClick={closeDialog}
                type="button"
              >
                취소
              </button>
            </div>
          </>
        )}
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}

function CompletionIcon() {
  return (
    <div className="relative size-[72px] shrink-0">
      <div className="absolute -inset-[7px] size-[86px] rounded-full bg-[#7dd3c0]/40 blur-[16.8px]" />
      <div className="absolute inset-0 rounded-full bg-[#dff5ef]" />
      <div className="absolute inset-[12px] flex items-center justify-center rounded-full bg-[#7dd3c0] shadow-[0_6px_7px_rgba(79,184,163,0.35)]">
        <CircleCheck aria-hidden="true" className="size-[26px] text-white" strokeWidth={2.6} />
      </div>
    </div>
  )
}

function WithdrawalAlertIcon() {
  return (
    <div className="relative size-[72px] shrink-0">
      <div className="absolute -inset-[7px] size-[86px] rounded-full bg-[#fcd34d]/45 blur-[16.8px]" />
      <div className="absolute inset-0 rounded-full bg-[#fef9c3]" />
      <div className="absolute inset-[12px] flex items-center justify-center rounded-full bg-[#fef08a] shadow-[0_6px_7px_rgba(202,138,4,0.3)]">
        <TriangleAlert aria-hidden="true" className="h-[21px] w-6 text-[#ca8a04]" strokeWidth={2} />
      </div>
    </div>
  )
}
