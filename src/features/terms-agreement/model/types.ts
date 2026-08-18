// src/features/terms-agreement/model/types.ts
// 약관 동의 기능에서 사용하는 타입 정의

/** 약관 1개 항목 */
export interface TermItem {
  /** 고유 id (체크 상태 관리 키로 사용) */
  id: string
  /** 화면에 노출되는 약관 제목 */
  title: string
  /** true: 필수 약관, false: 선택 약관 */
  required: boolean
}

/** 확인 버튼 클릭 시 부모 컴포넌트로 전달되는 결과 값 */
export interface TermsAgreementResult {
  /** 필수 약관을 모두 동의했는지 여부 (버튼이 활성화된 상태에서만 true로 전달됨) */
  requiredAgreed: boolean
  /** 선택 약관 id별 동의 여부 */
  optionalAgreed: Record<string, boolean>
}

export interface TermsDialogProps {
  /** 필수 약관에 모두 동의한 뒤 "시작하기" 클릭 시 호출 */
  onConfirm: (result: TermsAgreementResult) => void
  /** 팝업 열림 상태 변경 (닫기 버튼 클릭 시 호출) */
  onOpenChange: (open: boolean) => void
  /** 팝업 열림 여부 */
  open: boolean
  /** 기본 약관 목록(TERMS) 대신 사용할 약관 목록 (선택) */
  terms?: TermItem[]
}