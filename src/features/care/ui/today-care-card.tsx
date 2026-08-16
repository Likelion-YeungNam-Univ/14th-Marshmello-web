import { motion } from "framer-motion"

import type { TodayCareCardData } from "@/features/care/model/today-care-card"

type TodayCareCardProps = {
  card: TodayCareCardData
}

export function TodayCareCard({ card }: TodayCareCardProps) {
  const layerMotion = (delay: number, y: number, scale: number) => ({
    animate: { opacity: 1, scale: 1, y: 0 },
    initial: { opacity: 0, scale, y },
    transition: {
      delay,
      duration: 1.1,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  })

  return (
    <section
      aria-labelledby="today-care-card-title"
      className="relative h-[398px] w-full"
    >
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 top-[7px] flex h-[436px] items-center justify-center"
        {...layerMotion(0.06, 28, 0.92)}
      >
        <div className="h-[413px] w-full -rotate-[4deg] rounded-[28px] border border-white/55 bg-[#f19ed2]" />
      </motion.div>

      <motion.article
        className="absolute inset-x-0 top-0 flex h-[430px] flex-col rounded-[26px] border border-white/70 bg-[#ffeefe] px-[26px] py-7"
        {...layerMotion(0.28, 42, 0.95)}
      >
        <div className="flex h-[26px] items-center justify-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f19ed2]/12 px-3 py-1 text-[15px] leading-[18px] font-medium tracking-[-0.01em] text-[#484c52]">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-[#91ddcf]" />
            {card.category || "오늘의 케어카드"}
          </span>
        </div>

        <h1
          className="mt-5 text-center text-[21px] leading-[30.45px] font-medium tracking-[-0.01em] text-[#2a2c30]"
          id="today-care-card-title"
        >
          {card.title}
        </h1>

        <div
          aria-hidden="true"
          className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent"
        />

        <p className="mt-6 text-[15px] leading-[27.75px] tracking-[-0.01em] text-[#6b6f76]">
          {card.description}
        </p>

        {card.source || card.createdDate ? (
          <p className="mt-6 text-[12px] leading-[18px] tracking-[-0.01em] text-[#6b6f76]/70">
            {card.source ? `출처: ${card.source}` : null}
            {card.source && card.createdDate ? " · " : null}
            {card.createdDate}
          </p>
        ) : null}
      </motion.article>
    </section>
  )
}
