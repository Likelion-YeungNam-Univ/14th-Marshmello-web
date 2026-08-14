import { LogOut } from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/shared/components/ui/drawer"

type LogoutDrawerProps = {
  onConfirm: () => void
  onOpenChange: (open: boolean) => void
  open: boolean
}

export function LogoutDrawer({
  onConfirm,
  onOpenChange,
  open,
}: LogoutDrawerProps) {
  return (
    <Drawer onOpenChange={onOpenChange} open={open}>
      <DrawerContent
        className="mx-auto h-[calc(411px+env(safe-area-inset-bottom))] max-h-[calc(100dvh-24px)] w-full max-w-[393px] overflow-hidden rounded-t-[32px] border-0 bg-white pb-[calc(40px+env(safe-area-inset-bottom))] text-[#26292e] shadow-[0_-8px_32px_rgba(241,158,210,0.16)] outline-none data-[vaul-drawer-direction=bottom]:-bottom-[11px]"
        handleClassName="mb-2 h-[5px] w-12 bg-[#91ddcf]"
        overlayClassName="bg-black/[0.18] backdrop-blur-none supports-backdrop-filter:backdrop-blur-none"
      >
        <div className="flex flex-col items-center gap-6 px-8 pt-6 pb-8">
          <div className="flex size-[84px] shrink-0 items-center justify-center rounded-full bg-[#dff5ef]">
            <div className="flex size-14 items-center justify-center rounded-full bg-[#91ddcf] text-white">
              <LogOut aria-hidden="true" className="size-7" strokeWidth={2} />
            </div>
          </div>

          <div className="flex flex-col items-center gap-2.5 text-center">
            <DrawerTitle className="text-[21px] leading-[29.4px] font-semibold tracking-[-0.42px] text-[#26292e]">
              로그아웃 하시겠어요?
            </DrawerTitle>
            <DrawerDescription className="text-[15px] leading-[22.5px] font-normal tracking-[-0.3px] text-[#8a8f96]">
              다시 로그인하면 이어서 이용할 수 있어요.
            </DrawerDescription>
          </div>
        </div>

        <div className="flex flex-col gap-3 px-6">
          <Button
            className="h-[52px] w-full rounded-[15px] bg-[#91ddcf] text-[16px] leading-6 font-semibold text-white shadow-none hover:bg-[#82d3c5] focus-visible:border-[#91ddcf] focus-visible:ring-[#91ddcf]/30"
            onClick={onConfirm}
            type="button"
          >
            로그아웃
          </Button>

          <DrawerClose asChild>
            <Button
              className="h-[47px] w-full rounded-[15px] bg-[#d7d7d7]/80 text-[14px] leading-[21px] font-semibold text-white shadow-none hover:bg-[#cdcdcd]/80 focus-visible:border-[#d7d7d7] focus-visible:ring-[#d7d7d7]/40"
              type="button"
            >
              닫기
            </Button>
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
