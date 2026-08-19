import { useEffect, useRef, useState } from "react"
import { Camera, CircleAlert, LoaderCircle, RotateCcw, X } from "lucide-react"

import { useCheckinFlowStore } from "@/features/checkin/model/use-checkin-flow-store"
import { Button } from "@/shared/components/ui/button"

import loadingSpinner from "./loading-spinner.svg"

//api연결시 밑에꺼 axios 활성화
import { validatePhoto } from "./api/validate-photo"

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

export function CameraCapture() {
  //해당 페이지에 카메라 사용 및 전송(api)
  const [capturedFile, setCapturedFile,] = useState<File | null>(null)

  const setImageId = useCheckinFlowStore((state) => state.setImageId,)

  const videoRef = useRef<HTMLVideoElement>(null)

  // ↓ videoRef 바로 아래에 추가
  // 실제 저장할 촬영 표시선 영역
  const guideRef = useRef<HTMLDivElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

 const [cameraStatus,setCameraStatus,] = useState<CameraStatus>("idle")
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)

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
    if (!capturedFile) {
      setPreviewUrl(null)
      return
    }

    {/*캡쳐된 사진을 img 태그에 넣을 url로 변환 */}
    const objectUrl = URL.createObjectURL(capturedFile)
    setPreviewUrl(objectUrl)

    return (() => URL.revokeObjectURL(objectUrl))
  }, [capturedFile])

  useEffect(() => {
    return ( 
      () => {streamRef.current?.getTracks().forEach((track) => track.stop())}
    )  
  }, [])

  // 분석 요청에는 진행률 이벤트가 없으므로, 완료 전까지 92%에서 멈추고
  // 응답을 받는 순간 100%로 마무리한다.
  useEffect(() => {
    if (cameraStatus !== "validating") {
      setUploadProgress(0)
      return
    }

    setUploadProgress(0)

    const intervalId = window.setInterval(() => {
      setUploadProgress((current) => {
        if (current >= 92) return current

        const increment = current < 60 ? 7 : current < 82 ? 3 : 1
        return Math.min(current + increment, 92)
      })
    }, 120)

    return () => window.clearInterval(intervalId)
  }, [cameraStatus])

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
      setCameraStatus(capturedFile ? "captured" : "idle")

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
    setCameraStatus( capturedFile ? "captured" : "idle")
  }

  {/*사진 저장 함수*/}
  const capturePhoto = () => {
    const video = videoRef.current

    // ↓ video를 가져오는 코드 바로 아래에 추가
    const guide = guideRef.current

    {/*비디오 생성이 안 되었다면 실행*/}
    if (!video || !guide || video.videoWidth === 0 || video.videoHeight === 0) {
      setErrorMessage("카메라 화면을 불러오는 중이에요. 잠시 후 다시 시도해주세요.")
      return
    }

        {/*촬영 화면과 표시선의 실제 위치 계산*/}
    const videoRect = video.getBoundingClientRect()
    const guideRect = guide.getBoundingClientRect()

    // ↓ object-cover로 영상이 확대된 비율
    const coverScale = Math.max(
      videoRect.width / video.videoWidth,
      videoRect.height / video.videoHeight,
    )

    // ↓ object-cover로 화면 바깥으로 잘린 크기
    const renderedVideoWidth = video.videoWidth * coverScale
    const renderedVideoHeight = video.videoHeight * coverScale

    const croppedOffsetX =
      (renderedVideoWidth - videoRect.width) / 2

    const croppedOffsetY =
      (renderedVideoHeight - videoRect.height) / 2

    // ↓ 화면에 보이는 표시선 위치를 원본 영상 좌표로 변환
    const sourceX =
      (guideRect.left - videoRect.left + croppedOffsetX) /
      coverScale

    const sourceY =
      (guideRect.top - videoRect.top + croppedOffsetY) /
      coverScale

    const sourceWidth =
      guideRect.width / coverScale

    const sourceHeight =
      guideRect.height / coverScale

    {/*표시선 크기의 canvas 생성*/}
    const canvas = document.createElement("canvas")
    canvas.width = Math.max(1, Math.round(sourceWidth))
    canvas.height = Math.max(1, Math.round(sourceHeight))

    const context = canvas.getContext("2d")

    {/*만약 저장이 안되면 다시 시도 */}
    if (!context) {
      setErrorMessage("사진을 저장하지 못했어요. 다시 시도해주세요.")
      return
    }

    {/*찍힌 canvas를 이미지로 생성 */}
    context.drawImage(
      video, 
      // 원본 영상에서 자를 위치와 크기
      sourceX,sourceY,sourceWidth,sourceHeight,
       // canvas에 출력할 위치와 크기
      0, 0, canvas.width, canvas.height
    )

    {/*사진 처리 과정 */}
    canvas.toBlob(
      async (blob) => {
        if (!blob) {
          setErrorMessage("사진을 저장하지 못했어요. \n다시 시도해주세요.")
          return
        }

        stopCamera()
        // ↓ 미리보기 테스트 중에는 로딩 화면으로 전환하지 않음
         setCameraStatus("validating")

        const imageFile =
          new File(
            [blob],
            "checkin.jpg",
            {
              type:
                blob.type ||
                "image/jpeg",
            },
          )

          // 미리보기와 API 전송에
          // 동일한 File 사용
          setCapturedFile(imageFile)

          // 이전 이미지 ID 제거
          setImageId(null)

          // ↓ 임시 추가: API 검증 없이 촬영 결과 미리보기로 전환
          //setCameraStatus("captured")


        
// ↓ 바로 아래의 API 검증 코드는 삭제하지 않고 블록 주석 처리
 
        //일단 boolean으로 판단 데이터 받기로 함(이건 바뀔수도 )
        try{
          const result = await validatePhoto(imageFile)

          if(result.detected && Number.isInteger(result.imageId) && result.imageId > 0){
            setImageId(result.imageId,)
            setUploadProgress(100)
            await new Promise((resolve) => window.setTimeout(resolve, 220))
            setCameraStatus("captured")
            return
          }
          
          setCapturedFile(null)
          setImageId(null)
          setErrorMessage("사진에서 배 부위를 확인하지 못했어요. \n 다시 촬영해 주세요.")
          setUploadProgress(100)
          await new Promise((resolve) => window.setTimeout(resolve, 220))
          setCameraStatus("rejected")
        } catch (error){
          console.error(
            "이미지 분석 실패:",
            error,
          )
          setCapturedFile(null)
          setImageId(null)
          setErrorMessage("사진 전송에 실패하였습니다. \n 잠시 후 다시 시도해 주세요.",)
          setUploadProgress(100)
          await new Promise((resolve) => window.setTimeout(resolve, 220))
          setCameraStatus("error")
        }
        

      },
      "image/jpeg",
      0.9,
    )
  }


  {/*재촬영*/}
  const retakePhoto = () => {
    setCapturedFile(null)
    setImageId(null)
    
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
          className="flex h-[248px] w-full flex-col items-center justify-center gap-4 rounded-[20px] border border-dashed border-[#eea5d1] bg-[#fdeef7] disabled:cursor-wait"
        >
          <span className="flex size-16 items-center justify-center rounded-[18px] bg-white shadow-[0_6px_8px_rgba(238,165,209,0.35)]">
            <Camera aria-hidden="true" className="size-[26px] text-[#7a3f63]" strokeWidth={1.8} />
          </span>

          <span className="text-[16px] font-semibold leading-6">
            {cameraStatus === "opening" ? (
              "카메라를 여는 중이에요..."
            ) : (
              <>
                <span className="text-[#7a3f63]">클릭해서 </span>
                <span className="text-[#484c52]">사진을 찍으세요</span>
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
          
         
          {/*검은색 화면, 촬영가이드 */}
          <div // ↓ 이 표시선의 실제 화면 위치를 촬영 함수에서 사용
            ref={guideRef}
            className="pointer-events-none absolute left-1/2 top-[46%] z-10 h-[360px] w-[280px]
              -translate-x-1/2 -translate-y-1/2 rounded-[16px] border-2 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.58)]"
          >
             {/*안내 문구*/}
            <p className="absolute bottom-[calc(100%+16px)] left-1/2 w-[calc(100vw-32px)] max-w-[345px] -translate-x-1/2 text-center text-[19px] text-white">
              표시선에 배꼽 위치를 맞춰 촬영해주세요.
            </p>
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
        <div className="relative mx-auto aspect-[7/9] w-[min(70vw,280px)] overflow-hidden rounded-[20px] border border-[#eea5d1] bg-[#fdeef7]">
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
        <div className="fixed inset-0 z-[100] mx-auto flex w-full max-w-[393px] flex-col items-center bg-white pt-[300px]">
          <div
            aria-live="polite"
            className="flex flex-col items-center"
          >
            <div className="flex size-[108px] items-center justify-center rounded-[24px] bg-[#fdeef7]">
              <img
                src={loadingSpinner}
                alt=""
                aria-hidden="true"
                className="size-[52px] animate-[spin_0.8s_steps(8)_infinite] [filter:invert(76%)_sepia(24%)_saturate(1001%)_hue-rotate(280deg)_brightness(99%)_contrast(88%)]"
              />
            </div>

            <p className="mt-7 text-[18px] font-semibold leading-[27px] tracking-[-0.2px] text-[#2b2b2b]">
              이미지를 업로드하고 있어요
            </p>

            <div className="mt-[26px] w-[240px]">
              <div className="h-1.5 overflow-hidden rounded-full bg-[#f0e6ec]">
                <div
                  className="h-full rounded-full bg-[#eea5d1] transition-[width] duration-150 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="mt-2.5 text-center text-[12px] font-medium leading-[18px] text-[#7a3f63]">{uploadProgress}%</p>
            </div>
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
        <p role="alert" className="w-full text-center text-[12px] text-red-500">
          {errorMessage}
        </p>
      ) : null}
    </div>
  )
}
