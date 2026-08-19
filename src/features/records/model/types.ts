import type {
  ReportResponse,
} from "@/features/test/report-Controller"

export type EmotionByDate = {
  date: string
  emotion: number
}

export type MoodType = "good" | "normal" | "bad" | "none"

export type CalendarDay = {
  date: number
  emotion: number | null
}

export type RecordsData = {
  requestMonth: string
  count: number
  achievedCount: number
  emotions: EmotionByDate[]
  topBodyRegion: number | null
  report: ReportResponse | null
}