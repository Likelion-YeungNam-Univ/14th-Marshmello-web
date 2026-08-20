import { motion } from "framer-motion"
import { MessageCircleMore, XIcon } from "lucide-react"

import kakaoQrImage from "@/assets/mypage/support-kakao-qr.png"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/shared/components/ui/dialog"

const KAKAO_CHANNEL_URL = "http://pf.kakao.com/_GZsSX"

type SupportDialogProps = {
  onOpenChange: (open: boolean) => void
  open: boolean
}

export function SupportDialog({
  onOpenChange,
  open,
}: SupportDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent
        className="w-[353px] max-w-[calc(100%-32px)] overflow-hidden rounded-[15px] border border-[rgba(241,158,210,0.25)] bg-[linear-gradient(150.18deg,#ffffff_56.889%,#fdf1f8_84.443%)] p-0 text-black shadow-[0_8px_40px_rgba(241,158,210,0.18),0_2px_12px_rgba(0,0,0,0.07)] ring-0"
        overlayClassName="bg-black/15 backdrop-blur-none supports-backdrop-filter:backdrop-blur-none"
        showCloseButton={false}
      >
        <motion.div
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="flex w-full flex-col items-center gap-5 px-8 pt-10 pb-8"
          initial={{ opacity: 0, scale: 0.94, y: 12 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative size-[72px] shrink-0">
            <div className="absolute -inset-1 size-20 rounded-full bg-[#fbe0f1]/60 blur-[10px]" />
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-[#fbe0f1]/80">
              <div className="flex size-[52px] items-center justify-center rounded-full bg-[#f6cbe6]">
                <MessageCircleMore
                  aria-hidden="true"
                  className="size-7 text-[#a06a91]"
                  strokeWidth={2.1}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 text-center">
            <DialogTitle className="text-[16px] leading-6 font-medium tracking-[-0.3px] text-[#26292e]">
              카카오톡 채널 문의
            </DialogTitle>
            <DialogDescription className="text-[13px] leading-[20.8px] text-[#9ca3af]">
              QR 코드를 스캔하거나
              <br />
              아래 버튼으로 채널을 추가해주세요.
            </DialogDescription>
          </div>

          <div className="flex w-[162px] flex-col rounded-[12px] border border-[rgba(241,158,210,0.2)] bg-white/85 p-3">
            <div className="relative h-[136px] w-[137px] overflow-hidden">
              <img
                alt="풀결 카카오톡 채널 QR 코드"
                className="absolute top-[-40.07%] left-[-52.74%] h-[216.67%] w-[210.07%] max-w-none"
                src={kakaoQrImage}
              />
            </div>
            <p className="flex h-[25px] w-[136px] items-start justify-center pt-2 text-[11px] leading-[16.5px] text-[#c4a0b8]">
              카카오톡 채널 QR
            </p>
          </div>

          <a
            className="flex min-h-[47px] w-full max-w-[287px] items-center justify-center rounded-[15px] bg-[#f19ed2] px-4 py-3 text-[15px] leading-[22.5px] font-semibold tracking-[-0.2px] text-white transition-colors hover:bg-[#ea8bc6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f19ed2]/50 focus-visible:ring-offset-2"
            href={KAKAO_CHANNEL_URL}
            rel="noopener noreferrer"
            target="_blank"
          >
            카카오톡 채널 바로가기
          </a>

          <div className="relative h-[8.5px] w-[134.5px] shrink-0">
            <p className="absolute top-[-7.73px] left-[15.25px] text-[11px] leading-[16.5px] whitespace-nowrap text-[#c4a0b8]">
              24시간 문의 접수 가능
            </p>
          </div>
        </motion.div>

        <DialogClose asChild>
          <button
            aria-label="고객센터 닫기"
            className="absolute top-4 right-[17px] flex size-7 items-center justify-center rounded-full transition-colors hover:bg-[#fbe0f1]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f19ed2]/40"
            type="button"
          >
            <XIcon
              aria-hidden="true"
              className="size-3.5 text-[#c4a0b8]"
              strokeWidth={1.8}
            />
          </button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}
