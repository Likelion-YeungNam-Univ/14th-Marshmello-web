//이미지 컨트롤러의 api를 가져옴
import {analyzeCheckInImage, type analyzeImageResponse,} from "@/features/test/checkin-Image-Controller"

export function validatePhoto(image: File,): Promise<analyzeImageResponse> {
  return analyzeCheckInImage({image,})
}