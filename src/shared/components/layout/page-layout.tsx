import { useCallback, type PropsWithChildren } from "react"
import { useNavigate } from "react-router-dom"

import {
  Header,
  type HeaderProps,
} from "@/shared/components/ui/header"
import { Navbar } from "@/shared/components/ui/navbar"
import { cn } from "@/shared/lib/utils"

export type PageLayoutVariant =
  | "default"
  | "home"
  | "care"
  | "checkin"
  | "content"
  | "mypage"

export type PageLayoutHeaderConfig = Pick<
  HeaderProps,
  | "className"
  | "onBack"
  | "rightAction"
  | "showBackButton"
  | "title"
  | "variant"
>

export type PageLayoutConfig = {
  showHeader?: boolean
  showNavbar?: boolean
  variant?: PageLayoutVariant
  header?: PageLayoutHeaderConfig
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
  mypage: "bg-page-mypage mypage-page-background",
}

export function PageLayout({
  children,
  className,
  header,
  onLogout,
  showHeader = true,
  showNavbar = true,
  variant = "default",
}: PageLayoutProps) {
  const navigate = useNavigate()
  const handleBack = useCallback(() => navigate(-1), [navigate])

  return (
    <div
      className={cn(
        "min-h-dvh",
        backgroundClassByVariant[variant],
        className,
      )}
    >
      {showHeader ? (
        <Header
          {...header}
          onBack={header?.onBack ?? handleBack}
          onLogout={onLogout}
        />
      ) : null}

      <div className={cn(showNavbar && "pb-[82px]")}>{children}</div>

      {showNavbar ? <Navbar /> : null}
    </div>
  )
}
