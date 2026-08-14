import type { PropsWithChildren } from "react"

import { Header } from "@/shared/components/ui/header"
import { Navbar } from "@/shared/components/ui/navbar"
import { cn } from "@/shared/lib/utils"

export type PageLayoutVariant =
  | "default"
  | "home"
  | "care"
  | "checkin"
  | "content"
  | "mypage"

export type PageLayoutConfig = {
  showHeader?: boolean
  showNavbar?: boolean
  variant?: PageLayoutVariant
}

type PageLayoutProps = PropsWithChildren<
  PageLayoutConfig & {
    className?: string
    onLogout?: () => void
  }
>

const backgroundClassByVariant: Record<PageLayoutVariant, string> = {
  care: "bg-page-care",
  checkin: "bg-page-checkin",
  content: "bg-page-content",
  default: "bg-page-default",
  home: "bg-page-home",
  mypage: "bg-page-mypage",
}

export function PageLayout({
  children,
  className,
  onLogout,
  showHeader = true,
  showNavbar = true,
  variant = "default",
}: PageLayoutProps) {
  return (
    <div
      className={cn(
        "min-h-dvh",
        backgroundClassByVariant[variant],
        showHeader && "pt-[var(--header-layout-height)]",
        showNavbar && "pb-[82px]",
        className,
      )}
    >
      {showHeader ? <Header onLogout={onLogout} /> : null}

      <div>{children}</div>

      {showNavbar ? <Navbar /> : null}
    </div>
  )
}
