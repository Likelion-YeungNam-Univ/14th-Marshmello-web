import { create } from "zustand"

interface CheckinFlowState {
  step: number //checkin page에서 사용
  conditionScore: number | null
  selectedBodyPart: string | null
  capturedPhoto: Blob | null
  memo: string //checkin page에서 메모 저장용

  setStep: (step: number) => void
  nextStep: () => void

  setConditionScore: (score: number) => void
  setSelectedBodyPart: (bodyPart: string | null) => void
  setCapturedPhoto: (photo: Blob | null) => void
  setMemo: (memo: string) => void

  reset: () => void
}

const initialState = {
  step: 1,
  conditionScore: null,
  selectedBodyPart: null,
  capturedPhoto: null,
  memo: "",
}

export const useCheckinFlowStore = create<CheckinFlowState>((set) => ({
  ...initialState,

  setStep: (step) => set({ step }),

  nextStep: () => set((state) => ({step: Math.min(state.step + 1, 4),})),
  
  setConditionScore: (conditionScore) => set({ conditionScore }),
  setSelectedBodyPart: (selectedBodyPart) => set({ selectedBodyPart }),
  setCapturedPhoto: (capturedPhoto) => set({ capturedPhoto }),
  setMemo: (memo) => set({ memo }),
  
  reset: () => set(initialState),
}))
