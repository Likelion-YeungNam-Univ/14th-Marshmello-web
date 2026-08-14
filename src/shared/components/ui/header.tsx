import type { ComponentProps } from "react"
import { LogOut } from "lucide-react"

import { cn } from "@/shared/lib/utils"

type HeaderProps = ComponentProps<"header"> & {
  onLogout?: () => void
}

export function Header({ className, onLogout, ...props }: HeaderProps) {
  return (
    <header
      className={cn(
        "mx-auto flex h-4 w-full max-w-[393px] items-center justify-between bg-transparent px-[20px]",
        className,
      )}
      {...props}
    >
      <span className="logo text-2xl leading-none" aria-label="품결">
        품결
      </span>

      <button
        aria-label="로그아웃"
        className="relative flex size-6 shrink-0 items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        onClick={onLogout}
        type="button"
      >
        <LogOut aria-hidden="true" className="size-6" strokeWidth={2} />
      </button>
    </header>
  )
}
