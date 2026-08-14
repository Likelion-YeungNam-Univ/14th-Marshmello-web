import { create } from "zustand"

interface CheckinFlowState {
  step: number //checkin page에서 사용
  conditionScore: number | null //컨디션 스코어 저장용
  selectedBodyPart: number | null // 신체 부위 저장용
  capturedPhoto: Blob | null //사진 저장용
  bodymapMemo : string // checkin bodymap에서 메모 저장용
  memo: string //checkin 4page에서 메모 저장용
  hasStretchMarks: boolean | null //튼살 유무 저장용
  practiceCare: boolean | null //케어카드 여부 저장용

  setStep: (step: number) => void
  prevStep: () => void
  nextStep: () => void

  setConditionScore: (score: number) => void
  setSelectedBodyPart: (bodyPart: number | null) => void
  setCapturedPhoto: (photo: Blob | null) => void
  setBodymapMemo: (bodymapMemo : string) => void
  setMemo: (memo: string) => void
  setHasStretchMarks: (value: boolean | null) => void 
  setPracticeCare: (care: boolean | null) => void 
  //null -> 아직 선택 안 함 / true -> 튼살 있음 / false -> 튼살 없음

  reset: () => void
}

const initialState = {
  step: 1,
  conditionScore: null,
  selectedBodyPart: null,
  capturedPhoto: null,
  bodymapMemo: "",
  memo: "",
  hasStretchMarks: null,
  practiceCare: null,
}

export const useCheckinFlowStore = create<CheckinFlowState>((set) => ({
  ...initialState,

  setStep: (step) => set({ step }),

  nextStep: () => set((state) => ({step: Math.min(state.step + 1, 4),})),
  prevStep: () => set((state) => ({step: Math.max(state.step - 1, 1),})),
  
  setConditionScore: (conditionScore) => set({ conditionScore }),
  setSelectedBodyPart: (selectedBodyPart) => set({ selectedBodyPart }),
  setCapturedPhoto: (capturedPhoto) => set({ capturedPhoto }),
  setBodymapMemo: (bodymapMemo) => set({ bodymapMemo}),
  setMemo: (memo) => set({ memo }),
  setHasStretchMarks: (hasStretchMarks) => set({ hasStretchMarks }),
  setPracticeCare: (practiceCare) => set({ practiceCare }), 

  reset: () => set(initialState),
}))
