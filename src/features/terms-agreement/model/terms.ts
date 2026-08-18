// src/features/terms-agreement/model/terms.ts
// 약관 데이터를 배열로 관리 (첨부 이미지의 4개 항목 기준)

import type { TermItem } from "./types"

export const TERMS: TermItem[] = [
  {
    id: "service",
    title: "서비스명 서비스 이용약관",
    required: true,
  },
  {
    id: "privacy",
    title: "개인정보 수집 및 이용 동의",
    required: true,
  },
  {
    id: "aiTraining",
    title: "AI 학습 활용 및 데이터 이용 동의",
    required: true,
  },
  {
    id: "marketing",
    title: "마케팅 정보 수신 동의",
    required: false,
  },
]