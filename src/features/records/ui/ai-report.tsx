import {
  BrandFaceIcon,
} from "@/shared/components/ui/splash/face-icon"

type RecordsAiReportProps = {
  monthText: string
  content: string
}

export function RecordsAiReport({
  monthText,
  content,
}: RecordsAiReportProps) {
  return (
    <div className="relative mx-auto mt-[28px] w-[348px] pb-[40px]">
      <div className="relative z-0 min-h-[145px] w-full overflow-visible rounded-[15px] bg-white/90 px-[18px] py-[15px]">
        <p className="text-[13px] font-semibold tracking-[-0.13px] text-[#7a4e88]">
          품결 AI와 함께하는{" "}
          {monthText}
        </p>

        <p className="mt-[7px] pr-[2px] text-[16px] leading-[1.5] tracking-[-0.16px]">
          "{content}"
        </p>

        <div
          aria-hidden="true"
          className="absolute bottom-[-10px] right-[230px] z-0 h-[18px] w-[8px] rotate-[18deg] rounded-br-[14px] bg-white/90"
        />
      </div>

      <div className="pointer-events-none absolute bottom-[-45px] left-[-5px] z-10 size-[92px]">
        <span className="absolute inset-[20px] rounded-full bg-[#f6cbe6]/55 animate-ping" />

        <span className="absolute inset-[14px] rounded-full bg-[#fde7f5]/50" />

        <BrandFaceIcon
          className="relative z-20 size-[92px]"
          haloColor="#fde7f5"
          haloOpacity={0.567147}
          circleColor="#f6cbe6"
          strokeColor="#a06a91"
          strokeWidth={4.15984}
          accentDotAnimated={false}
        />
      </div>
    </div>
  )
}