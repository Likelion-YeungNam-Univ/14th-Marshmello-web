import { useState } from "react";

export function HomePage() {
  //user이름, 임신주수, 케어카드 정보를 db로 받아야 함
  const [hasCheckedIn, setHasCheckedIn] = useState(false); //체크인 여부 상태 확인
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 gap-4">
      {/*프로필 창*/}
      <div className="flex flex-row items-center justify-center w-[335px] h-[140px] bg-[#F5F5F5] rounded-lg gap-2">
        {/* 왼쪽 아기 이미지 */}
        <div className="w-[82px] h-[94px] bg-[#D9D9D9] overflow-hidden ">
          {/* 실제 이미지가 있으면 아래처럼 사용 */}

          {/* 
          <img
            src="/images/baby.png"
            alt="아기"
            className="w-full h-full object-cover"
          />
          */}

        </div>

        <div className="flex flex-col w-[180px] h-[94px] justify-between">
          {/* 임신 남은 기간 */}
          <div className="flex items-center justify-center h-[60px] ">
            <p className="w-[100px] text-[13px] leading-[16px] font-medium text-[#000000]">
            아기와 만나기
              <br />
              {/* 여기에 임신 남은 기간 계산하기 */}
              {/*몇 주*/}주 {/*몇 일*/}일 전
            </p>  
          </div>

          {/* 인사말 */}
          <div
            className="w-[180px] h-[34px] rounded-full bg-white flex items-center justify-center">
            <p className="text-[12px] font-medium text-[#777777]">
              좋은 아침이에요, {/* 사용자 이름 */}님
            </p>
          </div>
        </div>      
      </div>

      {/*오늘의 체크인 창*/}
      {/* 체크인 되어있으면 앞의 결과, 만약 체크인이 되어있지 않다면 뒤에꺼 */}
      {hasCheckedIn ? (
        //체크인 됐을 때
        <div className="flex flex-row items-center justify-center w-[329px] h-[66px] bg-[#C07F7D] rounded-[15px] text-[16px]">
          <p className="text-white font-medium">오늘의 체크인</p>
        </div>
      ) : (
        //체크인이 안됐을 때
        <div className="flex flex-row items-center justify-center w-[329px] h-[66px] bg-[#484C52] rounded-[15px] text-[16px] hover:shadow-md active:scale-95 ">
          <p className="text-white font-medium">오늘의 체크인</p>
        </div>
      )}

      {/*오늘의 케어카드*/}
      <div  className="flex flex-col items-center justify-center w-[329px] h-[141px] bg-[#FFFFFF] rounded-[15px] border border-[#000000]">
        <h2 className="text-[#484C52] font-bold text-[12px] ">
          오늘의 케어카드
        </h2>
        <div className="flex flex-col items-center justify-center  w-[287px] h-[89px]">
          {hasCheckedIn ? (
            <p className="text-[#000000] text-[16px] justify-center ">
              {/* 체크인 결과에 따라 다른 내용 표시 */}
            </p>  
          ) : (
              <p className="text-[#000000] text-[16px] justify-center ">
                체크인을 완료해주세요
              </p>
          )}
        </div>  
      </div>
      
      {/* 이 시기 흔히 겪는 변화 */}
      {hasCheckedIn || (
        <div className="flex flex-col justify-center w-[310px] h-[80px] bg-[#FFDDDB] ">
          <p className="text-[#484C52] text-[10px] m-2">
            이 시기 흔히 겪는 변화
          </p>
          <p className="text-[#000000] text-[11px] m-2">
            임신 중반 초산모의 대다수가 이맘때 배와 가슴 피부가 당기는걸 느껴요. 자연스러운 변화에요
          </p>
        </div> )
      }

      {/*앱 정보*/}
      <div className="flex flex-row items-center justify-between w-[329px] h-[141px] bg-[#FFFFFF] rounded-lg">
        
      </div>
    </div>
  )
}
