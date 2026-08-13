// src/features/auth/components/login-page.tsx
import React, { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google"; // 1. 구글 로그인 기능을 라이브러리에서 가져옵니다.

export default function LoginPage() {
  // 로그인 성공 여부를 저장하는 상태값 (true가 되면 성공 팝업창을 띄움)
  const [isSuccess, setIsSuccess] = useState(false);

  // 2. 구글 로그인 실행 함수 설정
  const login = useGoogleLogin({
    // 구글 로그인 성공 시 실행되는 콜백 함수
    onSuccess: (tokenResponse) => {
      console.log("구글 로그인 성공! 토큰 정보:", tokenResponse);
      setIsSuccess(true); // 성공 팝업 모달 노출
    },
    // 구글 로그인 실패 시 실행되는 콜백 함수
    onError: (error) => {
      console.error("구글 로그인 에러:", error);
      alert("로그인에 실패했습니다. 다시 시도해 주세요.");
    },
  });

  return (
    <div style={styles.container}>
      {/* ----------------- 1. 상단 타이틀 영역 ----------------- */}
      <div style={styles.topArea}>
        <h1 style={styles.title}>품결</h1>
        <p style={styles.subtitle}>
          임신의 시간을 <span style={styles.highlight}>품</span>은
          <br />
          피부<span style={styles.highlight}>결</span>의 기록
        </p>
      </div>

      {/* ----------------- 2. 중앙 문구 영역 ----------------- */}
      <div style={styles.centerArea}>
        <p style={styles.description}>엄마이기 전에, 하루 5분 나를 돌보는 시간</p>
      </div>

      {/* ----------------- 3. 하단 로그인 버튼 영역 ----------------- */}
      <div style={styles.bottomArea}>
        {/* 버튼을 클릭하면 위에 작성한 login() 함수가 실행되어 구글 팝업창이 뜹니다. */}
        <button style={styles.googleButton} onClick={() => login()}>
          {/* 구글 공식 SVG 로고 */}
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

      {/* ----------------- 4. 로그인 성공 테스트용 팝업 ----------------- */}
      {isSuccess && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3 style={{ textAlign: "center", marginBottom: "16px" }}>🎉 구글 로그인 성공!</h3>
            <p style={{ textAlign: "center", fontSize: "14px", marginBottom: "20px", color: "#666" }}>
              구글에서 발급해 준 액세스 토큰을 확인 ㄱㄱ
            </p>
            <button 
              onClick={() => setIsSuccess(false)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#E85D8B",
                color: "#fff",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------- UI 디자인 스타일 -----------------
const styles: Record<string, React.CSSProperties> = {
  // 모바일 393px 레이아웃 모듈
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
  // 상단 타이틀 위치
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
  // '품', '결' 분홍색 포인트 컬러
  highlight: {
    color: "#E85D8B",
    fontWeight: 700,
  },
  // 화면 중앙 문구 수직 정렬
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
  // 하단 구글 버튼 위치 (하단에서 18% 지점)
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
  // 로그인 성공 팝업 스타일
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: "16px",
    padding: "24px",
    boxSizing: "border-box",
  },
};