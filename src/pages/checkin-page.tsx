import axios from "axios"
import { getDateByOffset } from "@/shared/lib/date"
import { useMutation, useQuery, useQueryClient,} from "@tanstack/react-query"

import { useCallback, useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Check, CircleCheck } from "lucide-react"
import { useNavigate, useOutletContext } from "react-router-dom"
import { Button } from "@/shared/components/ui/button"
import { Textarea } from "@/shared/components/ui/textarea"
import { Drawer, DrawerContent, DrawerTrigger, DrawerClose } from "@/shared/components/ui/drawer"
import { useCheckinFlowStore } from "@/features/checkin/model/use-checkin-flow-store"
import { CameraCapture } from "@/features/camera/camera-capture"

import { createCheckIn } from "@/features/test/checkin_Controller"
import { createCareCard, getCareCardLatest, updateCareCardFeedback,} from "@/features/test/carecard-Controller"

import { CheckinAnimation, type CheckinDirection,} from "@/features/checkin/ui/checkin-animation"
import type { AppOutletContext } from "@/App"

{/*svg파일 그냥 가져오기엔 너무 길어서 그냥 파일 형식으로 저장 */}
import bodyMapBaseSvg from "@/features/checkin/bodymap/body-map-base.svg"
import chestSvg from "@/features/checkin/bodymap/chest.svg?no-inline"
import abdomenSvg from "@/features/checkin/bodymap/abdomen.svg?no-inline"
import pelvisSvg from "@/features/checkin/bodymap/pelvis.svg?no-inline"
import leftArmSvg from "@/features/checkin/bodymap/left-arm.svg?no-inline"
import rightArmSvg from "@/features/checkin/bodymap/right-arm.svg?no-inline"
import leftLegSvg from "@/features/checkin/bodymap/left-leg.svg?no-inline"
import rightLegSvg from "@/features/checkin/bodymap/right-leg.svg?no-inline"
import moodSad from "@/assets/checkin/mood/sad.svg"
import moodNeutral from "@/assets/checkin/mood/neutral.svg"
import moodGood from "@/assets/checkin/mood/good.svg"
import moodGreat from "@/assets/checkin/mood/great.svg"

const BODY_MAP_WIDTH = 262
const BODY_MAP_HEIGHT = 411
const SUCCESS_OVERLAY_DURATION_MS = 1200
const SUCCESS_OVERLAY_EXIT_DURATION_MS = 180

//Mood 별 숫자 매핑 (이거 추가안할려면 zustand 바꿔야 함)
const EMOTION_BY_MOOD = {
  sad: 1,
  neutral: 2,
  good: 3,
  great: 4,
} as const

// 가장 최근 케어카드를 조회하고, 케어카드가 없으면 null 반환
async function getPreviousCareCard() {
  try {
    const careCard =
      await getCareCardLatest() // /api/care-cards/latest 힘수 연결

    // 백엔드가 204를 반환하는 경우까지 대응
    return careCard ?? null
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 404
    ) {
      // 전날 체크인 데이터 없음
      return null
    }

    // 401, 403, 500은 실제 오류로 전달
    throw error
  }
}

export function CheckinPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { setHeaderBackAction } = useOutletContext<AppOutletContext>()

  const selectedBodyPart = useCheckinFlowStore((state) => state.selectedBodyPart)
  const setSelectedBodyPart = useCheckinFlowStore((state) => state.setSelectedBodyPart)
  
  //바디맵 부위 별 매핑
  const BodyPart = [
    { id: 1, part: "가슴", image: chestSvg, x: 98, y: 86, width: 62, height: 52,
      hitPath: "M5 0C4 14 1 30 0 52H62C61 33 58 15 57 0C48 2 42 4 34 5C25 5 17 2 10 1Z", zIndex: 30,
    },
    { id: 2, part: "복부", image: abdomenSvg, x: 99, y: 136, width: 61, height: 39,
      hitPath: "M2 0C3 10 4 20 2 30L0 35C12 39 21 39 30.5 39C41 39 51 38 61 35L59 30C56 20 57 10 58 0C45 2 39 2 30.5 2C21 2 14 2 2 0Z", zIndex: 30,
    },
    { id: 3, part: "골반", image: pelvisSvg, x: 96, y: 170, width: 67, height: 48,
      hitPath: "M2 2C13 6 23 9 33 9C44 9 55 6 65 2L64 11C54 18 47 26 42 35C39 42 37 47 33 47C29 47 27 44 23 38C18 29 11 20 3 12Z", zIndex: 40,
    },
    { id: 4, part: "왼쪽 팔", image: leftArmSvg, x: 34.5, y: 78.2, width: 57, height: 161,
      hitPath: "M57 13C51 20 50 31 48 42C46 53 42 64 37 72C32 81 29 92 25 106C22 116 20 120 14 124C9 128 5 133 5 135C7 137 10 136 13 133C16 131 18 131 21 130C20 137 14 147 11 151C13 154 17 154 20 151C24 146 27 137 29 128C31 121 38 110 44 100C50 90 55 77 57 68Z", zIndex: 20,
    },
    { id: 5, part: "오른쪽 팔", image: rightArmSvg, x: 168, y: 85, width: 59, height: 170,
      hitPath: "M1 8C4 16 5 29 8 41C11 54 16 65 21 76C27 89 34 103 38 112C41 118 42 120 47 123C52 126 56 132 57 136C55 138 52 137 48 134C46 132 44 132 42 132C44 140 49 151 50 157C48 161 44 161 41 157C37 151 34 142 32 134C30 126 24 117 18 108C12 98 7 87 4 77C1 67 1 55 1 44Z", zIndex: 20,
    },
    { id: 6, part: "왼쪽 다리", image: leftLegSvg, x: 88, y: 179, width: 42, height: 215,
      hitPath: "M9 1C20 5 31 24 40 36C40 52 38 68 37 82C37 96 34 105 34 116C35 132 34 143 32 155C30 166 31 174 33 184C35 193 34 201 31 204C27 207 21 204 17 202C14 199 15 195 18 189C21 183 21 177 20 169C19 159 15 150 14 139C12 129 13 117 14 108C15 98 14 91 12 83C9 70 6 57 5 45C3 29 5 12 9 1Z", zIndex: 10,
    },
    { id: 7, part: "오른쪽 다리", image: rightLegSvg, x: 131, y: 179, width: 41, height: 208,
      hitPath: "M30 1C20 5 11 15 5 28C1 36 0 43 1 53C2 65 4 76 3 86C2 98 5 108 6 119C6 132 5 140 7 151C9 163 8 171 7 178C5 187 6 198 9 201C13 204 20 202 24 199C26 196 24 191 21 186C18 181 18 176 19 169C20 159 24 149 25 139C27 128 27 117 26 108C25 99 26 90 28 80C30 70 34 57 35 47C37 31 34 13 30 1Z", zIndex: 10,
    },
  ]

  //현재 바디맵에서 선택한 부위의 id로 부위 맵핑
  const selectedPart = BodyPart.find(
    (part) => part.id === selectedBodyPart,
  )

  //tab을 터치하면 Zustand에 부위 값이 전달됨
  const touchTabs = (part : number) => {
    setSelectedBodyPart(part)
  }

  //zustand store에서 memo와 setMemo 가져오기
  const memo = useCheckinFlowStore((state) => state.memo)
  const setMemo = useCheckinFlowStore((state) => state.setMemo)

  //zustand store에서 step과 nextStep 가져오기
  const step = useCheckinFlowStore((state) => state.step)
  const setStep = useCheckinFlowStore((state) => state.setStep)
  const nextStep = useCheckinFlowStore((state) => state.nextStep)
  const prevStep = useCheckinFlowStore((state) => state.prevStep)
  const reset = useCheckinFlowStore((state) => state.reset)

  //버튼에 따라서 애니메이션 방향 변경을 위한 useState
  const [direction, setDirection] = useState<CheckinDirection>(1)
  const [isCheckinSuccessVisible, setIsCheckinSuccessVisible] = useState(false)
  const hideSuccessTimeoutRef = useRef<number | null>(null)
  const navigateTimeoutRef = useRef<number | null>(null)

  // 전날 케어카드 조회 후 시작 단계를 한 번만 설정하기 위한 상태
  const [isStepInitialized, setIsStepInitialized] = useState(false)

  // 체크인 생성 후 받은 ID를 보관하여 케어카드 생성 및 실패 재시도에 사용
  const [createdCheckInId, setCreatedCheckInId] = useState<number | null>(null)

  // 최근 케어카드를 조회하여 전날 케어카드 존재 여부를 판단
  const latestCareCardQuery = useQuery({ queryKey: [ "care-card", "previous", getDateByOffset(),],
    queryFn: getPreviousCareCard,

    // 체크인 진행 중 자동 조회로
    // 시작 단계가 바뀌는 것을 방지
    refetchOnWindowFocus: false,

    // 404를 포함해서 불필요한 자동 재시도 방지
    retry: false,

    // 같은 날짜에 체크인 화면이 다시 렌더링되어도 기존 조회 결과를 재사용
    staleTime: Infinity,
  })

  // 최신 케어카드 조회 결과
  const latestCareCard =latestCareCardQuery.data

 // 최신 케어카드의 생성일이 어제인지 확인
  const isYesterdayCareCard = latestCareCard != null && latestCareCard.createdDate.slice(0, 10) === getDateByOffset(-1)

  // 어제 생성된 케어카드에 연결된 체크인 ID가 있는지 확인
  const hasPreviousCheckIn = isYesterdayCareCard && latestCareCard.checkInId > 0

  // 전날 케어카드 만족도 PATCH에 사용할 careCardId
  const previousCareCardId = hasPreviousCheckIn ? latestCareCard.careCardId : null

  // 어제 케어카드가 있으면 1단계, 없으면 2단계부터 체크인 시작
  useEffect(() => {
    if (!latestCareCardQuery.isSuccess ||isStepInitialized)  return

    if (hasPreviousCheckIn) {
      // 어제 케어카드가 있으므로 실천 여부와 만족도 입력부터 시작
      setStep(1)
    } else {
       // 평가할 어제 케어카드가 없으므로 사진 촬영 단계부터 시작
      setStep(2)
    }

    setIsStepInitialized(true)
  }, [ hasPreviousCheckIn, isStepInitialized, latestCareCardQuery.isSuccess, setStep,]
  )

  //뒤로가기 함수
  const handlePreviousStep = useCallback(() => {
    // 1단계를 건너뛴 사용자는 2단계에서 뒤로 가면 홈으로 이동
    if (step === 2 &&!hasPreviousCheckIn) {
      navigate("/", {replace: true,})
      return
    }
    setDirection(-1)
    prevStep()
  }, [hasPreviousCheckIn, navigate, prevStep, step,])

  useEffect(() => {
    if (step === 1) {
      setHeaderBackAction()
      return
    }

    setHeaderBackAction(handlePreviousStep)

    return () => setHeaderBackAction()
  }, [handlePreviousStep, setHeaderBackAction, step])

  useEffect(
    () => () => {
      if (hideSuccessTimeoutRef.current !== null) {
        window.clearTimeout(hideSuccessTimeoutRef.current)
      }

      if (navigateTimeoutRef.current !== null) {
        window.clearTimeout(navigateTimeoutRef.current)
      }
    },
    [],
  )

  //zustand store에서 케어카드 실천여부
  const practiceCare = useCheckinFlowStore((state) => state.practiceCare)
  const setPracticeCare = useCheckinFlowStore((state) => state.setPracticeCare)

  //zustand store에서 추천행동 만족도 여부
  const conditionScore = useCheckinFlowStore((state) => state.conditionScore)
  const setConditionScore = useCheckinFlowStore((state) => state.setConditionScore)
  const imageId =useCheckinFlowStore( (state) => state.imageId,)
  const mood = useCheckinFlowStore((state) => state.mood)
  const setMood = useCheckinFlowStore((state) => state.setMood)
  const bodyPartAnswers = useCheckinFlowStore((state) => state.bodyPartAnswers,)
  const setBodyPartAnswer = useCheckinFlowStore((state) => state.setBodyPartAnswer,)

  const isCurrentStepValid = (() => {
    switch (step) {
      case 1:
        return practiceCare !== null && conditionScore !== null
      case 2:
        return imageId !== null
      case 3:
        return true
      case 4:
        return mood !== null
      default:
        return false
    }
  })()

  /*전날 만족도 PATCH
    → 오늘 체크인 POST
    → 응답 checkInId 보관
    → 오늘 케어카드 POST
    → 홈으로 응답 전달
  */
  const submitCheckInMutation = useMutation({
  mutationFn: async () => {
    if ( imageId === null || mood === null) {
      throw new Error( "체크인 필수 값이 없습니다.",)
    }

    // 전날 체크인을 한 사용자만
    // 전날 케어카드 만족도 PATCH
    if (previousCareCardId !== null && conditionScore !== null) {
      await updateCareCardFeedback(
        {careCardId:previousCareCardId,},
        {helpfulnessScore:conditionScore,},
      )
    }

    // 입력값이 있는 신체 부위만 체크인 API의 bodyDiaries 형식으로 변환
    const bodyDiaries = Object.entries(bodyPartAnswers).filter(([, answer]) => {
          return ( answer.hasStretchMarks !== null || answer.bodymapMemo.trim() !== "" )
        }).map(([partId, answer]) => {
          const comment = answer.bodymapMemo.trim()

          return {
            bodyRegion: Number(partId),
            ...(answer.hasStretchMarks !== null ? { stretchMark:answer.hasStretchMarks, } : {}),
            ...(comment !== "" ? { comment, } : {}),
          }
    })

    // 케어카드 생성만 실패했던 경우에는
    // 기존에 생성한 체크인 ID 재사용
    let checkInId = createdCheckInId

    if (checkInId === null) {
      const createdCheckIn = await createCheckIn(getDateByOffset(),
          { imageId,

            // 1단계를 생략한 경우에는
            // achieved 자체를 전송하지 않음
            ...(practiceCare !== null ? { achieved: practiceCare,} : {}),

            diary: memo.trim(),
            emotion:
              EMOTION_BY_MOOD[mood],
            bodyDiaries,
          },
        )

      checkInId = createdCheckIn.checkInId
      setCreatedCheckInId(checkInId)
    }

    // 오늘 생성된 checkInId로 새로운 케어카드 생성
    const createdCareCard = await createCareCard({ checkInId,})
    return createdCareCard
  },

  onSuccess: (createdCareCard) => {
     // 케어카드 POST 응답을 오늘의 케어카드 Query에 저장
    queryClient.setQueryData(
      [ "care-card", "today", getDateByOffset(), ],
      createdCareCard,
    )

    setIsCheckinSuccessVisible(true)

    hideSuccessTimeoutRef.current = window.setTimeout(() => {
        setIsCheckinSuccessVisible(false)
      }, SUCCESS_OVERLAY_DURATION_MS)

    navigateTimeoutRef.current = window.setTimeout(() => {
        // 체크인과 케어카드가 모두 생성된 뒤 초기화
        reset()

        navigate("/", { replace: true })
      }, ( SUCCESS_OVERLAY_DURATION_MS + SUCCESS_OVERLAY_EXIT_DURATION_MS)
    )
  },

  onError: (error) => { console.error("체크인 제출 실패:", error, ) },})

  //버튼 클릭 시 애니메이션 + 다음 페이지 이동
  const handleNextStep = () => {
    if (!isCurrentStepValid || submitCheckInMutation.isPending) return
  
    if (step === 4) {
      submitCheckInMutation.mutate()
      return
    }

    setDirection(1)
    nextStep()
  }

  //버튼 별 만족도 맵핑
  const satisfactionOptions = [
    { score: 1, label: "매우 불만족" },
    { score: 2, label: "불만족" },
    { score: 3, label: "보통" },
    { score: 4, label: "만족" },
    { score: 5, label: "매우 만족" },
  ]

  //진행도 표시 컴포넌트
  const CheckinStep = ({ step }: { step: number }) => {
    return (
      <div className="flex items-center gap-[6px]" aria-label={`${step} / 4 단계`}>
        {[1, 2, 3, 4].map((item) => (
          <span
            key={item}
            className={`block rounded-full ${item === step ? "h-[7px] w-5 bg-[#eea5d1]" : "size-[7px] bg-[#e6e1e4]"}`}
          />
        ))}
      </div>
    )
  }

  const selectedBodyPartAnswer = selectedBodyPart === null ? null : bodyPartAnswers[selectedBodyPart]

  if (latestCareCardQuery.isError) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4">
        <p>
          전날 체크인 정보를 불러오지 못했어요.
        </p>

        <Button
          type="button"
          onClick={() => { void latestCareCardQuery.refetch() }}
        >
          다시 시도
        </Button>
      </div>
    )
  }

  if ( latestCareCardQuery.isPending ||!isStepInitialized) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        전날 체크인 정보를 확인하고 있어요.
      </div>
    )
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[393px] flex-col overflow-x-hidden bg-white">
      {/*진행도*/}
      <div className="mt-[58px] flex h-[7px] w-full justify-end px-6">
        <div>
          <CheckinStep step={step} />
        </div>
      </div>
        
      {/*page 별 활성화*/}
      <div className="mt-[23px] flex w-full flex-col items-center justify-start px-6">
        <CheckinAnimation  step = {step} direction={direction}>
          {/*page1*/}
          {(step === 1) && (
            <div className="w-full max-w-[345px] pt-[30px]">
              <h2 className="mb-[22px] text-[24px] font-medium leading-[31px] tracking-[-0.48px] text-black">
                어제의 케어는 어땠나요?
              </h2>

              <div className="flex flex-col gap-[14px]">
                <section className="rounded-[20px] border border-[#f0eef0] bg-[#fbfafb] p-5">
                  <div className="flex items-start gap-2.5">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#fdeef7] text-[13px] font-bold leading-none text-[#7a3f63]">1</span>
                    <h3 className="pt-px text-[17px] font-semibold leading-[23px] tracking-[-0.34px] text-[#2b2b2b]">어제 케어카드를 실천하셨나요?</h3>
                  </div>

                  <div className="mt-[18px] grid grid-cols-2 gap-[13px]">
                    {[
                      { label: "네", value: true },
                      { label: "아니요", value: false },
                    ].map(({ label, value }) => {
                      const isSelected = practiceCare === value
                      return (
                        <button
                          aria-pressed={isSelected}
                          className={`flex h-[50px] items-center justify-center rounded-full border text-[17px] tracking-[-0.4px] transition-colors ${isSelected ? "border-[#eea5d1] bg-[#fdeef7] font-semibold text-[#7a3f63]" : "border-[#dedede] bg-white font-normal text-[#3a3a3a]"}`}
                          key={label}
                          onClick={() => setPracticeCare(value)}
                          type="button"
                        >
                          {isSelected ? <Check aria-hidden="true" className="mr-1.5 size-4" strokeWidth={2.5} /> : null}
                          {label}
                        </button>
                      )
                    })}
                  </div>
                </section>

                <section className="rounded-[20px] border border-[#f0eef0] bg-[#fbfafb] p-5">
                  <div className="flex items-start gap-2.5">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#fdeef7] text-[13px] font-bold leading-none text-[#7a3f63]">2</span>
                    <h3 className="pt-px text-[17px] font-semibold leading-[23px] tracking-[-0.34px] text-[#2b2b2b]">추천 행동이 마음에 드셨나요?</h3>
                  </div>

                  <div className="relative mt-[44px] h-7">
                    <div className="absolute left-[14px] right-[14px] top-[13px] h-0.5 rounded-full bg-[#ececec]" />
                    <div className="relative flex h-7 items-center justify-between">
                      {satisfactionOptions.map((option) => {
                        const isSelected = conditionScore === option.score
                        return (
                          <button
                            aria-checked={isSelected}
                            aria-label={option.label}
                            className="relative z-10 flex size-7 items-center justify-center"
                            key={option.score}
                            onClick={() => setConditionScore(option.score)}
                            role="radio"
                            type="button"
                          >
                            {isSelected ? <span className="absolute bottom-[42px] whitespace-nowrap rounded-lg bg-[#eea5d1] px-[9px] py-1 text-[11px] font-semibold leading-[17px] text-[#7a3f63] after:absolute after:left-1/2 after:top-full after:-translate-x-1/2 after:border-x-[5px] after:border-t-[6px] after:border-x-transparent after:border-t-[#eea5d1]">{option.label}</span> : null}
                            <span className={`rounded-full ${isSelected ? "size-[26px] bg-[#eea5d1] shadow-[0_4px_10px_rgba(238,165,209,0.5)]" : "size-[18px] border-2 border-[#d4d4d4] bg-white"}`} />
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  <div className="mt-[14px] flex justify-between text-[11px] font-medium leading-[17px] text-[#9a9299]">
                    <span>매우 불만족</span><span>매우 만족</span>
                  </div>
                </section>
              </div>
            </div>
          )}

          {(step === 2) && (
            <div className="w-full max-w-[345px] pt-[30px]">
              <h2 className="text-[24px] font-medium leading-[31px] tracking-[-0.48px] text-black">
                오늘의 배를 찍어주세요
              </h2>
              <p className="mt-2 text-[14px] leading-[21px] text-[#9a9299]">
                실천한 순간을 기록하면 회고할 때 도움이 돼요.
              </p>

              <div className="mt-6">
              <CameraCapture />
              </div>

              <p className="mt-4 flex items-start gap-2 rounded-[14px] bg-[#faf8f9] px-[14px] py-3 text-[11px] leading-[19.5px] text-[#8a8188]">
                <span aria-hidden="true" className="mt-px flex size-[18px] shrink-0 items-center justify-center rounded-full bg-[#fdeef7] font-bold text-[#7a3f63]">i</span>
                사진은 AI 분석에만 사용되고, 외부로 유출되지 않습니다.
              </p>
            </div>    
          )}

          {(step === 3) && (
            <div className="w-full max-w-[345px] pt-[30px]">
              <h2 className="text-[24px] font-medium leading-[31px] tracking-[-0.48px] text-black">
                특별히 불편한 부위가 있었나요?
              </h2>
              <p className="mt-2 whitespace-pre-line text-[14px] leading-[21px] text-[#9a9299]">
                해당 부위를 터치해서 알려주세요.{"\n"}여러 곳을 선택할 수 있어요.
              </p>

              {/*바디맵, 팝업창 : 전신 svg에 각 부위 별 svg를 덧댐 / 원래대로 하고 싶다면 -translate-y-6만 삭제해 */}
              <div className="relative mx-auto mt-[25px] aspect-[262/411] w-[250px] max-w-full">
                <span aria-hidden="true" className="absolute left-6 top-[82px] z-50 text-[13px] font-medium tracking-[-0.11px] text-[#b3abb0]">L</span>
                <span aria-hidden="true" className="absolute right-6 top-[85px] z-50 text-[13px] font-medium tracking-[-0.11px] text-[#b3abb0]">R</span>
              
                {/*바디맵 전신  svg*/}
                <img
                  src={bodyMapBaseSvg}
                  alt=""
                  draggable={false}
                  className="pointer-events-none absolute inset-0 h-full w-full select-none"
                />

                {/* 실제 벡터 path를 이용한 부위별 hover/click 영역 */}
                {BodyPart.map((part) => {
                  const isSelected = selectedBodyPart === part.id

                  return (
                    //각 부위 별 svg 파일
                    <svg
                      key={part.id}
                      viewBox={`0 0 ${part.width} ${part.height}`}
                      className="pointer-events-none absolute h-auto overflow-visible"
                      style={{
                        left: `${(part.x / BODY_MAP_WIDTH) * 100}%`,
                        top: `${(part.y / BODY_MAP_HEIGHT) * 100}%`,
                        width: `${(part.width / BODY_MAP_WIDTH) * 100}%`,
                        zIndex: part.zIndex,
                      }}
                    >                  
                      <g className="group">
                        {/*투명한 클릭 영역, svg파일이 자꾸 네모로 설정이 되서 그냥 넣음 */}
                        <path
                          d={part.hitPath}
                          role="button"
                          tabIndex={0}
                          aria-label={`${part.part} 선택`}
                          aria-pressed={isSelected}
                          onClick={() => touchTabs(part.id)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault()
                              touchTabs(part.id)
                            }
                          }}
                          className="cursor-pointer fill-black opacity-[0.001] [pointer-events:visibleFill]"
                        />

                        {/*핑크색으로 빛나는 */}
                        <use
                          href={`${part.image}#body-part-path`}
                          aria-hidden="true"
                          className={`pointer-events-none text-[#F19ED2] transition-[opacity,filter] duration-200 ease-out group-hover:opacity-100 group-hover:[filter:drop-shadow(0_0_1px_#F19ED2)_drop-shadow(0_0_6px_#F19ED2CC)] group-focus-within:opacity-100 group-focus-within:[filter:drop-shadow(0_0_1px_#F19ED2)_drop-shadow(0_0_6px_#F19ED2CC)] ${
                            isSelected || bodyPartAnswers[part.id]?.hasStretchMarks === true
                              ? "opacity-100 [filter:drop-shadow(0_0_1px_#F19ED2)_drop-shadow(0_0_6px_#F19ED2CC)]"
                              : "opacity-0"
                          }`}
                        />
                      </g>
                </svg>
                  )
                })}

              </div>

                {/*Drawer 팝업 창*/}
                  <Drawer
                    open={selectedPart !== undefined}
                    onOpenChange={(open) => {if (!open) {setSelectedBodyPart(null)}}}
                  >
                    <DrawerContent
                      className=" mx-auto w-full max-w-[393px] border-0 bg-white px-6 pb-[calc(env(safe-area-inset-bottom)+24px)] text-black
                      data-[vaul-drawer-direction=bottom]:rounded-t-[32px] [&>div:first-child]:mt-5 [&>div:first-child]:h-1.5 [&>div:first-child]:w-14 [&>div:first-child]:bg-[#D9D9D9]"
                    >
                    {selectedPart && (
                      <div className="flex flex-col font-['Pretendard']">
                        {/*버튼을 누른 부위 이름 */}
                        <p className="text-left text-[24px] font-bold text-black">
                          {selectedPart.part}
                        </p>

                        {/* 구분선 */}
                        <div className="mt-5 h-px w-full bg-[#E5E7EB]" />

                        {/*튼살 유무 확인 공간 */}
                        <div className="flex items-center justify-between py-5">
                          {/*튼살 문구*/}
                          <p className="text-[18px] font-semibold font-['Pretendard']">
                            튼살
                          </p>

                          {/*튼살 유무 확인 버튼 */}
                          <div className="flex gap-3">
                            {/*있음*/}
                            <Button 
                              aria-pressed={selectedBodyPartAnswer?.hasStretchMarks === true}
                              onClick={() => {
                                {/*만약 선택이 안됐으면 그냥 null로 보내고 그게 아니라면 버튼 활성화 */}
                                if (selectedBodyPart === null) return

                                setBodyPartAnswer(selectedBodyPart, {hasStretchMarks: true,})
                              }}
                              className={`h-10 w-[76px] rounded-full border bg-white text-[14px] font-normal shadow-none ${selectedBodyPartAnswer?.hasStretchMarks === true ? "border-[#F19ED2] text-[#F19ED2] hover:bg-[#FFF7FC]" : "border-[#B7B7B7] text-[#666666] hover:bg-[#F8F8F8]"}`}
                            >
                              있음
                            </Button>

                            {/*없음*/}
                            <Button
                              aria-pressed={selectedBodyPartAnswer?.hasStretchMarks === false}
                              onClick={() => {
                                {/*만약 선택이 안됐으면 그냥 null로 보내고 그게 아니라면 버튼 활성화 */}
                                if (selectedBodyPart === null) return

                                setBodyPartAnswer(selectedBodyPart, {hasStretchMarks: false,})
                              }}
                              className={`h-10 w-[76px] rounded-full border bg-white text-[14px] font-normal shadow-none ${selectedBodyPartAnswer?.hasStretchMarks === false ? "border-[#F19ED2] text-[#F19ED2] hover:bg-[#FFF7FC]": "border-[#B7B7B7] text-[#666666] hover:bg-[#F8F8F8]"}`}
                            >
                              없음
                            </Button>
                          </div>
                        </div>

                        {/* 구분선 */}
                        <div className="mb-6 h-px w-full bg-[#E5E7EB]" />

                        <p className="text-[18px] mb-4 font-semibold font-['Pretendard']">
                            메모
                        </p>

                        <Textarea
                          value={selectedBodyPartAnswer?.bodymapMemo ?? ""}
                          onChange={(event) => {
                            if (selectedBodyPart === null) return

                            setBodyPartAnswer(selectedBodyPart, {bodymapMemo: event.target.value,})
                          }}
                          maxLength={50}
                          rows={4}
                          placeholder="메모를 입력하세요.. (50자 제한)"
                          className="
                            h-[104px]
                            min-h-[104px] 
                            w-full
                            resize-none 
                            overflow-hidden 
                            rounded-[12px] 
                            border
                            border-[#B7B7B7]
                            bg-white 
                            px-4
                            py-3
                            font-['Pretendard'] 
                            text-[14px]  
                            text-black
                            shadow-none
                            placeholder:text-[#B7B7B7]
                            focus-visible:ring-0 
                            focus-visible:border-[#D49ACB]
                          "
                          />
                          <DrawerClose asChild>
                            <Button className="h-[54px] mt-6 w-full rounded-[16px] bg-[#F19ED2] text-[16px] font-semibold text-white hover:bg-[#A96EAA]">
                              적용
                            </Button>
                          </DrawerClose>      
                      </div>
                    )}  
                  </DrawerContent>  
                </Drawer>

             </div> 
          )}    

          {(step === 4) && (
            <div className="w-full max-w-[345px] pt-[30px]">
            {/*오늘의 한 줄 일기를 남겨보세요, page4*/}
              <h2 className="text-[24px] font-medium leading-[31px] tracking-[-0.48px] text-black">
                오늘의 한 줄 일기를 남겨보세요
              </h2>
              {/*기분상태 이모티콘 선택*/}
              <div className="mt-[28px] grid w-full grid-cols-4 gap-2">
                {/*우울해요*/}
                <button
                  type="button"
                  onClick={() => setMood("sad")}
                  aria-pressed={mood === "sad"}
                  className={`flex h-[100px] flex-col items-center justify-center gap-2 rounded-[16px] border py-3 transition-colors ${mood === "sad" ? "border-[#eea5d1] bg-[#fdeef7]" : "border-transparent bg-transparent"}`}
                >
                  <img src={moodSad} alt="" aria-hidden="true" className="size-[46px]" />
                  <p className={`text-[13px] font-medium tracking-[-0.26px] ${mood === "sad" ? "text-[#7a3f63]" : "text-[#5a5560]"}`}>
                    우울해요
                  </p>
                </button>

                {/*그냥 그래요*/}
                <button
                  type="button"
                  onClick={() => setMood("neutral")}
                  aria-pressed={mood === "neutral"}
                  className={`flex h-[100px] flex-col items-center justify-center gap-2 rounded-[16px] border py-3 transition-colors ${mood === "neutral" ? "border-[#eea5d1] bg-[#fdeef7]" : "border-transparent bg-transparent"}`}
                >
                  <img src={moodNeutral} alt="" aria-hidden="true" className="size-[46px]" />
                  <p className={`text-[13px] font-medium tracking-[-0.26px] ${mood === "neutral" ? "text-[#7a3f63]" : "text-[#5a5560]"}`}>
                    그냥 그래요
                  </p>
                </button>

                {/*좋아요*/}
                <button
                  type="button"
                  onClick={() => setMood("good")}
                  aria-pressed={mood === "good"}
                  className={`flex h-[100px] flex-col items-center justify-center gap-2 rounded-[16px] border py-3 transition-colors ${mood === "good" ? "border-[#eea5d1] bg-[#fdeef7]" : "border-transparent bg-transparent"}`}
                >
                  <img src={moodGood} alt="" aria-hidden="true" className="size-[46px]" />
                  <p className={`text-[13px] font-medium tracking-[-0.26px] ${mood === "good" ? "text-[#7a3f63]" : "text-[#5a5560]"}`}>
                    좋아요
                  </p>
                </button>

                {/*최고에요*/}
                <button
                  type="button"
                  onClick={() => setMood("great")}
                  aria-pressed={mood === "great"}
                  className={`flex h-[100px] flex-col items-center justify-center gap-2 rounded-[16px] border py-3 transition-colors ${mood === "great" ? "border-[#eea5d1] bg-[#fdeef7]" : "border-transparent bg-transparent"}`}
                >
                  <img src={moodGreat} alt="" aria-hidden="true" className="size-[46px]" />
                  <p className={`text-[13px] font-medium tracking-[-0.26px] ${mood === "great" ? "text-[#7a3f63]" : "text-[#5a5560]"}`}>
                    최고에요
                  </p>
                </button>
              </div>  
              {/*메모칸*/}
              <div className="mt-6 rounded-[16px] border border-[#efe7ec] bg-[#faf8f9] px-4 py-[14px]">
                <Textarea
                  value={memo}
                  onChange={(event) => {setMemo(event.target.value)}}
                  maxLength={200}
                  placeholder="특별한 일이 있었나요?"
                  className="h-[99px] min-h-[99px] w-full resize-none border-0 bg-transparent p-0 text-[15px] leading-[22.5px] text-[#2b2b2b] shadow-none placeholder:text-[#b7aeb4] focus-visible:ring-0"
                />
                <p className="mt-0.5 text-right text-[12px] leading-[18px] text-[#b7aeb4]">{memo.length} / 200</p>
              </div>
            {/*케어카드를 작성중입니다. */}       
            </div>
          )}  
        </CheckinAnimation>   
      </div>  
       
      {/*다음 버튼, button 컴포넌트 사용*/}
      <div className={`fixed inset-x-0 z-40 mx-auto w-full max-w-[393px] px-6 ${step >= 1 && step <= 4 ? "bottom-[calc(env(safe-area-inset-bottom)+54px)]" : "bottom-[calc(env(safe-area-inset-bottom)+24px)]"}`}>
        <Button
          onClick={handleNextStep}
          disabled={!isCurrentStepValid || isCheckinSuccessVisible || submitCheckInMutation.isPending}
          className={`h-[52px] w-full rounded-[16px] text-[16px] font-semibold text-white ${isCurrentStepValid ? "bg-[#484c52]" : "bg-[#d9d9d9]"}`}
        >
          {submitCheckInMutation.isPending ? "저장 중..." : step === 4 ? "체크인 완료" : "다음"}
        </Button>
      </div>

      <AnimatePresence>
        {isCheckinSuccessVisible ? (
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 backdrop-blur-[2px]"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <motion.div
              animate={{ opacity: 1, scale: 1 }}
              className="flex size-24 items-center justify-center rounded-full bg-[#26292E] shadow-[0_12px_32px_rgba(0,0,0,0.3)]"
              exit={{ opacity: 0, scale: 0.92 }}
              initial={{ opacity: 0, scale: 0.56 }}
              transition={{ type: "spring", stiffness: 360, damping: 22 }}
            >
              <CircleCheck
                aria-label="체크인 완료"
                className="size-14 text-white"
                strokeWidth={1.8}
              />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      
    </div>
  )
}
