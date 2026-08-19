import { create } from "zustand"
import { persist } from "zustand/middleware"

type ProfileState = {
  dueDate: string
  name: string
  reset: () => void
  updateProfile: (profile: Pick<ProfileState, "dueDate" | "name">) => void
}

const initialProfile = {
  dueDate: "2027-02-03",
  name: "김다미",
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      ...initialProfile,
      reset: () => set(initialProfile),
      updateProfile: (profile) => set(profile),
    }),
    { name: "marshmello-profile" },
  ),
)
