import { Link } from "react-router-dom"

export function LogoutPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[393px] flex-col items-center justify-center px-5 text-center">
      <h1 className="text-xl font-semibold">로그아웃되었습니다.</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        다시 서비스를 이용하려면 홈으로 이동해주세요.
      </p>
      <Link
        className="mt-6 flex h-11 items-center justify-center rounded-[15px] bg-primary px-6 text-sm font-medium text-primary-foreground"
        to="/"
      >
        홈으로 돌아가기
      </Link>
    </main>
  )
}
