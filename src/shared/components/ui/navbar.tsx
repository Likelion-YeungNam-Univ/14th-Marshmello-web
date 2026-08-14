import React from 'react'
import {ChartPie, Clock3, House, UserRound} from "lucide-react"
import {NavLink} from "react-router-dom"

//navbar 속성 4가지
const navItems = [
  { name: "홈", path: "/", icon: House },
  { name: "케어카드", path: "/care", icon: ChartPie },
  { name: "기록", path: "/records", icon: Clock3 },
  { name: "마이페이지", path: "/mypage", icon: UserRound },
]

//navbar 컴포넌트
export function Navbar() {
  return (
    // 모바일 환경에서 하단에 1px 틈이 보이는 현상을 방지하기 위해 1px 아래로 배치
    <nav className="fixed inset-x-0 -bottom-px z-50 border-t border-[#F1F1F1] bg-white pb-[env(safe-area-inset-bottom)]">
      {/*4칸으로 나누기 */}
      <div className="mx-auto grid h-[82px] max-w-[430px] grid-cols-4">
        {/*map으로 배열의 요소 메뉴 반복 생성 */}
        {navItems.map(function (item) {
          const Icon = item.icon

          return (
            //NavLink 생성
            <NavLink 
              key={item.path} to={item.path} end={item.path === "/"}
              //하단에 고정
              className={function ({ isActive }) {
                  return `
                    flex flex-col items-center justify-center gap-1 text-[12px]
                    ${isActive ? "text-[#F19ED2]" : "text-[#484C52]"}
                  `
              }} 
            >
              <Icon size={26} strokeWidth={2} />
              <span>
                {item.name}
              </span>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}

export default Navbar
