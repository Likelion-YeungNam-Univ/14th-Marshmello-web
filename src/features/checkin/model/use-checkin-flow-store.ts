import { create } from "zustand"

interface CheckinFlowState {
  step: number //checkin page에서 사용
  conditionScore: number | null
  selectedBodyPart: number | null
  capturedPhoto: Blob | null
  memo: string //checkin page에서 메모 저장용
  hasStretchMarks: boolean | null

  setStep: (step: number) => void
  nextStep: () => void

  setConditionScore: (score: number) => void
  setSelectedBodyPart: (bodyPart: number | null) => void
  setCapturedPhoto: (photo: Blob | null) => void
  setMemo: (memo: string) => void
  setHasStretchMarks: (value: boolean | null) => void 
  //null -> 아직 선택 안 함 / true -> 튼살 있음 / false -> 튼살 없음

  reset: () => void
}

const initialState = {
  step: 1,
  conditionScore: null,
  selectedBodyPart: null,
  capturedPhoto: null,
  memo: "",
  hasStretchMarks: null,
}

export const useCheckinFlowStore = create<CheckinFlowState>((set) => ({
  ...initialState,

  setStep: (step) => set({ step }),

  nextStep: () => set((state) => ({step: Math.min(state.step + 1, 4),})),
  
  setConditionScore: (conditionScore) => set({ conditionScore }),
  setSelectedBodyPart: (selectedBodyPart) => set({ selectedBodyPart }),
  setCapturedPhoto: (capturedPhoto) => set({ capturedPhoto }),
  setMemo: (memo) => set({ memo }),
  setHasStretchMarks: (hasStretchMarks) =>
  set({ hasStretchMarks }),
  
  reset: () => set(initialState),
}))
