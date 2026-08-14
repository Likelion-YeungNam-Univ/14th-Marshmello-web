import React, { useEffect, useRef } from "react";
import logoImg from "@/assets/logo.png";


interface SplashScreenProps {
  /** 스플래시 노출 시간(ms). 기본값 5000ms (5초) */
  durationMs?: number;
  onFinish: () => void;
}

export default function SplashScreen({
  durationMs = 5000,
  onFinish,
}: SplashScreenProps) {
  const onFinishRef = useRef(onFinish);

  // 최신 onFinish 콜백 참조 유지
  useEffect(() => {
    onFinishRef.current = onFinish;
  }, [onFinish]);

  // 타이머 실행 (마운트 시 1회)
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinishRef.current();
    }, durationMs);

    return () => clearTimeout(timer);
  }, [durationMs]);

  return (
    <div style={styles.container}>
      <div style={styles.center}>
        <div style={styles.logoBadge}>
          <img src={logoImg} alt="품결 로고" style={styles.logoImage} />
        </div>
        <h1 style={styles.title}>품결</h1>
        
        {/* 텍스트 변경 및 '품', '결' 흰색(#FFFFFF) 스타일 적용 */}
        <p style={styles.subtitle}>
          임신의 시간을 <span style={{ color: "#FFFFFF", fontWeight: 500 }}>품</span>은
          <br />
          피부<span style={{ color: "#FFFFFF", fontWeight: 500 }}>결</span>의 기록
        </p>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: "relative",
    width: "100%",
    maxWidth: "393px", // 아이폰 14 Pro
    height: "100dvh",  
    margin: "0 auto",   
    background:
      "linear-gradient(180deg, #F6BFD3 0%, #F8CBDB 30%, #FBDFE9 60%, #FDF0EF 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    fontFamily:
      "'Pretendard', -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', sans-serif",
  },
  center: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 16,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 18,
    background: "#26221F",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 8px 20px rgba(0,0,0,0.18)",
    marginBottom: 8,
    padding: 12,
    boxSizing: "border-box",
  },
  logoImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  title: {
    margin: 0,
    fontSize: 26,
    fontWeight: 700,
    letterSpacing: 2,
    color: "#FFFFFF",
    textShadow: "0 1px 2px rgba(0,0,0,0.05)",
  },
  subtitle: {
    margin: 0,
    fontSize: 14,
    lineHeight: 1.6,
    textAlign: "center",
    color: "rgba(90, 60, 70, 0.75)",
  },
};