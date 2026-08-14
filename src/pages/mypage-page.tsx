import {
  ChevronRight,
  Frown,
  Headphones,
  PenLine,
  type LucideIcon,
} from "lucide-react"

import profilePlaceholder from "@/assets/mypage/profile-placeholder.svg"

type MyPageMenuItem = {
  icon: LucideIcon
  label: string
}

const user = {
  email: "dami89@gmail.com",
  name: "김다미",
}

const menuItems: MyPageMenuItem[] = [
  { icon: PenLine, label: "회원정보 수정하기" },
  { icon: Frown, label: "계정 탈퇴하기" },
  { icon: Headphones, label: "고객센터" },
]

function MyPageMenuRow({ icon: Icon, label }: MyPageMenuItem) {
  return (
    <button
      aria-label={`${label} 페이지로 이동`}
      className="flex h-[54px] w-full items-center border-b border-[#e8e8e8] text-[#555] transition-colors hover:text-[#181d27] focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f19ed2]/40"
      type="button"
    >
      <span className="ml-4 flex size-6 shrink-0 items-center justify-center">
        <Icon aria-hidden="true" className="size-6" strokeWidth={1.7} />
      </span>

      <span aria-hidden="true" className="ml-[15px] h-9 w-px bg-[#e8e8e8]" />

      <span className="ml-[15px] text-[16px] leading-[19.5px]">{label}</span>

      <ChevronRight
        aria-hidden="true"
        className="ml-auto mr-[5px] size-6 shrink-0"
        strokeWidth={1.7}
      />
    </button>
  )
}

export function MyPage() {
  return (
    <section
      aria-labelledby="mypage-user-name"
      className="mx-auto min-h-[calc(100svh-82px)] w-full max-w-[393px] bg-white px-5 pt-[117px]"
    >
      <div className="flex flex-col items-center text-center">
        <img
          alt={`${user.name} 프로필`}
          className="size-[72px] shrink-0"
          src={profilePlaceholder}
        />

        <h1
          className="mt-[21px] text-[16px] leading-6 font-bold text-[#181d27]"
          id="mypage-user-name"
        >
          {user.name}님
        </h1>
        <p className="text-[13px] leading-[19.5px] text-[#ababab]">
          {user.email}
        </p>
      </div>

      <ul aria-label="마이페이지 메뉴" className="mt-10 w-[343px] max-w-full">
        {menuItems.map((item) => (
          <li className="mb-[11px] last:mb-0" key={item.label}>
            <MyPageMenuRow {...item} />
          </li>
        ))}
      </ul>
    </section>
  )
}
