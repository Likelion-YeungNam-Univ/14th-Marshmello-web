import type { ReactNode } from "react"
import { AnimatePresence, motion } from "framer-motion"

export type CheckinDirection = 1 | -1

interface CheckinStepAnimationProps{
  step : number
  direction: CheckinDirection
  children: ReactNode
}

{/*상태에 따른 객체별 애니메이션 속성 부여*/}
const pageVariants = {
  enter : (direction : CheckinDirection) => ({
    x: direction > 0 ? 32 : -32,
    opacity: 0,
    scale: 0.985,
  }),

  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },

  exit: (direction: CheckinDirection) => ({
    x: direction > 0 ? -24 : 24,
    opacity: 0,
    scale: 0.985,
  }),
}

const pageTransition = {
  duration: 0.18,
  ease: [0.22, 1, 0.36, 1] as const,
}

export function CheckinAnimation({
  step,
  direction,
  children,
}: CheckinStepAnimationProps) {
  return (
    <div className="w-full overflow-hidden">
      <AnimatePresence mode="wait" initial={false} custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={pageVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={pageTransition}
          className="flex w-full flex-col items-center"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

