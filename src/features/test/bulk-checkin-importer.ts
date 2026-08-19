import axios from "axios"

import {
  createCheckIn,
  type bodyDiaryRequest,
} from "@/features/test/checkin_Controller"
import {
  analyzeCheckInImage,
} from "@/features/test/checkin-Image-Controller"

type EmotionLabel =
  | "우울해요"
  | "그냥그래요"
  | "좋아요"
  | "최고예요"

type MockCheckIn = {
  date: string
  checkedIn: boolean
  achieved?: "예" | "아니요"
  emotion?: EmotionLabel
  diary?: string
  bodyDiaries?: bodyDiaryRequest[]
}

export type BulkCheckInProgress = {
  stage: "image" | "checkIn"
  currentDate: string
  currentImageName: string
  processedCount: number
  totalCount: number
  successCount: number
  failureCount: number
}

type BulkRequestFailure = {
  stage: "image" | "checkIn"
  date: string
  imageName?: string
  status?: number
  data: unknown
}

type BulkCheckInSuccess = {
  date: string
  imageName: string
  imageId: number
  checkInId: number
}

export type BulkCheckInImportResult = {
  sourceCount: number
  targetCount: number
  skippedUncheckedCount: number
  processedCount: number
  successCount: number
  failureCount: number
  usedImageCount: number
  unusedImageCount: number
  aborted: boolean
  abortedReason?: string
  successes: BulkCheckInSuccess[]
  failures: BulkRequestFailure[]
  rejectedImages: BulkRequestFailure[]
}

type ImportMockCheckInsParams = {
  jsonFile: File
  imageFiles: File[]
  onProgress?: (progress: BulkCheckInProgress) => void
}

const emotionMap: Record<EmotionLabel, number> = {
  우울해요: 1,
  그냥그래요: 2,
  좋아요: 3,
  최고예요: 4,
}

const supportedImageExtension =
  /\.(jpe?g|png|webp)$/i

function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function isValidDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false
  }

  const date = new Date(`${value}T00:00:00Z`)

  return (
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value
  )
}

function parseBodyDiaries(
  value: unknown,
  index: number,
): bodyDiaryRequest[] {
  if (!Array.isArray(value)) {
    throw new Error(
      `[${index}].bodyDiaries는 배열이어야 합니다.`,
    )
  }

  return value.map((item, bodyIndex) => {
    if (!isRecord(item)) {
      throw new Error(
        `[${index}].bodyDiaries[${bodyIndex}] 형식이 올바르지 않습니다.`,
      )
    }

    const bodyRegion = item.bodyRegion
    const stretchMark = item.stretchMark
    const comment = item.comment

    if (
      !Number.isInteger(bodyRegion) ||
      Number(bodyRegion) < 1 ||
      Number(bodyRegion) > 8
    ) {
      throw new Error(
        `[${index}].bodyDiaries[${bodyIndex}].bodyRegion은 1~8 정수여야 합니다.`,
      )
    }

    if (typeof stretchMark !== "boolean") {
      throw new Error(
        `[${index}].bodyDiaries[${bodyIndex}].stretchMark는 boolean이어야 합니다.`,
      )
    }

    if (
      typeof comment !== "string" ||
      comment.length > 50
    ) {
      throw new Error(
        `[${index}].bodyDiaries[${bodyIndex}].comment는 최대 50자 문자열이어야 합니다.`,
      )
    }

    return {
      bodyRegion: Number(bodyRegion),
      stretchMark,
      comment,
    }
  })
}

async function parseMockCheckIns(
  jsonFile: File,
): Promise<MockCheckIn[]> {
  let parsed: unknown

  try {
    parsed = JSON.parse(await jsonFile.text())
  } catch {
    throw new Error("선택한 파일이 올바른 JSON 형식이 아닙니다.")
  }

  if (!Array.isArray(parsed)) {
    throw new Error("체크인 JSON의 최상위 값은 배열이어야 합니다.")
  }

  const dates = new Set<string>()

  return parsed.map((item, index) => {
    if (!isRecord(item)) {
      throw new Error(`[${index}] 체크인 형식이 올바르지 않습니다.`)
    }

    const date = item.date
    const checkedIn = item.checkedIn

    if (typeof date !== "string" || !isValidDate(date)) {
      throw new Error(`[${index}].date 형식이 올바르지 않습니다.`)
    }

    if (dates.has(date)) {
      throw new Error(`중복된 날짜가 있습니다: ${date}`)
    }

    dates.add(date)

    if (typeof checkedIn !== "boolean") {
      throw new Error(`[${index}].checkedIn은 boolean이어야 합니다.`)
    }

    if (!checkedIn) {
      return {
        date,
        checkedIn,
      }
    }

    const achieved = item.achieved
    const emotion = item.emotion
    const diary = item.diary

    if (achieved !== "예" && achieved !== "아니요") {
      throw new Error(`[${index}].achieved 값이 올바르지 않습니다.`)
    }

    if (
      typeof emotion !== "string" ||
      !(emotion in emotionMap)
    ) {
      throw new Error(`[${index}].emotion 값이 올바르지 않습니다.`)
    }

    if (typeof diary !== "string" || diary.length > 255) {
      throw new Error(`[${index}].diary는 최대 255자 문자열이어야 합니다.`)
    }

    return {
      date,
      checkedIn,
      achieved,
      emotion: emotion as EmotionLabel,
      diary,
      bodyDiaries: parseBodyDiaries(
        item.bodyDiaries,
        index,
      ),
    }
  })
}

function shuffleImages(imageFiles: File[]) {
  const shuffled = [...imageFiles]

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(
      Math.random() * (index + 1),
    )

    const current = shuffled[index]
    shuffled[index] = shuffled[randomIndex]
    shuffled[randomIndex] = current
  }

  return shuffled
}

function createFailure(
  stage: BulkRequestFailure["stage"],
  date: string,
  error: unknown,
  imageName?: string,
): BulkRequestFailure {
  if (axios.isAxiosError(error)) {
    return {
      stage,
      date,
      imageName,
      status: error.response?.status,
      data:
        error.response?.data ??
        error.message,
    }
  }

  return {
    stage,
    date,
    imageName,
    data:
      error instanceof Error
        ? error.message
        : "알 수 없는 오류가 발생했습니다.",
  }
}

function isAuthorizationFailure(
  failure: BulkRequestFailure,
) {
  return failure.status === 401 || failure.status === 403
}

export async function importMockCheckIns({
  jsonFile,
  imageFiles,
  onProgress,
}: ImportMockCheckInsParams): Promise<BulkCheckInImportResult> {
  const source = await parseMockCheckIns(jsonFile)
  const targets = source
    .filter((item) => item.checkedIn)
    .sort((left, right) => left.date.localeCompare(right.date))
  const images = shuffleImages(
    imageFiles.filter((file) =>
      supportedImageExtension.test(file.name),
    ),
  )

  if (targets.length === 0) {
    throw new Error("JSON에 checkedIn이 true인 항목이 없습니다.")
  }

  if (images.length === 0) {
    throw new Error("사용할 수 있는 이미지 파일이 없습니다.")
  }

  const successes: BulkCheckInSuccess[] = []
  const failures: BulkRequestFailure[] = []
  const rejectedImages: BulkRequestFailure[] = []
  let imageIndex = 0
  let consecutiveCheckInFailures = 0
  let abortedReason: string | undefined

  for (const item of targets) {
    let imageAttemptCount = 0
    let completed = false

    while (
      imageAttemptCount < 5 &&
      imageIndex < images.length
    ) {
      const image = images[imageIndex]
      imageIndex += 1
      imageAttemptCount += 1

      onProgress?.({
        stage: "image",
        currentDate: item.date,
        currentImageName: image.name,
        processedCount: successes.length + failures.length,
        totalCount: targets.length,
        successCount: successes.length,
        failureCount: failures.length,
      })

      let imageId: number

      try {
        const imageResponse =
          await analyzeCheckInImage({ image })

        if (!imageResponse.detected) {
          throw new Error("복부 이미지로 인식되지 않았습니다.")
        }

        imageId = imageResponse.imageId
      } catch (error) {
        const failure = createFailure(
          "image",
          item.date,
          error,
          image.name,
        )
        rejectedImages.push(failure)

        if (isAuthorizationFailure(failure)) {
          abortedReason =
            `이미지 요청에서 HTTP ${failure.status} 오류가 발생했습니다.`
          break
        }

        continue
      }

      onProgress?.({
        stage: "checkIn",
        currentDate: item.date,
        currentImageName: image.name,
        processedCount: successes.length + failures.length,
        totalCount: targets.length,
        successCount: successes.length,
        failureCount: failures.length,
      })

      try {
        const response = await createCheckIn(
          item.date,
          {
            imageId,
            achieved: item.achieved === "예",
            diary: item.diary,
            emotion: emotionMap[item.emotion as EmotionLabel],
            bodyDiaries: item.bodyDiaries ?? [],
          },
        )

        successes.push({
          date: item.date,
          imageName: image.name,
          imageId,
          checkInId: response.checkInId,
        })
        consecutiveCheckInFailures = 0
        completed = true
      } catch (error) {
        const failure = createFailure(
          "checkIn",
          item.date,
          error,
          image.name,
        )
        failures.push(failure)
        consecutiveCheckInFailures += 1
        completed = true

        if (isAuthorizationFailure(failure)) {
          abortedReason =
            `체크인 요청에서 HTTP ${failure.status} 오류가 발생했습니다.`
        } else if (consecutiveCheckInFailures >= 3) {
          abortedReason =
            "체크인 생성이 연속 3회 실패해 중단했습니다."
        }
      }

      break
    }

    if (abortedReason) break

    if (!completed) {
      failures.push({
        stage: "image",
        date: item.date,
        data:
          imageIndex >= images.length
            ? "사용할 이미지가 모두 소진되었습니다."
            : "서로 다른 이미지 5개의 분석이 모두 실패했습니다.",
      })
    }

    const lastImageName =
      imageIndex > 0
        ? images[imageIndex - 1].name
        : ""

    onProgress?.({
      stage: "checkIn",
      currentDate: item.date,
      currentImageName: lastImageName,
      processedCount: successes.length + failures.length,
      totalCount: targets.length,
      successCount: successes.length,
      failureCount: failures.length,
    })

    if (imageIndex >= images.length) {
      abortedReason = "사용할 이미지가 모두 소진되었습니다."
      break
    }
  }

  const processedCount =
    successes.length + failures.length

  return {
    sourceCount: source.length,
    targetCount: targets.length,
    skippedUncheckedCount:
      source.length - targets.length,
    processedCount,
    successCount: successes.length,
    failureCount: failures.length,
    usedImageCount: imageIndex,
    unusedImageCount: images.length - imageIndex,
    aborted: abortedReason !== undefined,
    abortedReason,
    successes,
    failures,
    rejectedImages,
  }
}
