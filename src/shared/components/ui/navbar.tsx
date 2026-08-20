import { motion } from "framer-motion"
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
    <nav className="fixed inset-x-0 -bottom-px z-50 mx-auto w-full max-w-[393px] border-t border-[#F1F1F1] bg-white pb-[env(safe-area-inset-bottom)]">
      {/*4칸으로 나누기 */}
      <div className="grid h-[82px] w-full grid-cols-4">
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
                    relative flex min-w-0 items-center justify-center text-[12px] leading-normal transition-colors duration-200
                    ${isActive ? "text-[#F19ED2]" : "text-[#484C52]"}
                  `
              }} 
            >
              {({ isActive }) => (
                <span className="relative flex h-full w-full flex-col items-center justify-center gap-1">
                  <span className="flex h-[26px] items-center justify-center">
                    <motion.span
                      animate={{
                        scale: isActive ? 1.1 : 1,
                        y: isActive ? -2 : 0,
                      }}
                      className="flex size-[26px] items-center justify-center"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                      whileTap={{ scale: 0.92 }}
                    >
                      <Icon size={26} strokeWidth={2} />
                    </motion.span>
                  </span>

                  <span
                    className={`w-full text-center transition-[color,opacity] duration-200 ease-out ${
                      isActive
                        ? "text-[#F19ED2] opacity-100"
                        : "text-[#484C52] opacity-80"
                    }`}
                  >
                    {item.name}
                  </span>

                  {isActive ? (
                    <motion.span
                      className="absolute bottom-[8px] h-1 w-7 rounded-full bg-[#F19ED2]"
                      layoutId="navbar-active-indicator"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  ) : null}
                </span>
              )}
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}

export default Navbar
