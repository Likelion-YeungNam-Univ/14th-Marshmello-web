import type {
  ReactNode,
} from "react"

type TimelineImageSectionProps = {
  title: string
  children: ReactNode
}

export function TimelineImageSection({
  title,
  children,
}: TimelineImageSectionProps) {
  return (
    <section className="bg-white px-[44px] pb-[49px] pt-[48px]">
      <h2 className="text-[16px] font-medium tracking-[-0.16px] text-black">
        {title}
      </h2>

      <div className="mt-[13px] min-h-[270px] w-full overflow-hidden rounded-[5px] bg-[#d9d9d9]">
        {children}
      </div>
    </section>
  )
}