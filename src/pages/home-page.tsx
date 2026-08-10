import { useState } from "react";
import {Link} from "react-router-dom";

export function HomePage() {
  const [hasCheckedIn, setHasCheckedIn] = useState(false); //체크인 여부 상태 확인

  //user이름, 임신주수, 케어카드 정보를 db로 받아야 함
  const userName : string = "다미" ;
  const pregnancy_date : Date = new Date("2027-02-03"); //출산 예정일
  
  //임신 주수 계산 함수
  const getPregnancyWeeks = (pregnancy_date : Date) =>{
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 오늘 날짜의 시간을 00:00:00으로 설정
    pregnancy_date.setHours(0, 0, 0, 0); // 출산 예정일의 시간을 00:00:00으로 설정

    const diffTime = pregnancy_date.getTime() - today.getTime(); // 두 날짜의 차이를 밀리초 단위로 계산
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // 밀리초를 일 단위로 변환
    const weeks = Math.floor(diffDays / 7); // 임신 주수 계산
    const days = diffDays % 7; // 임신 일수 계산

    return { weeks, days };
  }; 
  
  const weeks : number = getPregnancyWeeks(pregnancy_date).weeks; //임신 주수
  const days : number = getPregnancyWeeks(pregnancy_date).days; //임신 일수
  
  
  
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
              {weeks}주 {days}일 전
            </p>  
          </div>

          {/* 인사말 */}
          <div
            className="w-[180px] h-[34px] rounded-full bg-white flex items-center justify-center">
            <p className="text-[12px] font-medium text-[#777777]">
              좋은 아침이에요, {userName}님
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
        //체크인이 안됐을 때 (누르면 체크인 페이지로 이동)
        <Link to="/checkin" className="flex flex-row items-center justify-center w-[329px] h-[66px] bg-[#484C52] rounded-[15px] text-[16px] hover:shadow-md active:scale-95 ">
          <p className="text-white font-medium">오늘의 체크인</p>
        </Link>
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
