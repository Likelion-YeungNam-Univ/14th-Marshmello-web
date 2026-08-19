export type TimelineBodyDiary = {
  bodyRegion?: number
  stretchMark?: boolean
  comment?: string
}

export type TimelineCheckIn = {
  checkInId: number
  imageId: number
  achieved: boolean
  checkInDate: string
  diary: string
  emotion: number
  bodyDiaries: TimelineBodyDiary[]
}

export type TimelineImageResponse = {
  url: string
}

export type TimelineDetailData = {
  checkIn: TimelineCheckIn
  imageUrl: string | null
}