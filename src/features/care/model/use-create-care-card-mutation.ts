import { useMutation } from "@tanstack/react-query"

import { createCareCard } from "@/features/care/api/create-care-card"

export function useCreateCareCardMutation() {
  return useMutation({
    mutationFn: (checkInId: number) => createCareCard(checkInId),
  })
}
