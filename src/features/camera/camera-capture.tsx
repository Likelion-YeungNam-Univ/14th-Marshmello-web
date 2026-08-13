import { useEffect, useRef, useState } from "react"
import { Camera, RotateCcw, X } from "lucide-react"

import { useCheckinFlowStore } from "@/features/checkin/model/use-checkin-flow-store"
import { Button } from "@/shared/components/ui/button"

type CameraStatus = "idle" | "opening" | "preview" | "captured"

export function CameraCapture() {
  //zustand에 카메라 정보 저장
  const capturedPhoto = useCheckinFlowStore((state) => state.capturedPhoto)
  const setCapturedPhoto = useCheckinFlowStore((state) => state.setCapturedPhoto)

  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [cameraStatus, setCameraStatus] = useState<CameraStatus>(
    capturedPhoto ? "captured" : "idle",
  )
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    setCameraStream(null)
  }

  useEffect(() => {
    if (!cameraStream || !videoRef.current) {
      return
    }  
    videoRef.current.srcObject = cameraStream
    void videoRef.current.play()
  }, [cameraStream])

  useEffect(() => {
    if (!capturedPhoto) {
      setPreviewUrl(null)
      return
    }

    const objectUrl = URL.createObjectURL(capturedPhoto)
    setPreviewUrl(objectUrl)

    return (() => URL.revokeObjectURL(objectUrl))
  }, [capturedPhoto])

  useEffect(() => {
    return ( 
      () => {streamRef.current?.getTracks().forEach((track) => track.stop())}
    )  
  }, [])

  const startCamera = async () => {
    setErrorMessage(null)

    if (!navigator.mediaDevices?.getUserMedia) {
      setErrorMessage("이 브라우저에서는 카메라를 사용할 수 없어요.")
      return
    }

    try {
      setCameraStatus("opening")

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })

      streamRef.current = stream
      setCameraStream(stream)
      setCameraStatus("preview")
    } catch (error) {
      setCameraStatus(capturedPhoto ? "captured" : "idle")

      if (error instanceof DOMException && error.name === "NotAllowedError") {
        setErrorMessage("사진 촬영을 위해 카메라 권한을 허용해주세요.")
        return
      }

      if (error instanceof DOMException && error.name === "NotFoundError") {
        setErrorMessage("사용할 수 있는 카메라를 찾지 못했어요.")
        return
      }

      setErrorMessage("카메라를 열지 못했어요. 잠시 후 다시 시도해주세요.")
    }
  }

  const closeCamera = () => {
    stopCamera()
    setCameraStatus(capturedPhoto ? "captured" : "idle")
  }

  const capturePhoto = () => {
    const video = videoRef.current

    if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
      setErrorMessage("카메라 화면을 불러오는 중이에요. 잠시 후 다시 시도해주세요.")
      return
    }

    const canvas = document.createElement("canvas")
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const context = canvas.getContext("2d")

    if (!context) {
      setErrorMessage("사진을 저장하지 못했어요. 다시 시도해주세요.")
      return
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setErrorMessage("사진을 저장하지 못했어요. 다시 시도해주세요.")
          return
        }

        setCapturedPhoto(blob)
        stopCamera()
        setCameraStatus("captured")
      },
      "image/jpeg",
      0.9,
    )
  }

  const retakePhoto = () => {
    void startCamera()
  }

  return (
    <div className="flex w-full flex-col items-center gap-3">
      {/*촬영 대기 모드 */}
      {cameraStatus === "idle" || cameraStatus === "opening" ? (
        //카메라 활성화 버튼
        <button
          disabled={cameraStatus === "opening"}
          onClick={() => void startCamera()}
          className="flex h-[203px] w-[294px] flex-col items-center justify-center rounded-[10px] border border-dashed border-[#B9C0C9] bg-white disabled:cursor-wait"
        >
          <span className="flex h-10 w-[90px] items-center justify-center rounded-lg bg-[#F7F7FA]">
            <Camera aria-hidden="true" className="size-6 text-[#484C52]" strokeWidth={2} />
          </span>

          <span className="mt-7 font-['Pretendard'] text-[14px] text-[#484C52]">
            {cameraStatus === "opening" ? (
              "카메라를 여는 중이에요..."
            ) : (
              <>
                <span className="font-semibold text-[#397CB5]">클릭해서</span>{" "}
                사진을 찍으세요
              </>
            )}
          </span>
        </button>
      ) : null}

      {/*촬영 모드 */}
      {cameraStatus === "preview" ? (
        <div className="fixed inset-0 z-[100] mx-auto w-full max-w-[393px] bg-black">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/*카메라 닫기 */}
          <Button
            onClick={closeCamera}
            className="absolute right-3 top-3 size-8 rounded-full bg-black/50 p-0 text-white hover:bg-black/70"
          >
            <X aria-hidden="true" className="size-4" />
          </Button>

          {/*사진 촬영 */}
          <Button
            type="button"
            onClick={capturePhoto}
            className="absolute bottom-3 left-1/2 h-10 -translate-x-1/2 rounded-full bg-white px-5 text-[#484C52] hover:bg-white/90"
          >
            <Camera aria-hidden="true" className="size-4" />
            촬영
          </Button>
        </div>
      ) : null}

      {/*촬영 후 */}
      {cameraStatus === "captured" && previewUrl ? (
        <div className="relative h-[203px] w-[294px] overflow-hidden rounded-[10px] border border-[#E3E5E8] bg-[#F7F7FA]">
          {/*촬영한 사진*/}
          <img
            src={previewUrl}
            alt="촬영한 배 피부 사진"
            className="h-full w-full object-cover"
          />

          {/*재촬영 버튼*/}
          <Button
            type="button"
            onClick={retakePhoto}
            className="absolute bottom-3 left-1/2 h-9 -translate-x-1/2 rounded-full bg-black/60 px-4 text-white hover:bg-black/75"
          >
            <RotateCcw aria-hidden="true" className="size-4" />
            다시 찍기
          </Button>
        </div>
      ) : null}

      {/*오류 발생 시*/}
      {errorMessage ? (
        <p role="alert" className="w-[294px] text-center text-[12px] text-red-500">
          {errorMessage}
        </p>
      ) : null}
    </div>
  )
}
