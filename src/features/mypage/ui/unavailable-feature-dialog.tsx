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
        className="flex h-[234px] w-[300px] max-w-[calc(100%-32px)] flex-col items-center gap-0 overflow-hidden rounded-[10px] border border-[#f32525] bg-white p-0 text-black shadow-none ring-0"
        overlayClassName="bg-black/15 backdrop-blur-none supports-backdrop-filter:backdrop-blur-none"
        showCloseButton={false}
      >
        <div className="mt-16 flex size-14 shrink-0 items-center justify-center rounded-full bg-[#fee2e2] text-[#dc2626]">
          <CircleAlert aria-hidden="true" className="size-7" strokeWidth={2} />
        </div>

        <DialogTitle className="mt-[17px] text-[13px] leading-normal font-medium text-black">
          현재 제공되지 않는 기능입니다.
        </DialogTitle>
        <DialogDescription className="sr-only">
          고객센터 기능은 현재 제공되지 않습니다.
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}
