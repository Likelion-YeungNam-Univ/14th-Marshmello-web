import type { ComponentPropsWithoutRef, ReactNode } from "react"
import { ArrowLeft, LogOut } from "lucide-react"

import { cn } from "@/shared/lib/utils"

export type HeaderVariant = "default" | "back"

export type HeaderProps = ComponentPropsWithoutRef<"header"> & {
  variant?: HeaderVariant
  title?: string
  showBackButton?: boolean
  onBack?: () => void
  rightAction?: ReactNode
  onLogout?: () => void
}

export function Header({
  className,
  onBack,
  onLogout,
  rightAction,
  showBackButton = false,
  title,
  variant = "default",
  ...props
}: HeaderProps) {
  const isBackHeader = variant === "back" || showBackButton

  return (
    <header
      className={cn(
        "h-[var(--header-layout-height)] w-full shrink-0 bg-transparent pt-[env(safe-area-inset-top)]",
        className,
      )}
      {...props}
    >
      {isBackHeader ? (
        <div className="relative mx-auto flex h-[52px] w-full max-w-[393px] items-center px-5 pt-5">
          <button
            aria-label="이전 페이지로 이동"
            className="flex size-6 shrink-0 items-center justify-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={onBack}
            type="button"
          >
            <ArrowLeft aria-hidden="true" className="size-6" strokeWidth={1.8} />
          </button>

          {title ? (
            <h1 className="pointer-events-none absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-[13px] font-medium text-black">
              {title}
            </h1>
          ) : null}

          <div className="ml-auto flex min-w-6 items-center justify-end">
            {rightAction}
          </div>
        </div>
      ) : (
        <div className="mx-auto flex h-[52px] w-full max-w-[393px] items-center justify-between px-5 pt-5">
          <span className="logo text-2xl leading-none" aria-label="품결">
            품결
          </span>

          {rightAction ?? (
            <button
              aria-haspopup="dialog"
              aria-label="로그아웃"
              className="relative flex size-6 shrink-0 items-center justify-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={onLogout}
              type="button"
            >
              <LogOut aria-hidden="true" className="size-6" strokeWidth={2} />
            </button>
          )}
        </div>
      )}
    </header>
  )
}
