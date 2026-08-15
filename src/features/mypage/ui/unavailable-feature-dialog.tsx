import { CircleAlert } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/shared/components/ui/dialog"

type UnavailableFeatureDialogProps = {
  onOpenChange: (open: boolean) => void
  open: boolean
}

export function UnavailableFeatureDialog({
  onOpenChange,
  open,
}: UnavailableFeatureDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent
        className="flex w-[300px] max-w-[calc(100%-32px)] flex-col items-center gap-5 rounded-[15px] border-[1.25px] border-[rgba(241,158,210,0.25)] bg-[linear-gradient(159.54deg,#ffffff_58.3%,#fdf1f8_91.51%)] px-8 pt-10 pb-8 text-black shadow-[0_8px_40px_rgba(241,158,210,0.18),0_2px_12px_rgba(0,0,0,0.07)] ring-0"
        overlayClassName="bg-black/15 backdrop-blur-none supports-backdrop-filter:backdrop-blur-none"
        showCloseButton={false}
      >
        <UnavailableFeatureIcon />

        <div className="flex flex-col items-center gap-2 text-center">
          <DialogTitle className="text-[16px] leading-6 font-normal tracking-[-0.3px] text-[#26292e]">
            기능 준비 중이에요
          </DialogTitle>
          <DialogDescription className="text-[13px] leading-[20.8px] text-[#9ca3af]">
            현재 제공되지 않는 기능입니다.
            <br />
            조금만 기다려 주세요.
          </DialogDescription>
        </div>

        <button
          className="h-[47px] w-[234px] rounded-[15px] bg-[#f19ed2] text-[15px] leading-[22.5px] font-semibold tracking-[-0.2px] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f19ed2]/50 focus-visible:ring-offset-2"
          onClick={() => onOpenChange(false)}
          type="button"
        >
          확인
        </button>
      </DialogContent>
    </Dialog>
  )
}

function UnavailableFeatureIcon() {
  return (
    <div className="relative size-[72px] shrink-0">
      <div className="absolute -inset-1 size-[80px] rounded-full bg-[#fbe0f1]/60 blur-[10px]" />
      <div className="absolute inset-0 flex items-center justify-center rounded-full bg-[#fbe0f1]/80">
        <div className="flex size-[52px] items-center justify-center rounded-full bg-[#f6cbe6]">
          <CircleAlert
            aria-hidden="true"
            className="size-6 text-[#a06a91]"
            strokeWidth={2.2}
          />
        </div>
      </div>
    </div>
  )
}
