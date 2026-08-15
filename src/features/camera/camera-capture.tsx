import { useEffect, useRef, useState } from "react"
import { Camera, CircleAlert, LoaderCircle, RotateCcw, X } from "lucide-react"

import { useCheckinFlowStore } from "@/features/checkin/model/use-checkin-flow-store"
import { Button } from "@/shared/components/ui/button"

import loadingSpinner from "./loading-spinner.svg"

//api연결시 밑에꺼 axios 활성화
//import { validatePhoto } from "./api/validate-photo"

/* 
카메라 상태 
  idle : 카메라 작동 전
  opening : 카메라 작동 시작
  preview : 카메라 작동 중
  captured : 사진 찍힘
  validating : 잘 찍혔는지 확인 중 
  rejected : 거절됨 (잘 안찍힘) 
*/
type CameraStatus = "idle" | "opening" | "preview" | "captured" | "validating" | "rejected" | "error"

//api 연결 전 로딩 화면 테스트 데이터 값
const MOCK_PHOTO_IS_VALID = true

//
function mockValidatePhoto(_blob: Blob): Promise<boolean> {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      resolve(MOCK_PHOTO_IS_VALID)
    }, 2000)
  })
}

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

  {/*카메라 멈추기 */}
  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    setCameraStream(null)
  }

  {/*카메라 스트림이 된다면  */}
  useEffect(() => {
    if (!cameraStream || !videoRef.current) {
      return
    }  
    videoRef.current.srcObject = cameraStream
    void videoRef.current.play()
  }, [cameraStream])

  {/*저장된 사진 useEffect 처리과정 */}
  useEffect(() => {
    {/*만약 사진이 안찍혔으면*/}
    if (!capturedPhoto) {
      setPreviewUrl(null)
      return
    }

    {/*캡쳐된 사진을 img 태그에 넣을 url로 변환 */}
    const objectUrl = URL.createObjectURL(capturedPhoto)
    setPreviewUrl(objectUrl)

    return (() => URL.revokeObjectURL(objectUrl))
  }, [capturedPhoto])

  useEffect(() => {
    return ( 
      () => {streamRef.current?.getTracks().forEach((track) => track.stop())}
    )  
  }, [])

  {/*카메라 연결 함수*/}
  const startCamera = async () => {
    setErrorMessage(null)
    {/*카메라 승인 실패 */}
    if (!navigator.mediaDevices?.getUserMedia) {
      setErrorMessage("이 브라우저에서는 카메라를 사용할 수 없어요.")
      return
    }

    {/*카메라 상태를 opening으로 바꾸고 */}
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

  {/*카메라 닫기 함수*/}
  const closeCamera = () => {
    stopCamera()
    setCameraStatus(capturedPhoto ? "captured" : "idle")
  }

  {/*사진 저장 함수*/}
  const capturePhoto = () => {
    const video = videoRef.current

    {/*비디오 생성이 안 되었다면 실행*/}
    if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
      setErrorMessage("카메라 화면을 불러오는 중이에요. 잠시 후 다시 시도해주세요.")
      return
    }

    {/*찍은 사진 canvas에 저장, canvas 너비와 높이*/}
    const canvas = document.createElement("canvas")
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const context = canvas.getContext("2d")

    {/*만약 저장이 안되면 다시 시도 */}
    if (!context) {
      setErrorMessage("사진을 저장하지 못했어요. 다시 시도해주세요.")
      return
    }

    {/*찍힌 canvas를 이미지로 생성 */}
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    {/*사진 처리 과정 */}
    canvas.toBlob(
      async (blob) => {
        if (!blob) {
          setErrorMessage("사진을 저장하지 못했어요. \n다시 시도해주세요.")
          return
        }

        stopCamera()
        setCameraStatus("validating")

        //일단 boolean으로 판단 데이터 받기로 함(이건 바뀔수도 )
        try{
          //const isValid = await validatePhoto(blob)

          //api 연결 전 임시 테스트(api연결 떈 이거 주석처리하셔야 합니다)
          const isValid = await mockValidatePhoto(blob)

          if(isValid){
            setCapturedPhoto(blob)
            setCameraStatus("captured")
          }
          else {
            setCapturedPhoto(null)
            setErrorMessage("사진에서 배 부위를 확인하지 못했어요. \n 다시 촬영해 주세요.")
            setCameraStatus("rejected")
          }
        } catch{
          setCapturedPhoto(null)
          setErrorMessage("사진 전송에 실패하였습니다. 잠시 후 다시 시도해 주세요.",)
          setCameraStatus("error")
        }
        

      },
      "image/jpeg",
      0.9,
    )
  }

  {/*재촬영*/}
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
          className="flex aspect-[294/203] w-full max-w-[294px] flex-col items-center justify-center rounded-[10px] border border-dashed border-[#B9C0C9] bg-white disabled:cursor-wait"
        >
          <span className="flex h-10 w-[90px] items-center justify-center rounded-lg ">
            <Camera aria-hidden="true" className="size-6 text-[#484C52]" strokeWidth={2} />
          </span>

          <span className="mt-7 font-['Pretendard'] text-[14px] text-[#484C52]">
            {cameraStatus === "opening" ? (
              "카메라를 여는 중이에요..."
            ) : (
              <>
                <p className="font-semibold text-[#397CB5]">클릭해서</p>{" "}
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
          
          {/*안내 문구*/}
          <p className="absolute inset-x-0 top-[calc(env(safe-area-inset-top)+150px)] z-20 text-center text-[19px] text-white">
            표시선에 배꼽 위치를 맞춰 촬영해주세요.
          </p>
          {/*검은색 화면, 촬영가이드 */}
          <div className="pointer-events-none absolute left-1/2 top-[46%] z-10 h-[360px] w-[280px]
        -translate-x-1/2 -translate-y-1/2 rounded-[16px] border-2 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.58)]">

          {/*촬영 가이드 라인*/}
              {/* 세로 보조선 */}
            <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/40" />

              {/* 가로 보조선 */}
            <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white/40" />

              {/* 배꼽 중앙점 */}
            <div className="absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F19ED2]" />
          </div>
          {/* */}

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
            className=" absolute bottom-[calc(env(safe-area-inset-bottom)+70px)] left-1/2
                z-30 flex size-[90px] -translate-x-1/2 items-center justify-center rounded-full border-[3px]
                border-white bg-transparent p-[6px] transition-transform active:scale-95"
          >
            <div className="block size-full rounded-full bg-white">

            </div>
          </Button>
        </div>
      ) : null}

      {/*촬영 후 */}
      {cameraStatus === "captured" && previewUrl ? (
        <div className="relative aspect-[294/203] w-full max-w-[294px] overflow-hidden rounded-[10px] border border-[#E3E5E8] bg-[#F7F7FA]">
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

      {cameraStatus === "validating" ? (
        <div className="fixed inset-0 z-[100] mx-auto flex w-full max-w-[393px] items-center justify-center bg-white">
          {/*상태창 */}
          <div
            aria-live="polite"
            className="flex -translate-y-8 flex-col items-center"
          >
            <div className="flex size-[60px] items-center justify-center bg-white">
              <img
                src={loadingSpinner}
                alt=""
                aria-hidden="true"
                className="size-8 animate-[spin_0.8s_steps(8)_infinite]"
              />
            </div>

            <p className="mt-4 font-['Pretendard'] text-[16px] font-normal text-black">
              이미지를 업로드하고 있어요
            </p>
          </div>
        </div>
      ) : null}

      {cameraStatus === "rejected" || cameraStatus === "error" ? (
        <div className="fixed inset-0 z-[100] mx-auto flex w-full max-w-[393px] items-center justify-center bg-white px-[14px]">
          {/*사진 다시 촬영하기*/}
          <button
            onClick={retakePhoto}
            className="flex aspect-[365/352] w-full w-full flex-col items-center justify-center rounded-[15px] border border-[#F04438] bg-white"
          >
            <span className="flex size-[84px] items-center justify-center rounded-full bg-[#FBE3E3]">
              <CircleAlert
                aria-hidden="true"
                className="size-10 text-[#C9362C]"
                strokeWidth={2.2}
              />
            </span>

            <span className="mt-7 whitespace-pre-line text-center font-['Pretendard'] text-[18px] font-normal leading-[1.45] text-black">
              {errorMessage}
            </span>
          </button>
        </div>
      ) : null}

      {/*오류 발생 시*/}
      {errorMessage ? (
        <p role="alert" className="w-full max-w-[294px] text-center text-[12px] text-red-500">
          {errorMessage}
        </p>
      ) : null}
    </div>
  )
}
