import { Button } from "@/shared/components/ui/button"
import { Slider } from "@/shared/components/ui/slider"
import { Textarea } from "@/shared/components/ui/textarea"
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/shared/components/ui/tabs"
import { useCheckinFlowStore } from "@/features/checkin/model/use-checkin-flow-store"

export function CheckinPage() {
  //zustand store에서 memo와 setMemo 가져오기
  const memo = useCheckinFlowStore((state) => state.memo)
  const setMemo = useCheckinFlowStore((state) => state.setMemo)
  //zustand store에서 step과 nextStep 가져오기
  const step = useCheckinFlowStore((state) => state.step)
  const nextStep = useCheckinFlowStore((state) => state.nextStep)

  const selectedBodyPart = useCheckinFlowStore((state) => state.selectedBodyPart)
  const setSelectedBodyPart = useCheckinFlowStore((state) => state.setSelectedBodyPart)
  
  const hasStretchMarks = useCheckinFlowStore((state) => state.hasStretchMarks)
  const setHasStretchMarks = useCheckinFlowStore((state) => state.setHasStretchMarks)


  const BodyPart = [
    {id : 1, part : "가슴", x: 100, y: 40},
    {id : 2, part : "복부", x: 100, y: 90},
    {id : 3, part : "골반", x: 100, y: 140},
    {id : 4, part : "왼팔", x: 30, y: 90},
    {id : 5, part : "오른팔", x: 170, y: 90},
    {id : 6, part : "왼다리", x: 70, y: 220},
    {id : 7, part : "오른다리", x: 140, y: 220},
  ]

  const touchTabs = (part : number) => {
    setSelectedBodyPart(part)
    
  }

  //진행도 표시 컴포넌트
  const CheckinStep = ({ step }: { step: number }) => {
    return (
      <div className="flex w-[150px] items-center">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="flex flex-1 items-center last:flex-none">
            {/* 동그라미 */}
            <div className={`h-[8px] w-[8px] rounded-full ${item === step ? "bg-[#91DDCF]" : "bg-[#D9D9D9]"}`}/>

            {/* 선 */}
            {item !== 4 && (<div className="h-[1px] flex-1 bg-[#D9D9D9]" />)}
          </div>
        ))}
      </div>
    );
}

  const today = new Date().toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  return (
    <div className="flex flex-col items-center justify-center gap-10 mt-[86px] " >
      
      <div className=" relative flex flex-row items-center justify-center w-[329px] h-[50px] font-Medium text-black ">
        {/*뒤로가기 버튼*/}
        <Button className="absolute left-0 w-[45px] h-[30px] bg-[#484C52] rounded-[15px] text-white font-Medium text-[16px] items-center justify-center">
          &lt;
        </Button>

        {/*오늘의 체크인*/}
        <p className="flex items-center justify-center h-full font-Medium text-[15px]">
          오늘의 체크인
        </p>
      </div>
      {/*진행도*/}
      <div className="flex flex-col items-start w-[291px] h-[50px] justify-between gap-2">
        {/*날짜*/}
        <p className="text-[12px] text-black font-bold">
          { today }
        </p>

        {/*진행상황, Progress 사용할 예정*/}
        <CheckinStep step={step} />

      </div>
        
      {/*page 별 활성화*/}
      <div className="flex flex-col items-center justify-start gap-4">  
          {/*page1*/}
          {(step === 1) && (
            <div className="flex flex-col w-[291px] items-start justify-center gap-2">
              {/*잠깐, 어제 행동카드는 잘 실천하셨나요?, page1*/}
              <p className="text-black font-bold text-[12px]">
                잠깐, 어제 행동카드는 잘 실천하셨나요?
              </p>

              {/*실천사항 박스*/}
              <div className="w-[291px] h-[30px] flex flex-row justify-start gap-2 items-center">
                {/*실천사항*/}
                <p className="text-black font-Medium text-[16px]">
                  어쩌구 저쩌구를 하세요
                </p>  

                {/*체크박스*/}
                <input type="checkbox" />
              </div>

              {/*질문, 추천행동이 마음에 드셨나요?*/}
              <p className="text-[#B9C0C9] font-bold text-[10px]">
                추천행동이 마음에 드셨나요?
              </p>

              {/*만족도 조사, RadioGroup 사용할 예정*/}
              <Slider defaultValue={[50]} max={100} step={1} className="w-[329px] h-[8px] rounded-[15px] bg-[#D9D9D9]" />
              {/*만족도 조사*/}
            </div>
          )}

          {(step === 2) && (
            <div className="flex flex-col w-[291px] items-start justify-center gap-2">
              {/*page2*/}
              
            {/*오늘 배의 피부결을 확인해보아요, page2*/}
              <p className="text-black font-bold text-[12px]">
                오늘 배의 피부결을 확인해보아요
              </p>
              
              {/*사진 촬영 기능*/}
              {/*카메라 ui + MediaDevices API*/}
              {/*로딩창, 성공 or 실패*/}
            </div>    
          )}

          {(step === 3) && (
            <div className="flex flex-col w-[291px] items-start justify-center gap-2">      
            {/*오늘, 특별히 불편한 부위가 있나요?, page3*/}
            <p className="text-black font-bold text-[12px]">
              오늘, 특별히 불편한 부위가 있나요?
            </p>
              {/*바디맵, svg로 구현 */}
                {/*해당 부위를 터치해보세요 문구*/}
                <p className="text-[#B9C0C9] font-bold text-[10px]">
                해당 부위를 터치해보세요
                </p>
                <div className="relative w-[250px] h-[392px]">
                  {BodyPart.map((part) => {
                    return(   
                      <button 
                        key = {part.id} 
                        type="button"
                        className="absolute z-10 rounded bg-pink-200 px-2 py-1 text-xs"
                        style={{left : part.x, top : part.y,}}
                        onClick={() => touchTabs(part.id)}
                      >
                      </button>  
                    )
                  })}
                  {selectedBodyPart !== null && (
                    <Tabs
                      defaultValue="pain"
                      className="flex items-center justify-center h-[127px] w-[183px] overflow-hidden rounded-[10px] border border-transparent p-2.5"
                      style={{
                        background:
                          "linear-gradient(#fff, #fff) padding-box, linear-gradient(to bottom, #fff, #63D5B3) border-box",
                      }}
                    >
                      <div className="flex flex-col items-center justify-center gap-2">
                        <p className="text-black text-[14px] font-semibold font-['Pretendard'] leading-6">
                          {BodyPart.find((part) => part.id === selectedBodyPart)?.part}
                        </p>

                        <div className="flex flex-row w-[120px] justify-between">
                          <p className="text-[14px] font-['Pretendard']">
                            튼살
                          </p>
                          <div className="text-[11px]">
                            <Button 
                              type="button"
                              aria-pressed={hasStretchMarks === true}
                              onClick={() => setHasStretchMarks(true)}
                              className={hasStretchMarks === true ? "bg-[#484C52] font-light text-white w-[37px] h-[24px] text-[11px]" : "bg-[#787D84] font-light text-white w-[37px] h-[24px] text-[11px]"}
                            >
                              있음
                            </Button>

                            <Button
                              type="button"
                              aria-pressed={hasStretchMarks === false}
                              onClick={() => setHasStretchMarks(false)}
                              className={hasStretchMarks === false ? "bg-[#484C52] font-light text-white w-[37px] h-[24px] text-[11px]": "bg-[#787D84] font-light text-white w-[37px] h-[24px] text-[11px]"}
                            >
                              없음
                            </Button>
                          </div>
                        </div>

                        <Textarea
                          value={memo}
                          onChange={(event) => setMemo(event.target.value)}
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
            <div className="flex flex-col w-[291px] items-start justify-center gap-2"> 
            {/*오늘의 한 줄 일기를 남겨보세요, page4*/}
              <p className="text-black font-bold text-[12px]">
                오늘의 한 줄 일기를 남겨보세요
              </p>
              {/*기분상태 이모티콘 선택*/}
              <div className="flex flex-row w-[291px] mt-[14px] items-center justify-center gap-4">
                {/*우울해요*/}
                <div className="flex flex-col items-center justify-center gap-1">
                  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="22" cy="22" r="22" fill="#8DDBC4"/>
                    <ellipse cx="23.279" cy="17.9447" rx="4.34884" ry="5.40953" fill="white"/>
                    <ellipse cx="22.106" cy="18.0761" rx="1.90925" ry="2.37492" fill="black"/>
                    <ellipse cx="31.9768" cy="17.9447" rx="4.34884" ry="5.40953" fill="white"/>
                    <ellipse cx="30.8038" cy="18.0761" rx="1.90925" ry="2.37492" fill="black"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M25.1428 30.125C24.6096 30.306 24.0299 30.022 23.8465 29.489C23.6625 28.9547 23.9466 28.3724 24.481 28.1885L24.814 29.156C24.481 28.1885 24.4813 28.1884 24.4815 28.1883L24.4833 28.1877L24.486 28.1868L24.4928 28.1845C24.4979 28.1827 24.5043 28.1806 24.5119 28.1782C24.527 28.1733 24.5469 28.1669 24.5715 28.1594C24.6205 28.1444 24.6882 28.1248 24.773 28.1024C24.9427 28.0576 25.1819 28.0018 25.4799 27.951C26.0748 27.8495 26.9111 27.7665 27.8992 27.8339C28.8891 27.9015 29.6675 28.0953 30.2108 28.2795C30.4823 28.3715 30.6949 28.4611 30.846 28.5314C30.9216 28.5666 30.9818 28.5969 31.0263 28.6204C31.0486 28.6321 31.0669 28.6421 31.0813 28.6501C31.0885 28.6541 31.0947 28.6576 31.0999 28.6606L31.107 28.6646L31.11 28.6664L31.1114 28.6672L31.112 28.6675C31.1123 28.6677 31.1126 28.6679 30.5954 29.5508L31.1126 28.6679C31.6002 28.9536 31.7639 29.5804 31.4783 30.068C31.1941 30.5531 30.5722 30.7176 30.0857 30.4381C30.0839 30.4371 30.0797 30.4348 30.0733 30.4314C30.0572 30.423 30.0269 30.4075 29.9827 30.3869C29.8943 30.3458 29.7504 30.2843 29.5537 30.2176C29.1605 30.0843 28.556 29.9301 27.7598 29.8757C26.9619 29.8212 26.2904 29.8888 25.8241 29.9684C25.5915 30.008 25.4117 30.0504 25.295 30.0812C25.2367 30.0966 25.1944 30.109 25.1692 30.1167C25.1566 30.1205 25.1484 30.1232 25.1446 30.1244C25.1438 30.1247 25.1432 30.1249 25.1428 30.125Z" fill="black"/>
                  </svg>
                  <p className="text-[10px]">우울해요</p>
                </div>

                {/*그냥 그래요*/}
                <div className="flex flex-col items-center justify-center gap-1">
                  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="22" cy="22" r="22" fill="#C9CDFE"/>
                    <circle cx="16.7559" cy="17.0118" r="5.24419" fill="white"/>
                    <circle cx="16.8839" cy="17.1392" r="2.30233" fill="black"/>
                    <circle cx="27.2442" cy="17.0118" r="5.24419" fill="white"/>
                    <circle cx="27.3722" cy="17.1392" r="2.30233" fill="black"/>
                    <path d="M21.8545 24.2969C22.2615 24.2564 22.7769 24.4287 23.3594 24.8574C23.9335 25.28 24.5199 25.9146 25.0479 26.6865C26.1085 28.2374 26.872 30.25 26.8721 32.0068C26.8721 33.7414 26.2034 34.8621 25.2715 35.5635C24.3185 36.2807 23.0422 36.5938 21.8047 36.5938C20.5679 36.5937 19.3294 36.281 18.4121 35.5684C17.5144 34.8708 16.8721 33.7503 16.8721 32.0068C16.8721 30.2478 17.6083 28.2917 18.6377 26.7705C19.1501 26.0133 19.7224 25.3836 20.2881 24.9482C20.8611 24.5073 21.3827 24.2989 21.8047 24.2988H21.8301L21.8545 24.2969Z" fill="#FF4141" stroke="black"/>
                  </svg>
                  <p className="text-[10px]">그냥 그래요</p>
                </div>

                {/*좋아요*/}
                <div className="flex flex-col items-center justify-center gap-1">
                  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="22" cy="22" r="22" fill="#E8C6E8"/>
                    <circle cx="17.0118" cy="17.7793" r="5.24419" fill="white"/>
                    <circle cx="17.1397" cy="17.9068" r="2.30233" fill="black"/>
                    <circle cx="27.5" cy="17.7793" r="5.24419" fill="white"/>
                    <circle cx="27.628" cy="17.9068" r="2.30233" fill="black"/>
                    <path d="M25.8818 25.8428C30.6687 25.8428 34.5555 30.2879 30.9529 33.4401C28.6501 35.455 25.5269 36.587 22.2703 36.587C19.0137 36.587 15.8904 35.455 13.5877 33.4401C9.9851 30.2879 13.8718 25.8428 18.6588 25.8428L22.2703 25.8428H25.8818Z" fill="black"/>
                    <path d="M22.2075 30.2354C24.2413 30.2354 26.1921 30.9618 27.6304 32.2539C28.3861 32.933 28.9643 33.7416 29.3462 34.6191C27.2888 35.8892 24.8207 36.5869 22.269 36.5869C19.6758 36.5869 17.1684 35.8675 15.0913 34.5576C15.4734 33.7034 16.0452 32.9175 16.7837 32.2539C18.222 30.9616 20.1735 30.2354 22.2075 30.2354Z" fill="#FF4141"/>
                  </svg>
                  <p className="text-[10px]">좋아요</p>
                </div>

                {/*최고에요*/}
                <div className="flex flex-col items-center justify-center gap-1">
                  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="22" cy="22" r="22" fill="#EF9BCE"/>
                    <circle cx="27.2442" cy="17.0118" r="5.24419" fill="white"/>
                    <path d="M25.9651 14.5811C25.1881 14.5811 24.5581 15.2168 24.5581 16.0012C24.5581 16.6343 24.8043 18.1371 27.228 19.6562C27.2714 19.6831 27.3212 19.6973 27.3721 19.6973C27.4229 19.6973 27.4727 19.6831 27.5161 19.6562C29.9398 18.1371 30.186 16.6343 30.186 16.0012C30.186 15.2168 29.556 14.5811 28.779 14.5811C28.0021 14.5811 27.3721 15.4417 27.3721 15.4417C27.3721 15.4417 26.742 14.5811 25.9651 14.5811Z" fill="#C70451"/>
                    <circle cx="16.7559" cy="17.0118" r="5.24419" fill="white"/>
                    <path d="M15.4768 14.5811C14.6999 14.5811 14.0698 15.2168 14.0698 16.0012C14.0698 16.6343 14.316 18.1371 16.7397 19.6562C16.7831 19.6831 16.833 19.6973 16.8838 19.6973C16.9346 19.6973 16.9844 19.6831 17.0279 19.6562C19.4515 18.1371 19.6977 16.6343 19.6977 16.0012C19.6977 15.2168 19.0677 14.5811 18.2908 14.5811C17.5138 14.5811 16.8838 15.4417 16.8838 15.4417C16.8838 15.4417 16.2537 14.5811 15.4768 14.5811Z" fill="#C70451"/>
                    <path d="M14.251 28.3848C14.251 28.3848 17.4456 31.5715 22.2204 31.5715C26.9952 31.5715 29.7065 28.3848 29.7065 28.3848" stroke="#C70451" stroke-width="17" stroke-linecap="round"/>
                  </svg>
                  <p className="text-[10px]">
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
                className="w-[313px] h-[87px] bg-[#D1D5DB] rounded-[15px] text-[#7A6F66]  text-[14px] mt-[10px]" />
            {/*케어카드를 작성중입니다. */}       
            </div>
          )}  
      </div>  
      {/*다음 버튼, button 컴포넌트 사용*/}
      <Button onClick={nextStep} className="w-[329px] h-[50px] bg-[#484C52] rounded-[15px] text-white font-Medium text-[12px]"> 
        다음
      </Button>
    </div>
  )
}
