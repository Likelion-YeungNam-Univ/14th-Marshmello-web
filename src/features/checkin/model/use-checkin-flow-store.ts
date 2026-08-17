import { create } from "zustand"

interface BodyPartAnswer {
  bodymapMemo: string
  hasStretchMarks: boolean | null
}

interface CheckinFlowState {
  step: number //checkin page에서 사용
  conditionScore: number | null //컨디션 스코어 저장용
  selectedBodyPart: number | null // 신체 부위 저장용
  capturedPhoto: Blob | null //사진 저장용
  memo: string //checkin 4page에서 메모 저장용
  practiceCare: boolean | null //케어카드 여부 저장용
  bodyPartAnswers: Record<number, BodyPartAnswer>

  setStep: (step: number) => void
  prevStep: () => void
  nextStep: () => void

  setConditionScore: (score: number) => void
  setSelectedBodyPart: (bodyPart: number | null) => void
  setCapturedPhoto: (photo: Blob | null) => void
  setMemo: (memo : string) => void
  setPracticeCare: (care: boolean | null) => void 
  setBodyPartAnswer: (
    partId: number,
    answer: Partial<BodyPartAnswer>,
  ) => void
  //null -> 아직 선택 안 함 / true -> 튼살 있음 / false -> 튼살 없음

  reset: () => void
}

const initialState = {
  step: 1,
  conditionScore: null,
  selectedBodyPart: null,
  capturedPhoto: null,

  bodyPartAnswers: {
    1: { bodymapMemo: "", hasStretchMarks: null },
    2: { bodymapMemo: "", hasStretchMarks: null },
    3: { bodymapMemo: "", hasStretchMarks: null },
    4: { bodymapMemo: "", hasStretchMarks: null },
    5: { bodymapMemo: "", hasStretchMarks: null },
    6: { bodymapMemo: "", hasStretchMarks: null },
    7: { bodymapMemo: "", hasStretchMarks: null },
  },
  memo: "",
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
  setMemo: (memo) => set({ memo }),
  setBodyPartAnswer: (partId, answer) => set((state) => ({bodyPartAnswers: {...state.bodyPartAnswers, [partId]: {...state.bodyPartAnswers[partId], ...answer,},},})),
  setPracticeCare: (practiceCare) => set({ practiceCare }), 

  reset: () => set(initialState),
}))
