import { Button } from "@/shared/components/ui/button"
import { GoogleIcon } from "./google-icon"

const OIDC_LOGIN_URL =
  "https://marshmello-be.duckdns.org/oauth2/authorization/oidc"

export function GoogleLoginButton() {
  const handleGoogleLogin = () => {
    localStorage.setItem("loginStarted", "true")

    window.location.href = OIDC_LOGIN_URL
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleGoogleLogin}
      className="relative flex h-[56px] w-full items-center justify-center rounded-[14px] border border-[#D1D1D1] bg-white text-[15px] font-semibold text-[#4a4d55] shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:bg-gray-50 active:scale-[0.98]"
    >
      <div className="absolute left-5 flex items-center justify-center">
        <GoogleIcon />
      </div>

      구글 계정으로 로그인 및 회원가입
    </Button>
  )
}