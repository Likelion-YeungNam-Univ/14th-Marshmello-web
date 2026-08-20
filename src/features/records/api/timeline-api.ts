import { apiClient } from "@/shared/api/axios"

import type {
  TimelineCheckIn,
} from "../model/timeline-types"

export async function getTimelineCheckIn(
  date: string,
): Promise<TimelineCheckIn[]> {
  const response =
    await apiClient.get<
      TimelineCheckIn[]
    >(
      `/api/check-ins?date=${date}`,
    )

  return response.data
}

export async function getTimelineImageUrl(
  imageId: number,
): Promise<string> {
  const response =
    await apiClient.get(
      `/api/check-ins/images/${imageId}/url`,
    )

  const data =
    response.data as unknown

  if (typeof data === "string") {
    return data
  }

  if (
    data &&
    typeof data === "object"
  ) {
    const imageData =
      data as Record<
        string,
        unknown
      >

    if (
      typeof imageData.url ===
      "string"
    ) {
      return imageData.url
    }

    if (
      typeof imageData.imageUrl ===
      "string"
    ) {
      return imageData.imageUrl
    }

    if (
      typeof imageData.presignedUrl ===
      "string"
    ) {
      return imageData.presignedUrl
    }
  }

  throw new Error(
    "이미지 URL을 확인할 수 없습니다.",
  )
}

export async function deleteTimelineCheckIn(
  checkInId: number,
  date: string,
): Promise<void> {
  await apiClient.delete(
    `/api/check-ins/${checkInId}`,
    {
      params: {
        date,
      },
    },
  )
}