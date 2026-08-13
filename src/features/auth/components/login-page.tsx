// src/features/auth/components/login-page.tsx
import React from "react";

export default function LoginPage() {
  const handleGoogleLogin = () => {
    // 구글 로그인 URL
    const BACKEND_GOOGLE_LOGIN_URL = "54.116.121.161";
    
        // 백엔드가 구축해둔 구글 인증 주소로 페이지 이동
    window.location.href = BACKEND_GOOGLE_LOGIN_URL;
  };

  return (
    <div style={styles.container}>
      {/* 1. 상단 타이틀 영역 */}
      <div style={styles.topArea}>
        <h1 style={styles.title}>품결</h1>
        <p style={styles.subtitle}>
          임신의 시간을 <span style={styles.highlight}>품</span>은
          <br />
          피부<span style={styles.highlight}>결</span>의 기록
        </p>
      </div>

      {/* 2. 중앙 문구 영역 */}
      <div style={styles.centerArea}>
        <p style={styles.description}>엄마이기 전에, 하루 5분 나를 돌보는 시간</p>
      </div>

      {/* 3. 하단 구글 로그인 버튼 영역 */}
      <div style={styles.bottomArea}>
        <button style={styles.googleButton} onClick={handleGoogleLogin}>
          <svg viewBox="0 0 48 48" style={styles.googleIcon}>
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            <path fill="none" d="M0 0h48v48H0z" />
          </svg>
          구글 계정으로 로그인하기
        </button>
      </div>
    </div>
  );
}

// UI 디자인 스타일
const styles: Record<string, React.CSSProperties> = {
  container: {
    position: "relative",
    width: "100%",
    maxWidth: "393px",
    height: "100dvh",
    margin: "0 auto",
    background: "linear-gradient(180deg, #F6BFD3 0%, #F8CBDB 30%, #FBDFE9 60%, #FDF0EF 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxSizing: "border-box",
    overflow: "hidden",
  },
  topArea: {
    position: "absolute",
    top: "22%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    margin: 0,
    fontSize: 34,
    fontWeight: 800,
    color: "#FFFFFF",
    textShadow: "0 2px 4px rgba(0,0,0,0.1)",
    marginBottom: 16,
  },
  subtitle: {
    margin: 0,
    fontSize: 15,
    lineHeight: 1.6,
    textAlign: "center",
    color: "#4A3B42",
  },
  highlight: {
    color: "#E85D8B",
    fontWeight: 700,
  },
  centerArea: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    width: "100%",
    textAlign: "center",
  },
  description: {
    margin: 0,
    fontSize: 14,
    color: "#4A3B42",
  },
  bottomArea: {
    position: "absolute",
    bottom: "18%",
    width: "100%",
    padding: "0 24px",
    boxSizing: "border-box",
  },
  googleButton: {
    width: "100%",
    height: 52,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 15,
    fontWeight: 500,
    color: "#757575",
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  googleIcon: {
    width: 22,
    height: 22,
    marginRight: 12,
  },
};