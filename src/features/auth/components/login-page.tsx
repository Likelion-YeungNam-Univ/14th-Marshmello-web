// src/features/auth/components/login-page.tsx
import React from "react";
import GoogleIcon from "@/features/auth/components/google-icon";

export default function LoginPage() {
  const handleGoogleLogin = () => {
    // 구글 로그인 URL
    const BACKEND_GOOGLE_LOGIN_URL = "54.116.121.161";
    window.location.href = BACKEND_GOOGLE_LOGIN_URL;
  };

  return (
    <div style={styles.container}>
      <div style={styles.topArea}>
        <h1 style={styles.title}>품결</h1>
        <p style={styles.subtitle}>
          임신의 시간을 <span style={styles.highlight}>품</span>은
          <br />
          피부<span style={styles.highlight}>결</span>의 기록
        </p>
      </div>

      <div style={styles.centerArea}>
        <p style={styles.description}>엄마이기 전에, 하루 5분 나를 돌보는 시간</p>
      </div>

      <div style={styles.bottomArea}>
        <button style={styles.googleButton} onClick={handleGoogleLogin}>
          <GoogleIcon style={styles.googleIcon} />
          구글 계정으로 회원가입하기
        </button>
      </div>
    </div>
  );
}


const styles: Record<string, React.CSSProperties> = {
  container: {
    position: "relative",
    width: "100%",
    maxWidth: "393px",
    height: "100dvh",
    margin: "0 auto",
    background:
      "linear-gradient(180deg, #F2AEC9 0%, #F5BFD3 22%, #F8D6E2 42%, #FBE7E8 62%, #FBF1EA 80%, #FAF6EE 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxSizing: "border-box",
    overflow: "hidden",
  },
  topArea: {
    position: "absolute",
    top: "20%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    margin: 0,
    fontSize: 36,
    fontWeight: 800,
    letterSpacing: "2px",
    color: "#FFFFFF",
    textShadow:
      "0 0 16px rgba(255,255,255,0.85), 0 0 4px rgba(255,255,255,0.6), 0 2px 6px rgba(190, 90, 130, 0.15)",
    marginBottom: 16,
  },
  subtitle: {
    margin: 0,
    fontSize: 15,
    lineHeight: 1.6,
    textAlign: "center",
    color: "#5C4B52",
    fontWeight: 400,
  },
  highlight: {
    color: "#E85D8B",
    fontWeight: 700,
  },
  centerArea: {
    position: "absolute",
    top: "48%",
    transform: "translateY(-50%)",
    width: "100%",
    textAlign: "center",
  },
  description: {
    margin: 0,
    fontSize: 14,
    color: "#4A3B42",
    letterSpacing: "-0.2px",
    fontFamily: "var(--font-sans)",
  },
  bottomArea: {
    position: "absolute",
    bottom: "22%",
    width: "100%",
    padding: "0 24px",
    boxSizing: "border-box",
  },
  googleButton: {
    width: "100%",
    height: 54,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 15,
    fontWeight: 600,
    color: "#5E5E5E",
    cursor: "pointer",
    boxShadow: "0 4px 14px rgba(0, 0, 0, 0.05)",
  },
  googleIcon: {
    width: 22,
    height: 22,
    marginRight: 10,
  },
};
