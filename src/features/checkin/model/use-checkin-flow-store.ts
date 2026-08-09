import { create } from "zustand"

interface CheckinFlowState {
  conditionScore: number | null
  selectedBodyPart: string | null
  capturedPhoto: Blob | null
  setConditionScore: (score: number) => void
  setSelectedBodyPart: (bodyPart: string | null) => void
  setCapturedPhoto: (photo: Blob | null) => void
  reset: () => void
}

const initialState = {
  conditionScore: null,
  selectedBodyPart: null,
  capturedPhoto: null,
}

export const useCheckinFlowStore = create<CheckinFlowState>((set) => ({
  ...initialState,
  setConditionScore: (conditionScore) => set({ conditionScore }),
  setSelectedBodyPart: (selectedBodyPart) => set({ selectedBodyPart }),
  setCapturedPhoto: (capturedPhoto) => set({ capturedPhoto }),
  reset: () => set(initialState),
}))
