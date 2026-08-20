import {
  AnimatePresence,
  motion,
} from "framer-motion"
import {
  TriangleAlert,
} from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/shared/components/ui/dialog"

type DeleteRecordDialogProps = {
  isDeleting: boolean
  onDelete: () => void
  onOpenChange: (
    open: boolean,
  ) => void
  open: boolean
}

export function DeleteRecordDialog({
  isDeleting,
  onDelete,
  onOpenChange,
  open,
}: DeleteRecordDialogProps) {
  const handleOpenChange = (
    nextOpen: boolean,
  ) => {
    if (!isDeleting) {
      onOpenChange(nextOpen)
    }
  }

  return (
    <Dialog
      onOpenChange={
        handleOpenChange
      }
      open={open}
    >
      <DialogContent
        className="w-[300px] max-w-[calc(100%-32px)] gap-[29px] overflow-hidden rounded-[15px] border-[1.25px] border-[rgba(255,234,85,0.25)] bg-[linear-gradient(159.54deg,#ffffff_58.3%,#fdf1f8_91.51%)] p-0 text-black shadow-[0_8px_40px_rgba(241,158,210,0.18),0_2px_12px_rgba(0,0,0,0.07)] ring-0"
        overlayClassName="bg-black/15 backdrop-blur-none supports-backdrop-filter:backdrop-blur-none"
        showCloseButton={false}
      >
        <AnimatePresence mode="wait">
          <motion.div
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            className="flex w-full flex-col items-center gap-[29px] px-8 pt-10 pb-8"
            exit={{
              opacity: 0,
              scale: 0.98,
              y: -4,
            }}
            initial={{
              opacity: 0,
              scale: 0.94,
              y: 12,
            }}
            key="delete-record-confirm"
            transition={{
              duration: 0.28,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
          >
            <DeleteAlertIcon />

            <div className="flex flex-col items-center gap-2 text-center">
              <DialogTitle className="text-[16px] leading-6 font-normal tracking-[-0.3px] text-[#26292e]">
                기록을 삭제하시겠습니까?
              </DialogTitle>

              <DialogDescription className="text-[13px] leading-[21.45px] text-[#ababab]">
                삭제 후에는 기록을 복구할 수 없어요.
              </DialogDescription>
            </div>

            <div className="flex w-[234px] gap-2.5">
              <button
                className="h-[50px] w-[114px] rounded-[15px] border-[1.25px] border-[#e5e7eb] bg-[#fafafa] text-[14px] leading-[21px] font-medium text-[#6b7280] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ca8a04]/40 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isDeleting}
                onClick={onDelete}
                type="button"
              >
                {isDeleting
                  ? "삭제 중..."
                  : "삭제할게요"}
              </button>

              <button
                className="h-[50px] w-[114px] rounded-[15px] bg-[#f59e0b] text-[14px] leading-[21px] font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f59e0b]/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isDeleting}
                onClick={() =>
                  onOpenChange(
                    false,
                  )
                }
                type="button"
              >
                취소
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}

function DeleteAlertIcon() {
  return (
    <div className="relative size-[72px] shrink-0">
      <div className="absolute -inset-[7px] size-[86px] rounded-full bg-[#fcd34d]/45 blur-[16.8px]" />
      <div className="absolute inset-0 rounded-full bg-[#fef9c3]" />
      <div className="absolute inset-[12px] flex items-center justify-center rounded-full bg-[#fef08a] shadow-[0_6px_7px_rgba(202,138,4,0.3)]">
        <TriangleAlert
          aria-hidden="true"
          className="h-[21px] w-6 text-[#ca8a04]"
          strokeWidth={2}
        />
      </div>
    </div>
  )
}
