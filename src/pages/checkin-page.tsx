import { useState } from "react"
import { Button } from "@/shared/components/ui/button"
import { Textarea } from "@/shared/components/ui/textarea"
import { Tabs } from "@/shared/components/ui/tabs"
import { useCheckinFlowStore } from "@/features/checkin/model/use-checkin-flow-store"
import { CameraCapture } from "@/features/camera/camera-capture"

import { CheckinAnimation, type CheckinDirection,} from "@/features/checkin/ui/checkin-animation"

{/*svg파일 그냥 가져오기엔 너무 길어서 그냥 파일 형식으로 저장 */}
import bodyMapBaseSvg from "@/features/checkin/bodymap/body-map-base.svg"
import chestSvg from "@/features/checkin/bodymap/chest.svg?no-inline"
import abdomenSvg from "@/features/checkin/bodymap/abdomen.svg?no-inline"
import pelvisSvg from "@/features/checkin/bodymap/pelvis.svg?no-inline"
import leftArmSvg from "@/features/checkin/bodymap/left-arm.svg?no-inline"
import rightArmSvg from "@/features/checkin/bodymap/right-arm.svg?no-inline"
import leftLegSvg from "@/features/checkin/bodymap/left-leg.svg?no-inline"
import rightLegSvg from "@/features/checkin/bodymap/right-leg.svg?no-inline"

const BODY_MAP_WIDTH = 262
const BODY_MAP_HEIGHT = 411

export function CheckinPage() {

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
  const nextStep = useCheckinFlowStore((state) => state.nextStep)
  const prevStep = useCheckinFlowStore((state) => state.prevStep)

  //버튼에 따라서 애니메이션 방향 변경을 위한 useState
  const [direction, setDirection] = useState<CheckinDirection>(1)

  //버튼 클릭 시 애니메이션 + 다음 페이지 이동
  const handleNextStep = () => {
    setDirection(1)
    nextStep()
  }

  //버튼 클릭 시 애니메이션 + 이전 페이지 이동
  const handlePrevStep = () => {
    setDirection(-1)
    prevStep()
  }

  //zustand store에서 케어카드 실천여부
  const practiceCare = useCheckinFlowStore((state) => state.practiceCare)
  const setPracticeCare = useCheckinFlowStore((state) => state.setPracticeCare)

  //zustand store에서 튼살 여부 
  const hasStretchMarks = useCheckinFlowStore((state) => state.hasStretchMarks)
  const setHasStretchMarks = useCheckinFlowStore((state) => state.setHasStretchMarks)

  //zustand store에서 추천행동 만족도 여부
  const conditionScore = useCheckinFlowStore((state) => state.conditionScore)
  const setConditionScore = useCheckinFlowStore((state) => state.setConditionScore)

  //버튼 별 만족도 맵핑
  const satisfactionOptions = [
    { score: 1, label: "매우 불만족" },
    { score: 2, label: "불만족" },
    { score: 3, label: "보통" },
    { score: 4, label: "만족" },
    { score: 5, label: "매우 만족" },
  ]

  const bodymapMemo = useCheckinFlowStore((state) => state.bodymapMemo)
  const setBodymapMemo = useCheckinFlowStore((state) => state.setBodymapMemo)

  //진행도 표시 컴포넌트
  const CheckinStep = ({ step }: { step: number }) => {
    return (
      <div className="flex w-[150px] origin-center scale-75 items-center">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="flex flex-1 items-center last:flex-none">
            {/* 동그라미 */}
            <div className={`h-[8px] w-[8px] rounded-full ${item === step ? "bg-[#F19ED2]" : "bg-[#D9D9D9]"}`}/>

            {/* 선 */}
            {item !== 4 && (<div className="h-[1px] flex-1 bg-[#D9D9D9]" />)}
          </div>
        ))}
      </div>
    );
}

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[393px] flex-col items-center gap-8 overflow-x-hidden bg-white">
      
      <div className="relative mt-[86px] h-[20px] w-full max-w-[393px] px-6 ">
        {/*뒤로가기 버튼*/}
        <Button
          onClick={handlePrevStep}
          className="absolute left-6 top-1/2 h-6 w-6 -translate-y-1/2 bg-transparent p-0 shadow-none hover:bg-transparent"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.6283 0C17.8319 0 18.0402 0.0804844 18.1964 0.236695C18.5088 0.549117 18.5088 1.06036 18.1964 1.37278L7.50286 12.071L18.0402 22.6083C18.3526 22.9207 18.3526 23.432 18.0402 23.7444C17.7277 24.0568 17.2165 24.0568 16.9041 23.7444L5.79877 12.6391C5.48635 12.3267 5.48635 11.8154 5.79877 11.503L17.0603 0.236719C17.2165 0.0805078 17.4248 4.6875e-05 17.6283 4.6875e-05L17.6283 0Z" fill="black"/>
          </svg>
        </Button>

        {/*오늘의 체크인*/}
        <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[13px] font-medium text-black font-['Pretendard']">
          오늘의 체크인
        </p>
      </div>
      {/*진행도*/}
      <div className="flex flex-col items- w-[291px] h-[10px] justify-between">
        
        {/*진행상황, Progress 사용할 예정*/}
        <div className="self-end">      
          <CheckinStep step={step} />
        </div>    
      </div>
        
      {/*page 별 활성화*/}
      <div className="flex w-full flex-col items-center justify-start gap-4 px-6">
        <CheckinAnimation  step = {step} direction={direction}>
          {/*page1*/}
          {(step === 1) && (
            <div className="flex flex-col w-[344px] items-start justify-center gap-8">
              {/*어제 케어카드를 실천하셨나요?, page1*/}
              <p className="text-black font-medium text-[20px]">
                어제 케어카드를 실천하셨나요?
              </p>

              <div className="flex text-[11px] gap-2">
                {/*케어카드 '네' 버튼*/}
                <Button 
                  aria-pressed={practiceCare === true}
                  onClick={() => setPracticeCare(true)}
                  className={`transition-colors duration-200 border border-[#787D84] text-[20px] font-light  w-[157px] h-[40px] rounded-[20px] font-['Pretendard'] ${practiceCare === true ? "bg-[#F19ED2] text-white" : "bg-[#FFFFFF] text-black"}`}
                  >
                  네
                </Button>

                {/*케어카드 '아니요' 버튼*/}
                <Button
                  aria-pressed={practiceCare === false}
                  onClick={() => setPracticeCare(false)}
                  className={`transition-colors duration-200 border border-[#787D84] text-[20px] font-light  w-[157px] h-[40px] rounded-[20px] font-['Pretendard'] ${practiceCare === false ? "bg-[#F19ED2] text-white" : "bg-[#FFFFFF] text-black"}`}
                  >
                  아니요
                </Button>
              </div>

              {/*질문, 추천행동이 마음에 드셨나요?*/}
              <p className="text-black font-medium text-[20px]">
                추천행동이 마음에 드셨나요?
              </p>

              {/*만족도 조사, RadioGroup*/}
              <div className="flex w-full justify-between">
                {satisfactionOptions.map((option) => {
                  const isSelected = conditionScore === option.score

                  return (
                    <div key={option.score} className="flex flex-col items-center gap-2">
                      <Button
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => setConditionScore(option.score)}
                        className={`h-5 w-5 rounded-full shadow-md border transition-colors ${isSelected ? "border-[#F19ED2] bg-[#F19ED2]" : "border-[#D9D9D9] bg-white"}`}
                      />

                      {(option.score === 1 || option.score === 5) && (
                        <span className="whitespace-nowrap rounded-md bg-[#E6A3D2] px-2 py-1 text-[8px] text-black">
                          {option.label}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
              {/*만족도 조사*/}
            </div>
          )}

          {(step === 2) && (
            <div className="flex w-[344px] flex-col items-start justify-center gap-8">
              {/*page2*/}
               
            {/*오늘 배의 피부결을 확인해보아요, page2*/}
               <p className="text-black font-medium text-[20px]">
                 사진을 업로드 해주세요
              </p>
               
              {/*사진 촬영 기능*/}
              <CameraCapture />
            </div>    
          )}

          {(step === 3) && (
            <div className="flex flex-col w-[344px] items-start justify-center gap-5">      
              {/*오늘, 특별히 불편한 부위가 있나요?, page3*/}
              <p className="text-black font-medium text-[20px]">
                오늘, 특별히 불편한 부위가 있었나요?
              </p>
              
              {/*해당 부위를 터치해보세요 문구*/}
              <p className="text-[#484C52] font-Medium text-[16px] font-['Pretendard']">
              해당 부위를 터치해보세요
              </p>

              {/*바디맵, 팝업창 */}
              <div className="relative aspect-[262/411] w-[262px] max-w-full self-center">
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
                      width={part.width}
                      height={part.height}
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

                        <use
                          href={`${part.image}#body-part-path`}
                          aria-hidden="true"
                          className={`pointer-events-none text-[#F19ED2] transition-[opacity,filter] duration-200 ease-out group-hover:opacity-100 group-hover:[filter:drop-shadow(0_0_1px_#F19ED2)_drop-shadow(0_0_6px_#F19ED2CC)] group-focus-within:opacity-100 group-focus-within:[filter:drop-shadow(0_0_1px_#F19ED2)_drop-shadow(0_0_6px_#F19ED2CC)] ${
                            isSelected
                              ? "opacity-100 [filter:drop-shadow(0_0_1px_#F19ED2)_drop-shadow(0_0_6px_#F19ED2CC)]"
                              : "opacity-0"
                          }`}
                        />
                      </g>
                    </svg>
                  )
                })}

                {/*tab 팝업 창*/}
                {selectedPart && (
                  <Tabs
                    defaultValue="tabs"
                    className="absolute z-50 flex h-[127px] w-[183px] items-center justify-center overflow-hidden rounded-[10px] border border-transparent p-2.5"
                    style={{
                      left: "50%",
                      top: `${(selectedPart.y / BODY_MAP_HEIGHT) * 100}%`,
                      transform: "translateX(-50%)",
                      background:
                        "linear-gradient(#fff, #fff) padding-box, linear-gradient(to bottom, #fff, #F19ED2) border-box",
                    }}
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      {/*버튼을 누른 부위 이름 */}
                      <p className="text-black text-[14px] font-semibold font-['Pretendard'] leading-6">
                        {selectedPart.part}
                      </p>

                      {/*튼살 유무 확인 공간 */}
                      <div className="flex flex-row w-[120px] justify-between gap-2">
                        {/*튼살 문구*/}
                        <p className="text-[14px] font-['Pretendard']">
                          튼살
                        </p>

                        {/*튼살 유무 확인 버튼 */}
                        <div className="flex text-[11px] gap-1">
                          {/*있음*/}
                          <Button 
                            aria-pressed={hasStretchMarks === true}
                            onClick={() => setHasStretchMarks(true)}
                            className={hasStretchMarks === true ? "bg-[#F19ED2] font-light text-white w-[37px] h-[24px] text-[11px]" : "bg-[#787D84] font-light text-white w-[37px] h-[24px] text-[11px]"}
                          >
                            있음
                          </Button>

                          {/*없음*/}
                          <Button
                            aria-pressed={hasStretchMarks === false}
                            onClick={() => setHasStretchMarks(false)}
                            className={hasStretchMarks === false ? "bg-[#F19ED2] font-light text-white w-[37px] h-[24px] text-[11px]": "bg-[#787D84] font-light text-white w-[37px] h-[24px] text-[11px]"}
                          >
                            없음
                          </Button>
                        </div>
                      </div>

                      <Textarea
                        value={bodymapMemo}
                        onChange={(event) => setBodymapMemo(event.target.value)}
                        maxLength={100}
                        rows={1}
                        placeholder="메모를 입력하세요.."
                        className="h-10 
                        min-h-10 
                        max-h-10 
                        w-[155px] 
                        resize-none 
                        overflow-hidden 
                        rounded-lg 
                        border-0 
                        bg-white 
                        px-3.5 
                        py-2.5 
                        font-['Pretendard'] 
                        text-[10px] 
                        font-normal 
                        leading-6 
                        text-[#737373] 
                        shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] 
                        placeholder:text-neutral-500 
                        focus-visible:ring-0 
                        focus-visible:outline-neutral-400"
                        />
                    </div>  
                  </Tabs>
                )}
              </div>  
             </div> 
          )}    

          {(step === 4) && (
            <div className="flex flex-col w-[344px] items-start justify-center gap-5"> 
            {/*오늘의 한 줄 일기를 남겨보세요, page4*/}
              <p className="text-black font-medium text-[20px]">
                오늘의 한 줄 일기를 남겨보세요
              </p>
              {/*기분상태 이모티콘 선택*/}
              <div className="mt-[14px] flex w-[291px] self-center flex-row items-center justify-center gap-4">
                {/*우울해요*/}
                <div className="flex flex-col items-center justify-center gap-1 hover:scale-110">
                  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="22" cy="22" r="22" fill="#8DDBC4"/>
                    <ellipse cx="23.279" cy="17.9447" rx="4.34884" ry="5.40953" fill="white"/>
                    <ellipse cx="22.106" cy="18.0761" rx="1.90925" ry="2.37492" fill="black"/>
                    <ellipse cx="31.9768" cy="17.9447" rx="4.34884" ry="5.40953" fill="white"/>
                    <ellipse cx="30.8038" cy="18.0761" rx="1.90925" ry="2.37492" fill="black"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M25.1428 30.125C24.6096 30.306 24.0299 30.022 23.8465 29.489C23.6625 28.9547 23.9466 28.3724 24.481 28.1885L24.814 29.156C24.481 28.1885 24.4813 28.1884 24.4815 28.1883L24.4833 28.1877L24.486 28.1868L24.4928 28.1845C24.4979 28.1827 24.5043 28.1806 24.5119 28.1782C24.527 28.1733 24.5469 28.1669 24.5715 28.1594C24.6205 28.1444 24.6882 28.1248 24.773 28.1024C24.9427 28.0576 25.1819 28.0018 25.4799 27.951C26.0748 27.8495 26.9111 27.7665 27.8992 27.8339C28.8891 27.9015 29.6675 28.0953 30.2108 28.2795C30.4823 28.3715 30.6949 28.4611 30.846 28.5314C30.9216 28.5666 30.9818 28.5969 31.0263 28.6204C31.0486 28.6321 31.0669 28.6421 31.0813 28.6501C31.0885 28.6541 31.0947 28.6576 31.0999 28.6606L31.107 28.6646L31.11 28.6664L31.1114 28.6672L31.112 28.6675C31.1123 28.6677 31.1126 28.6679 30.5954 29.5508L31.1126 28.6679C31.6002 28.9536 31.7639 29.5804 31.4783 30.068C31.1941 30.5531 30.5722 30.7176 30.0857 30.4381C30.0839 30.4371 30.0797 30.4348 30.0733 30.4314C30.0572 30.423 30.0269 30.4075 29.9827 30.3869C29.8943 30.3458 29.7504 30.2843 29.5537 30.2176C29.1605 30.0843 28.556 29.9301 27.7598 29.8757C26.9619 29.8212 26.2904 29.8888 25.8241 29.9684C25.5915 30.008 25.4117 30.0504 25.295 30.0812C25.2367 30.0966 25.1944 30.109 25.1692 30.1167C25.1566 30.1205 25.1484 30.1232 25.1446 30.1244C25.1438 30.1247 25.1432 30.1249 25.1428 30.125Z" fill="black"/>
                  </svg>
                  <p className="text-[12px] font-medium font-['Pretendard']">
                    우울해요
                  </p>
                </div>

                {/*그냥 그래요*/}
                <div className="flex flex-col items-center justify-center gap-1 hover:scale-110">
                  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg"
                    className="cursor-pointer transition-all duration-300 hover:drop-shadow-[0_0_8px_#F4B7A3]"
                  >
                    <circle cx="22" cy="22" r="22" fill="#C9CDFE"/>
                    <circle cx="16.7559" cy="17.0118" r="5.24419" fill="white"/>
                    <circle cx="16.8839" cy="17.1392" r="2.30233" fill="black"/>
                    <circle cx="27.2442" cy="17.0118" r="5.24419" fill="white"/>
                    <circle cx="27.3722" cy="17.1392" r="2.30233" fill="black"/>
                    <path d="M21.8545 24.2969C22.2615 24.2564 22.7769 24.4287 23.3594 24.8574C23.9335 25.28 24.5199 25.9146 25.0479 26.6865C26.1085 28.2374 26.872 30.25 26.8721 32.0068C26.8721 33.7414 26.2034 34.8621 25.2715 35.5635C24.3185 36.2807 23.0422 36.5938 21.8047 36.5938C20.5679 36.5937 19.3294 36.281 18.4121 35.5684C17.5144 34.8708 16.8721 33.7503 16.8721 32.0068C16.8721 30.2478 17.6083 28.2917 18.6377 26.7705C19.1501 26.0133 19.7224 25.3836 20.2881 24.9482C20.8611 24.5073 21.3827 24.2989 21.8047 24.2988H21.8301L21.8545 24.2969Z" fill="#FF4141" stroke="black"/>
                  </svg>
                  <p className="text-[12px] font-medium font-['Pretendard']">
                    그냥 그래요
                  </p>
                </div>

                {/*좋아요*/}
                <div className="flex flex-col items-center justify-center gap-1 hover:scale-110">
                  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="22" cy="22" r="22" fill="#E8C6E8"/>
                    <circle cx="17.0118" cy="17.7793" r="5.24419" fill="white"/>
                    <circle cx="17.1397" cy="17.9068" r="2.30233" fill="black"/>
                    <circle cx="27.5" cy="17.7793" r="5.24419" fill="white"/>
                    <circle cx="27.628" cy="17.9068" r="2.30233" fill="black"/>
                    <path d="M25.8818 25.8428C30.6687 25.8428 34.5555 30.2879 30.9529 33.4401C28.6501 35.455 25.5269 36.587 22.2703 36.587C19.0137 36.587 15.8904 35.455 13.5877 33.4401C9.9851 30.2879 13.8718 25.8428 18.6588 25.8428L22.2703 25.8428H25.8818Z" fill="black"/>
                    <path d="M22.2075 30.2354C24.2413 30.2354 26.1921 30.9618 27.6304 32.2539C28.3861 32.933 28.9643 33.7416 29.3462 34.6191C27.2888 35.8892 24.8207 36.5869 22.269 36.5869C19.6758 36.5869 17.1684 35.8675 15.0913 34.5576C15.4734 33.7034 16.0452 32.9175 16.7837 32.2539C18.222 30.9616 20.1735 30.2354 22.2075 30.2354Z" fill="#FF4141"/>
                  </svg>
                  <p className="text-[12px] font-medium font-['Pretendard']">
                    좋아요
                  </p>
                </div>

                {/*최고에요*/}
                <div className="flex flex-col items-center justify-center gap-1 hover:scale-110">
                  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="22" cy="22" r="22" fill="#EF9BCE"/>
                    <circle cx="27.2442" cy="17.0118" r="5.24419" fill="white"/>
                    <path d="M25.9651 14.5811C25.1881 14.5811 24.5581 15.2168 24.5581 16.0012C24.5581 16.6343 24.8043 18.1371 27.228 19.6562C27.2714 19.6831 27.3212 19.6973 27.3721 19.6973C27.4229 19.6973 27.4727 19.6831 27.5161 19.6562C29.9398 18.1371 30.186 16.6343 30.186 16.0012C30.186 15.2168 29.556 14.5811 28.779 14.5811C28.0021 14.5811 27.3721 15.4417 27.3721 15.4417C27.3721 15.4417 26.742 14.5811 25.9651 14.5811Z" fill="#C70451"/>
                    <circle cx="16.7559" cy="17.0118" r="5.24419" fill="white"/>
                    <path d="M15.4768 14.5811C14.6999 14.5811 14.0698 15.2168 14.0698 16.0012C14.0698 16.6343 14.316 18.1371 16.7397 19.6562C16.7831 19.6831 16.833 19.6973 16.8838 19.6973C16.9346 19.6973 16.9844 19.6831 17.0279 19.6562C19.4515 18.1371 19.6977 16.6343 19.6977 16.0012C19.6977 15.2168 19.0677 14.5811 18.2908 14.5811C17.5138 14.5811 16.8838 15.4417 16.8838 15.4417C16.8838 15.4417 16.2537 14.5811 15.4768 14.5811Z" fill="#C70451"/>
                    <path d="M14.251 28.3848C14.251 28.3848 17.4456 31.5715 22.2204 31.5715C26.9952 31.5715 29.7065 28.3848 29.7065 28.3848" stroke="#C70451" stroke-width="17" stroke-linecap="round"/>
                  </svg>
                  <p className="text-[12px] font-medium font-['Pretendard']">
                    최고에요
                  </p>
                </div>
              </div>  
              {/*메모칸*/}
              <Textarea 
                value={memo}
                onChange={(event) => {setMemo(event.target.value)}}
                maxLength={100}
                placeholder="특별한 일이 있었나요?" 
                className="mt-[10px] h-[87px] w-[313px] self-center rounded-[15px] bg-[#D1D5DB] border-[1px] border-[#1A1714] text-[14px] text-[#7A6F66]"
              />  
            {/*케어카드를 작성중입니다. */}       
            </div>
          )}  
        </CheckinAnimation>   
      </div>  
       
      {/*다음 버튼, button 컴포넌트 사용*/}
      <div className="fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+24px)] z-40 mx-auto w-full max-w-[393px] px-8">
        <Button onClick={handleNextStep} className="h-[50px] w-full rounded-[15px] bg-[#484C52] text-[12px] text-white">
          다음
        </Button>
      </div>
      
    </div>
  )
}
