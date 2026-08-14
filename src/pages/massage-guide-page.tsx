import { useEffect, useRef, useState, type PropsWithChildren } from "react"
import {
  AnimatePresence,
  motion,
  MotionConfig,
  type Variants,
} from "framer-motion"
import { ChevronLeft } from "lucide-react"
import { Link } from "react-router-dom"

import bellyCircleIllustration from "@/assets/massage-guide/belly-circle-massage.png"
import completionCheckIcon from "@/assets/massage-guide/completion-check.svg"
import finishingBellyIllustration from "@/assets/massage-guide/finishing-belly-stroke.png"
import handWarmingIllustration from "@/assets/massage-guide/hand-warming.png"
import introIllustration from "@/assets/massage-guide/intro-illustration.png"
import pelvicLineIllustration from "@/assets/massage-guide/pelvic-line-press.png"
import sideSweepIllustration from "@/assets/massage-guide/side-sweep-up.png"
import Illustration from "@/features/massage-guide/ui/illustration"
import { Button } from "@/shared/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/shared/components/ui/dialog"

const SCREEN_DURATION_MS = 5000
const STEP_FRAME_CLASS_NAME =
  "mx-auto h-[852px] w-full max-w-[393px] overflow-hidden bg-transparent"
const STEP_HEADER_CLASS_NAME =
  "relative z-10 flex h-[66px] items-center justify-between bg-[#e8c5e5] px-5 pt-6"
const STEP_CONTENT_CLASS_NAME =
  "relative mt-5 h-[744px] rounded-t-[26px] bg-white px-7 pt-8"
const STEP_HINT_CLASS_NAME =
  "absolute right-7 bottom-7 left-7 text-center text-[13px] leading-[19.5px] text-[#a8a290]"

const stepCardVariants: Variants = {
  enter: {
    opacity: 0,
  },
  center: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
}

function MassageStepCard({ children }: PropsWithChildren) {
  return (
    <motion.section
      animate="center"
      className={STEP_CONTENT_CLASS_NAME}
      exit="exit"
      initial="enter"
      variants={stepCardVariants}
    >
      {children}
    </motion.section>
  )
}

function useTimedProgress(onComplete: () => void, durationMs: number) {
  const [progress, setProgress] = useState(0)
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    let animationFrameId = 0
    let isActive = true
    const startedAt = window.performance.now()

    setProgress(0)

    const updateProgress = (currentTime: number) => {
      if (!isActive) return

      const elapsedTime = currentTime - startedAt
      const nextProgress = Math.min((elapsedTime / durationMs) * 100, 100)

      setProgress(nextProgress)

      if (nextProgress >= 100) {
        onCompleteRef.current()
        return
      }

      animationFrameId = window.requestAnimationFrame(updateProgress)
    }

    animationFrameId = window.requestAnimationFrame(updateProgress)

    return () => {
      isActive = false
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [durationMs])

  return progress
}

type TimedStepProgressProps = {
  progress: number
  step: number
}

function TimedStepProgress({ progress, step }: TimedStepProgressProps) {
  const normalizedProgress = Math.min(Math.max(progress, 0), 100)

  return (
    <div
      aria-label={`마사지 가이드 ${step}단계 진행률`}
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={Math.round(normalizedProgress)}
      className="relative z-10 flex gap-1.5 bg-[#e8c5e5] px-5 pt-4"
      role="progressbar"
    >
      {Array.from({ length: 5 }, (_, index) => {
        const segmentStep = index + 1

        if (segmentStep < step) {
          return (
            <div className="h-1.5 flex-1 rounded-full bg-white" key={segmentStep} />
          )
        }

        if (segmentStep === step) {
          return (
            <div
              className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#dcd5c5]"
              key={segmentStep}
            >
              <div
                className="h-full origin-left rounded-full bg-white will-change-transform"
                style={{ transform: `scaleX(${normalizedProgress / 100})` }}
              />
            </div>
          )
        }

        return (
          <div
            className="h-1.5 flex-1 rounded-full bg-[#dcd5c5]"
            key={segmentStep}
          />
        )
      })}
    </div>
  )
}

type MassageGuideIntroProps = {
  onStart: () => void
}

function MassageGuideIntro({ onStart }: MassageGuideIntroProps) {
  return (
    <article className="mx-auto flex min-h-[849px] w-full max-w-[393px] flex-col bg-white">
      <header className="flex items-center px-5 pt-6">
        <Link
          aria-label="케어 화면으로 돌아가기"
          className="relative size-5 rounded-sm transition-opacity after:absolute after:-inset-3 hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f19ed2] active:opacity-50"
          to="/care"
        >
          <ChevronLeft aria-hidden="true" className="size-full" strokeWidth={1.5} />
        </Link>
      </header>

      <div className="flex flex-col items-center px-8 pt-4 pb-[37px]">
        <p className="text-center text-[13px] leading-[19.5px] font-semibold tracking-[1.82px] text-[#f19ed2]">
          MASSAGE GUIDE
        </p>
        <h1 className="mt-[25.5px] text-center text-[22px] leading-[33px] font-semibold tracking-[-0.4px] text-[#26292e]">
          마사지 가이드
        </h1>

        <motion.div
          animate={{ opacity: 1 }}
          className="mt-[25px] flex h-[411px] w-full items-center justify-center overflow-hidden rounded-[26px] bg-[linear-gradient(128.6768deg,#fdf1f8_0%,#fdf3f9_7.1429%,#fef5fa_14.286%,#fef7fb_21.429%,#fef9fc_28.571%,#fefbfd_35.714%,#fffdfE_42.857%,#fff_50%,#fefdfE_57.143%,#fefafc_64.286%,#fdf8fb_71.429%,#fdf5fa_78.571%,#fcf3f9_85.714%,#fcf0f7_92.857%,#fbeef6_100%)] pt-[22px]"
          initial={{ opacity: 0 }}
          transition={{
            delay: 0.1,
            duration: 0.6,
            ease: "easeInOut",
          }}
        >
          <div className="relative h-[395px] w-[371px] shrink-0">
            <img
              alt="임산부가 배를 부드럽게 마사지하는 모습"
              className="absolute top-[9.89%] left-[17.79%] h-[80.54%] w-[64.89%] max-w-none"
              src={introIllustration}
            />
          </div>
        </motion.div>

        <div className="mt-[43px] text-center text-[19px] leading-[30.4px] tracking-[-0.2px]">
          <p className="font-semibold text-[#26292e]">
            몸이 편해지는 마사지 시간
          </p>
          <p className="font-medium text-[#6a6e75]">시작해볼까요?</p>
        </div>

        <motion.button
          className="mt-[78.2px] flex h-14 w-full items-center justify-center overflow-hidden rounded-[10px] bg-[#f19ed2] text-[16px] leading-6 font-semibold text-white shadow-none transition-[filter] hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f19ed2] focus-visible:ring-offset-2 active:brightness-90"
          onClick={onStart}
          type="button"
          whileTap={{ scale: 0.98 }}
        >
          시작하기
        </motion.button>
      </div>
    </article>
  )
}

type MassageGuideStepOneProps = {
  onBack: () => void
  onNext: () => void
}

function MassageGuideStepOne({ onBack, onNext }: MassageGuideStepOneProps) {
  const progress = useTimedProgress(onNext, SCREEN_DURATION_MS)

  return (
    <article className={STEP_FRAME_CLASS_NAME}>
      <header className={STEP_HEADER_CLASS_NAME}>
        <button
          aria-label="마사지 가이드 소개로 돌아가기"
          className="relative size-5 rounded-sm text-[#484c52] transition-opacity after:absolute after:-inset-3 hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white active:opacity-50"
          onClick={onBack}
          type="button"
        >
          <ChevronLeft aria-hidden="true" className="size-full" strokeWidth={1.5} />
        </button>
        <p className="text-[13px] leading-[19.5px] font-medium text-[#484c52]">
          1 / 5
        </p>
      </header>

      <TimedStepProgress progress={progress} step={1} />

      <MassageStepCard>
        <div className="flex h-[701px] flex-col">
          <p className="text-[13px] leading-[19.5px] font-semibold tracking-[1.04px] text-[#f19ed2]">
            STEP 1
          </p>
          <h1 className="mt-1.5 h-[31px] text-[22px] leading-[30.25px] font-semibold text-[#26292e]">
            손 데우기
          </h1>

          <div className="mt-3 h-[54px] text-[15px] leading-[25.5px] tracking-[-0.16px] text-[#6a6e75]">
            <p>두 손을 비벼 따뜻하게 만들어주세요.</p>
            <p className="pt-0.5">차가운 손보다 훨씬 편안하게 느껴질 거예요.</p>
          </div>

          <div className="mt-7">
            <Illustration
              step={{
                background: "warm",
                image: handWarmingIllustration,
                imageAlt: "두 손을 비벼 따뜻하게 만드는 모습",
              }}
            />
          </div>

          <div className="flex-1" />
          <p className={STEP_HINT_CLASS_NAME}>
            잠시 후 다음 단계로 자동 전환돼요
          </p>
        </div>
      </MassageStepCard>
    </article>
  )
}

type MassageGuideStepTwoProps = {
  onBack: () => void
  onNext: () => void
}

function MassageGuideStepTwo({ onBack, onNext }: MassageGuideStepTwoProps) {
  const progress = useTimedProgress(onNext, SCREEN_DURATION_MS)

  return (
    <article className={STEP_FRAME_CLASS_NAME}>
      <header className={STEP_HEADER_CLASS_NAME}>
        <button
          aria-label="마사지 가이드 1단계로 돌아가기"
          className="relative size-5 rounded-sm text-[#484c52] transition-opacity after:absolute after:-inset-3 hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white active:opacity-50"
          onClick={onBack}
          type="button"
        >
          <ChevronLeft aria-hidden="true" className="size-full" strokeWidth={1.5} />
        </button>
        <p className="text-[13px] leading-[19.5px] font-medium text-[#484c52]">
          2 / 5
        </p>
      </header>

      <TimedStepProgress progress={progress} step={2} />

      <MassageStepCard>
        <div className="flex h-[711px] flex-col">
          <p className="text-[13px] leading-[19.5px] font-semibold tracking-[1.04px] text-[#f19ed2]">
            STEP 2
          </p>
          <h1 className="mt-1.5 h-[31px] text-[22px] leading-[30.25px] font-semibold text-[#26292e]">
            배 중앙, 원 그리듯 쓸어주기
          </h1>

          <div className="mt-3 h-[79px] text-[15px] leading-[25.5px] tracking-[-0.16px] text-[#6a6e75]">
            <p className="break-words">
              손바닥 전체로 배꼽 주변을 <br/>시계 방향으로 천천히 그려주세요.
            </p>
            <p className="pt-0.5">
              힘은 안 줘도 괜찮아요, 스치듯 만져도 충분해요.
            </p>
          </div>

          <div className="mt-[41px]">
            <Illustration
              step={{
                image: bellyCircleIllustration,
                imageAlt: "배 중앙을 원을 그리듯 마사지하는 모습",
                ring: true,
              }}
            />
          </div>

          <p className={STEP_HINT_CLASS_NAME}>
            잠시 후 다음 단계로 자동 전환돼요
          </p>
        </div>
      </MassageStepCard>
    </article>
  )
}

type MassageGuideStepThreeProps = {
  onBack: () => void
  onNext: () => void
}

function MassageGuideStepThree({ onBack, onNext }: MassageGuideStepThreeProps) {
  const progress = useTimedProgress(onNext, SCREEN_DURATION_MS)

  return (
    <article className={STEP_FRAME_CLASS_NAME}>
      <header className={STEP_HEADER_CLASS_NAME}>
        <button
          aria-label="마사지 가이드 2단계로 돌아가기"
          className="relative size-5 rounded-sm text-[#484c52] transition-opacity after:absolute after:-inset-3 hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white active:opacity-50"
          onClick={onBack}
          type="button"
        >
          <ChevronLeft aria-hidden="true" className="size-full" strokeWidth={1.5} />
        </button>
        <p className="text-[13px] leading-[19.5px] font-medium text-[#484c52]">
          3 / 5
        </p>
      </header>

      <TimedStepProgress progress={progress} step={3} />

      <MassageStepCard>
        <p className="text-[13px] leading-[19.5px] font-semibold tracking-[1.04px] text-[#f19ed2]">
          STEP 3
        </p>
        <h1 className="mt-1.5 h-[31px] text-[22px] leading-[30.25px] font-semibold text-[#26292e]">
          옆구리 쓸어올리기
        </h1>

        <div className="mt-3 h-[79px] text-[15px] leading-[25.5px] tracking-[-0.16px] text-[#6a6e75]">
          <p>배 옆쪽에서 위쪽으로, 부드럽게 쓸어 올려주세요.</p>
          <p className="break-words pt-0.5">
            유독 당기는 곳이 있다면 <br/>그 부위에서 조금 더 머물러도 좋아요.
          </p>
        </div>

        <div className="mt-7">
          <Illustration
            step={{
              image: sideSweepIllustration,
              imageAlt: "배 옆쪽을 위로 쓸어 올리는 모습",
              sweep: true,
            }}
          />
        </div>

        <p className={STEP_HINT_CLASS_NAME}>
          잠시 후 다음 단계로 자동 전환돼요
        </p>
      </MassageStepCard>
    </article>
  )
}

type MassageGuideStepFourProps = {
  onBack: () => void
  onNext: () => void
}

function MassageGuideStepFour({ onBack, onNext }: MassageGuideStepFourProps) {
  const progress = useTimedProgress(onNext, SCREEN_DURATION_MS)

  return (
    <article className={STEP_FRAME_CLASS_NAME}>
      <header className={STEP_HEADER_CLASS_NAME}>
        <button
          aria-label="마사지 가이드 3단계로 돌아가기"
          className="relative size-5 rounded-sm text-[#484c52] transition-opacity after:absolute after:-inset-3 hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white active:opacity-50"
          onClick={onBack}
          type="button"
        >
          <ChevronLeft aria-hidden="true" className="size-full" strokeWidth={1.5} />
        </button>
        <p className="text-[13px] leading-[19.5px] font-medium text-[#484c52]">
          4 / 5
        </p>
      </header>

      <TimedStepProgress progress={progress} step={4} />

      <MassageStepCard>
        <p className="text-[13px] leading-[19.5px] font-semibold tracking-[1.04px] text-[#f19ed2]">
          STEP 4
        </p>
        <h1 className="mt-1.5 h-[31px] text-[22px] leading-[30.25px] font-semibold text-[#26292e]">
          골반 라인 누르기
        </h1>

        <div className="mt-3 h-[79px] text-[15px] leading-[25.5px] tracking-[-0.16px] text-[#6a6e75]">
          <p className="break-words">
            배 아랫부분을 손가락으로 살짝 눌러가며 원을 그려주세요.
          </p>
          <p className="break-words pt-0.5">
            이 부위가 유독 신경 쓰이는 분들이 많아요. <br/> 당신만 그런 게 아니에요.
          </p>
        </div>

        <div className="mt-7">
          <Illustration
            step={{
              image: pelvicLineIllustration,
              imageAlt: "배 아랫부분을 손가락으로 누르는 모습",
              press: true,
            }}
          />
        </div>

        <p className={STEP_HINT_CLASS_NAME}>
          잠시 후 다음 단계로 자동 전환돼요
        </p>
      </MassageStepCard>
    </article>
  )
}

type MassageGuideStepFiveProps = {
  onBack: () => void
  onComplete: () => void
}

function MassageGuideStepFive({ onBack, onComplete }: MassageGuideStepFiveProps) {
  const progress = useTimedProgress(onComplete, SCREEN_DURATION_MS)

  return (
    <article className={STEP_FRAME_CLASS_NAME}>
      <header className={STEP_HEADER_CLASS_NAME}>
        <button
          aria-label="마사지 가이드 4단계로 돌아가기"
          className="relative size-5 rounded-sm text-[#484c52] transition-opacity after:absolute after:-inset-3 hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white active:opacity-50"
          onClick={onBack}
          type="button"
        >
          <ChevronLeft aria-hidden="true" className="size-full" strokeWidth={1.5} />
        </button>
        <p className="text-[13px] leading-[19.5px] font-medium text-[#484c52]">
          5 / 5
        </p>
      </header>

      <TimedStepProgress progress={progress} step={5} />

      <MassageStepCard>
        <p className="text-[13px] leading-[19.5px] font-semibold tracking-[1.04px] text-[#f19ed2]">
          STEP 5
        </p>
        <h1 className="mt-1.5 h-[31px] text-[22px] leading-[30.25px] font-semibold text-[#26292e]">
          마무리 쓰다듬기
        </h1>

        <div className="mt-3 h-[54px] text-[15px] leading-[25.5px] tracking-[-0.16px] text-[#6a6e75]">
          <p>배 전체를 크게, 천천히 쓰다듬으며 마무리해요.</p>
          <p className="pt-0.5">오늘도 여기까지 챙긴 것만으로 충분해요.</p>
        </div>

        <div className="mt-7">
          <Illustration
            step={{
              image: finishingBellyIllustration,
              imageAlt: "배 전체를 크게 쓰다듬는 모습",
              sweepBig: true,
            }}
          />
        </div>

        <p className={STEP_HINT_CLASS_NAME}>
          잠시 후 마사지 가이드가 종료돼요
        </p>
      </MassageStepCard>
    </article>
  )
}

type MassageCompleteDialogProps = {
  onReplay: () => void
  open: boolean
}

function MassageCompleteDialog({ open, onReplay }: MassageCompleteDialogProps) {
  return (
    <Dialog open={open}>
      <DialogContent
        aria-describedby="massage-complete-description"
        className="flex w-[calc(100%-32px)] max-w-[361px] flex-col items-start gap-0 rounded-[24px] bg-white px-7 pt-8 pb-7 text-[#26292e] shadow-[0_24px_25px_rgba(0,0,0,0.4)] ring-0"
        onEscapeKeyDown={(event) => event.preventDefault()}
        onInteractOutside={(event) => event.preventDefault()}
        overlayClassName="mx-auto w-full max-w-[393px] bg-black/40 backdrop-blur-none supports-backdrop-filter:backdrop-blur-none"
        showCloseButton={false}
      >
        <div className="flex w-full justify-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-[#fbe0f1]">
            <img
              alt=""
              aria-hidden="true"
              className="size-[30px]"
              src={completionCheckIcon}
            />
          </div>
        </div>

        <DialogTitle className="h-[53px] w-full pt-5 text-center text-[22px] leading-[33px] font-semibold tracking-[-0.3px]">
          마사지 완료
        </DialogTitle>

        <DialogDescription
          className="h-14 w-full pt-2 text-center text-[15px] leading-6 tracking-[-0.16px] text-[#6a6e75]"
          id="massage-complete-description"
        >
          오늘도 몸을 챙겨주셨어요.
          <br />
          여기까지 온 것만으로 충분해요.
        </DialogDescription>

        <div className="flex h-[152px] w-full flex-col gap-3 pt-7">
          <Button
            className="h-14 w-full rounded-[15px] bg-[#f19ed2] text-[16px] leading-6 font-semibold text-white shadow-none hover:bg-[#ed8dca] focus-visible:border-[#f19ed2] focus-visible:ring-2 focus-visible:ring-[#f19ed2]/30"
            onClick={onReplay}
            type="button"
          >
            마사지 다시 보기
          </Button>
          <Button
            asChild
            className="h-14 w-full rounded-[15px] bg-[#f6ecf4] text-[16px] leading-6 font-semibold text-[#a06a91] shadow-none hover:bg-[#f1e3ee] focus-visible:border-[#a06a91] focus-visible:ring-2 focus-visible:ring-[#a06a91]/25"
          >
            <Link to="/care">케어카드 화면으로 돌아가기</Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

type MassageGuideScreen =
  | "intro"
  | "step-one"
  | "step-two"
  | "step-three"
  | "step-four"
  | "step-five"

export function MassageGuidePage() {
  const [screen, setScreen] = useState<MassageGuideScreen>("intro")
  const [isComplete, setIsComplete] = useState(false)

  const changeScreen = (nextScreen: MassageGuideScreen) => {
    setScreen(nextScreen)
  }

  const replayMassageGuide = () => {
    setIsComplete(false)
    setScreen("step-one")
  }

  const renderScreen = () => {
    switch (screen) {
      case "intro":
        return <MassageGuideIntro onStart={() => changeScreen("step-one")} />
      case "step-one":
        return (
          <MassageGuideStepOne
            onBack={() => changeScreen("intro")}
            onNext={() => changeScreen("step-two")}
          />
        )
      case "step-two":
        return (
          <MassageGuideStepTwo
            onBack={() => changeScreen("step-one")}
            onNext={() => changeScreen("step-three")}
          />
        )
      case "step-three":
        return (
          <MassageGuideStepThree
            onBack={() => changeScreen("step-two")}
            onNext={() => changeScreen("step-four")}
          />
        )
      case "step-four":
        return (
          <MassageGuideStepFour
            onBack={() => changeScreen("step-three")}
            onNext={() => changeScreen("step-five")}
          />
        )
      case "step-five":
        return (
          <MassageGuideStepFive
            onBack={() => changeScreen("step-four")}
            onComplete={() => setIsComplete(true)}
          />
        )
    }
  }

  return (
    <MotionConfig reducedMotion="user">
      <motion.main
        animate={{ opacity: 1 }}
        className="min-h-svh bg-white"
        initial={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        <div
          className={`relative min-h-svh ${
            screen === "intro" ? "bg-white" : "bg-[#e8c5e5]"
          }`}
        >
          <AnimatePresence initial={false} mode="sync">
            <motion.div
              className="absolute inset-x-0 top-0 min-h-svh"
              key={screen}
            >
              {renderScreen()}
            </motion.div>
          </AnimatePresence>
        </div>
        <MassageCompleteDialog open={isComplete} onReplay={replayMassageGuide} />
      </motion.main>
    </MotionConfig>
  )
}
