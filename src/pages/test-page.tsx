// Axios 요청에서 발생한 오류인지 확인하기 위해 사용
import axios from "axios"

// 입력값, 요청 결과 등을 화면에 저장하기 위해 사용
import {
  useState,
  type ReactNode,
} from "react"

// report-controller 실제 API 요청 함수
import {
  createReport,
  getReport,
} from "@/features/test/report-Controller"

// check-in-controller 테스트 함수
import {
  getcheckInCount,
  getcheckInRegion,
  handleCreateCheckIn,
  handleGetCheckInEmotions,
  handleGetCheckInsByDate,
} from "@/features/test/checkin_Controller"

// check-in-image-controller 테스트 함수
import {
  handleAnalyzeCheckInImage,
  handleGetCheckInImageUrl,
} from "@/features/test/checkin-Image-Controller"

// care-card-controller 테스트 함수
import {
  handleCreateCareCard,
  handleGetCareCard,
  handleUpdateCareCardFeedback,
} from "@/features/test/carecard-Controller"

// user-controller 테스트 함수
import {
  handleGetUserProfile,
  handleUpdateUserProfile,
} from "@/features/test/user-Controller"

// token-status-controller 테스트 함수
import {
  handleGetTokenStatus,
} from "@/features/test/token-Status-Controller"

// csrf-controller 테스트 함수
import {
  handleGetCsrfToken,
} from "@/features/test/csrf-Controller"

// auth-controller 테스트 함수
import {
  handleGetAuthMe,
  handleGetModelGate,
} from "@/features/test/auth-Controller"

// 테스트 결과를 화면에 표시하기 위한 양식
type TestResult = {
  // 실행한 API 이름
  apiName: string

  // 요청 성공 여부
  isSuccess: boolean

  // 실패했을 때 받은 HTTP 상태 코드
  status?: number

  // 백엔드가 보내준 실제 응답
  data: unknown
}

// 컨트롤러별 영역에서 사용할 속성
type ApiSectionProps = {
  title: string
  children: ReactNode
}

// API 실행 버튼에서 사용할 속성
type ApiButtonProps = {
  label: string
  currentApi: string | null
  disabled?: boolean
  danger?: boolean
  onClick: () => void
}

// 모든 input에서 공통으로 사용할 디자인
const inputClassName =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2"

// 컨트롤러별 API 버튼을 감싸는 공통 영역
function ApiSection({
  title,
  children,
}: ApiSectionProps) {
  return (
    <section className="mb-10 rounded-xl border border-gray-200 p-5">
      <h2 className="mb-5 text-lg font-semibold">
        {title}
      </h2>

      <div className="flex flex-col gap-4">
        {children}
      </div>
    </section>
  )
}

// GET, POST, PATCH 버튼에서 공통으로 사용하는 컴포넌트
function ApiButton({
  label,
  currentApi,
  disabled = false,
  danger = false,
  onClick,
}: ApiButtonProps) {
  // 현재 이 버튼의 API가 실행 중인지 확인
  const isCurrentLoading =
    currentApi === label

  // 다른 API를 포함해 무언가 실행 중인지 확인
  const isAnyLoading =
    currentApi !== null

  return (
    <button
      // POST와 PATCH는 실제 데이터를 바꾸므로 빨간색으로 표시
      className={
        danger
          ? "w-full rounded-lg bg-red-100 px-4 py-3 text-left text-red-700 hover:bg-red-200 disabled:opacity-50"
          : "w-full rounded-lg bg-gray-100 px-4 py-3 text-left hover:bg-gray-200 disabled:opacity-50"
      }
      // 다른 요청이 실행 중이면 중복 실행 방지
      disabled={disabled || isAnyLoading}
      onClick={onClick}
      type="button"
    >
      {isCurrentLoading
        ? "요청 중..."
        : label}
    </button>
  )
}

// ID 입력값이 1 이상의 정수인지 확인하는 함수
function isPositiveInteger(value: string) {
  const numberValue = Number(value)

  return (
    Number.isInteger(numberValue) &&
    numberValue > 0
  )
}

export function TestPage() {
  // report-controller에서 사용할 YYYY-MM 값
  const [reportMonth, setReportMonth] =
    useState("2026-08")

  // check-in-controller의 날짜 조회에 사용할 값
  const [checkInDate, setCheckInDate] =
    useState("2026-08-18")

  // 감정 기록 조회에 사용할 YYYY-MM 값
  const [emotionMonth, setEmotionMonth] =
    useState("2026-08")

  // 체크인 생성에 사용할 이미지 ID
  const [
    checkInImageId,
    setCheckInImageId,
  ] = useState("")

  // 이미지 input에서 선택한 실제 이미지 파일
  const [imageFile, setImageFile] =
    useState<File | null>(null)

  // 이미지 URL을 조회할 때 사용할 이미지 ID
  const [imageUrlId, setImageUrlId] =
    useState("")

  // 케어카드 조회 및 생성에 사용할 체크인 ID
  const [
    careCheckInId,
    setCareCheckInId,
  ] = useState("")

  // 케어카드 피드백 수정에 사용할 케어카드 ID
  const [careCardId, setCareCardId] =
    useState("")

  // 현재 실행 중인 API 이름
  // null이면 현재 실행 중인 요청이 없다는 뜻
  const [loadingApi, setLoadingApi] =
    useState<string | null>(null)

  // 마지막으로 실행한 API 결과
  const [result, setResult] =
    useState<TestResult | null>(null)

  // 모든 API 버튼에서 공통으로 사용할 실행 함수
  const runRequest = async (
    apiName: string,
    request: () => Promise<unknown>,
  ) => {
    // 현재 어떤 API가 실행 중인지 저장
    setLoadingApi(apiName)

    // 이전 요청 결과 제거
    setResult(null)

    try {
      // 전달받은 API 테스트 함수를 실행하고 응답을 기다림
      const data = await request()

      // 요청이 성공하면 성공 결과 저장
      setResult({
        apiName,
        isSuccess: true,
        data,
      })
    } catch (error) {
      // Axios 요청 과정에서 발생한 오류인지 확인
      if (axios.isAxiosError(error)) {
        setResult({
          apiName,
          isSuccess: false,

          // 백엔드 응답이 있으면 상태 코드 저장
          status: error.response?.status,

          // 백엔드 오류 응답 또는 Axios 오류 메시지 저장
          data:
            error.response?.data ??
            error.message,
        })
      } else {
        // Axios 이외의 알 수 없는 오류
        setResult({
          apiName,
          isSuccess: false,
          data:
            "알 수 없는 오류가 발생했습니다.",
        })
      }
    } finally {
      // 성공과 실패 여부에 상관없이 로딩 종료
      setLoadingApi(null)
    }
  }

  return (
    <main className="min-h-screen bg-white px-6 py-10 text-black">
      <div className="mx-auto max-w-2xl">
        {/* 테스트 페이지 제목 */}
        <h1 className="mb-3 text-2xl font-bold">
          Swagger API 테스트
        </h1>

        {/* POST와 PATCH 버튼에 대한 안내 */}
        <p className="mb-8 text-sm text-gray-500">
          빨간 버튼은 실제 데이터를 생성하거나
          수정합니다.
        </p>

        {/* CSRF 토큰 조회 */}
        <ApiSection title="csrf-controller">
          <ApiButton
            currentApi={loadingApi}
            label="GET /api/csrf"
            onClick={() => {
              void runRequest(
                "GET /api/csrf",
                handleGetCsrfToken,
              )
            }}
          />
        </ApiSection>

        {/* 현재 로그인 사용자 인증 정보 확인 */}
        <ApiSection title="auth-controller">
          {/* 현재 로그인한 사용자의 OIDC 정보 조회 */}
          <ApiButton
            currentApi={loadingApi}
            label="GET /api/me"
            onClick={() => {
              void runRequest(
                "GET /api/me",
                handleGetAuthMe,
              )
            }}
          />

          {/* 모델 API 접근 권한 확인 */}
          <ApiButton
            currentApi={loadingApi}
            label="GET /api/model-gate"
            onClick={() => {
              void runRequest(
                "GET /api/model-gate",
                handleGetModelGate,
              )
            }}
          />
        </ApiSection>

        {/* 현재 로그인 토큰 상태 조회 */}
        <ApiSection title="token-status-controller">
          <ApiButton
            currentApi={loadingApi}
            label="GET /api/token-status"
            onClick={() => {
              void runRequest(
                "GET /api/token-status",
                handleGetTokenStatus,
              )
            }}
          />
        </ApiSection>

        {/* 월간 리포트 조회 및 생성 */}
        <ApiSection title="report-controller">
          <label>
            <span className="mb-2 block text-sm font-medium">
              리포트 월
            </span>

            {/* type="month"이므로 YYYY-MM 형태로 저장됨 */}
            <input
              className={inputClassName}
              onChange={(event) =>
                setReportMonth(
                  event.target.value,
                )
              }
              type="month"
              value={reportMonth}
            />
          </label>

          {/* 리포트 조회 */}
          <ApiButton
            currentApi={loadingApi}
            disabled={reportMonth === ""}
            label="GET /api/reports"
            onClick={() => {
              void runRequest(
                "GET /api/reports",
                () =>
                 getReport(reportMonth),
              )
            }}
          />

          {/* 리포트 생성: 실제 데이터가 생성될 수 있음 */}
          <ApiButton
            currentApi={loadingApi}
            danger
            disabled={reportMonth === ""}
            label="POST /api/reports"
            onClick={() => {
              void runRequest(
                "POST /api/reports",
                () => createReport(reportMonth),
              )
            }}
          />
        </ApiSection>

        {/* 이미지 분석 및 이미지 URL 조회 */}
        <ApiSection title="check-in-image-controller">
          <label>
            <span className="mb-2 block text-sm font-medium">
              분석할 이미지
            </span>

            {/* 사용자가 선택한 첫 번째 이미지 파일 저장 */}
            <input
              accept="image/*"
              className={inputClassName}
              onChange={(event) => {
                setImageFile(
                  event.target.files?.[0] ??
                    null,
                )
              }}
              type="file"
            />
          </label>

          {/* 이미지 파일을 multipart/form-data로 전송 */}
          <ApiButton
            currentApi={loadingApi}
            danger
            disabled={!imageFile}
            label="POST /api/check-ins/images/analyze"
            onClick={() => {
              // 이미지가 선택되지 않았다면 실행하지 않음
              if (!imageFile) return

              void runRequest(
                "POST /api/check-ins/images/analyze",
                async () => {
                  const response =
                    await handleAnalyzeCheckInImage(
                      imageFile,
                    )

                  // 이미지 분석 성공 후 받은 imageId를
                  // 체크인 생성 입력칸에 자동으로 넣음
                  setCheckInImageId(
                    String(response.imageId),
                  )

                  // 이미지 URL 조회 입력칸에도 자동으로 넣음
                  setImageUrlId(
                    String(response.imageId),
                  )

                  return response
                },
              )
            }}
          />

          <label>
            <span className="mb-2 block text-sm font-medium">
              이미지 ID
            </span>

            <input
              className={inputClassName}
              min="1"
              onChange={(event) =>
                setImageUrlId(
                  event.target.value,
                )
              }
              placeholder="이미지 분석 후 자동 입력"
              type="number"
              value={imageUrlId}
            />
          </label>

          {/* imageId를 path에 넣어 이미지 주소 조회 */}
          <ApiButton
            currentApi={loadingApi}
            disabled={
              !isPositiveInteger(imageUrlId)
            }
            label="GET /api/check-ins/images/{imageId}/url"
            onClick={() => {
              void runRequest(
                "GET /api/check-ins/images/{imageId}/url",
                () =>
                  handleGetCheckInImageUrl(
                    Number(imageUrlId),
                  ),
              )
            }}
          />
        </ApiSection>

        {/* 체크인 목록, 감정 기록 조회 및 체크인 생성 */}
        <ApiSection title="check-in-controller">
          <label>
            <span className="mb-2 block text-sm font-medium">
              체크인 조회 날짜
            </span>

            {/* type="date"이므로 YYYY-MM-DD 형태로 저장됨 */}
            <input
              className={inputClassName}
              onChange={(event) =>
                setCheckInDate(
                  event.target.value,
                )
              }
              type="date"
              value={checkInDate}
            />
          </label>

          {/* 선택한 날짜의 체크인 목록 조회 */}
          <ApiButton
            currentApi={loadingApi}
            disabled={checkInDate === ""}
            label="GET /api/check-ins"
            onClick={() => {
              void runRequest(
                "GET /api/check-ins",
                () =>
                  handleGetCheckInsByDate(
                    checkInDate,
                  ),
              )
            }}
          />

          <label>
            <span className="mb-2 block text-sm font-medium">
              감정 기록 조회 월
            </span>

            <input
              className={inputClassName}
              onChange={(event) =>
                setEmotionMonth(
                  event.target.value,
                )
              }
              type="month"
              value={emotionMonth}
            />
          </label>

          {/* 선택한 월의 감정 기록 조회 */}
          <ApiButton
            currentApi={loadingApi}
            disabled={emotionMonth === ""}
            label="GET /api/check-ins/emotions"
            onClick={() => {
              void runRequest(
                "GET /api/check-ins/emotions",
                () =>
                  handleGetCheckInEmotions(
                    emotionMonth,
                  ),
              )
            }}
          />
                    {/* 선택한 월의 체크인 횟수 조회 */}
          <ApiButton
            currentApi={loadingApi}
            disabled={emotionMonth === ""}
            label="GET /api/check-ins/count"
            onClick={() => {
              void runRequest(
                "GET /api/check-ins/count",
                () =>
                  getcheckInCount(
                    emotionMonth,
                  ),
              )
            }}
          />

          {/* 선택한 월에 가장 많이 불편함을 호소한 부위 조회 */}
          <ApiButton
            currentApi={loadingApi}
            disabled={emotionMonth === ""}
            label="GET /api/check-ins/body-diaries/top-region"
            onClick={() => {
              void runRequest(
                "GET /api/check-ins/body-diaries/top-region",
                () =>
                  getcheckInRegion(
                    emotionMonth,
                  ),
              )
            }}
          />

          <label>
            <span className="mb-2 block text-sm font-medium">
              체크인 생성용 이미지 ID
            </span>

            <input
              className={inputClassName}
              min="1"
              onChange={(event) =>
                setCheckInImageId(
                  event.target.value,
                )
              }
              placeholder="이미지 분석 후 자동 입력"
              type="number"
              value={checkInImageId}
            />
          </label>

          {/* 샘플 JSON을 사용해 실제 체크인 생성 */}
          <ApiButton
            currentApi={loadingApi}
            danger
            disabled={
              !isPositiveInteger(
                checkInImageId,
              )
            }
            label="POST /api/check-ins"
            onClick={() => {
              void runRequest(
                "POST /api/check-ins",
                async () => {
                  const response =
                    await handleCreateCheckIn({
                      imageId:
                        Number(
                          checkInImageId,
                        ),

                      // 케어카드 실천 여부
                      achieved: true,

                      // 오늘의 한 줄 일기
                      diary:
                        "API 연결 테스트입니다.",

                      // 감정 범위 1~4
                      emotion: 3,

                      // 신체 부위별 정보
                      bodyDiaries: [
                        {
                          // 신체 부위 번호 1~8
                          bodyRegion: 2,

                          // 튼살 여부
                          stretchMark: false,

                          // 부위별 메모, 최대 50자
                          comment:
                            "API 연결 테스트",
                        },
                      ],
                    })

                  // 체크인 생성 성공 후 받은 checkInId를
                  // 케어카드 입력칸에 자동으로 넣음
                  setCareCheckInId(
                    String(
                      response.checkInId,
                    ),
                  )

                  return response
                },
              )
            }}
          />
        </ApiSection>

        {/* 케어카드 조회, 생성 및 피드백 전송 */}
        <ApiSection title="care-card-controller">
          <label>
            <span className="mb-2 block text-sm font-medium">
              체크인 ID
            </span>

            <input
              className={inputClassName}
              min="1"
              onChange={(event) =>
                setCareCheckInId(
                  event.target.value,
                )
              }
              placeholder="체크인 생성 후 자동 입력"
              type="number"
              value={careCheckInId}
            />
          </label>

          {/* checkInId로 기존 케어카드 조회 */}
          <ApiButton
            currentApi={loadingApi}
            disabled={
              !isPositiveInteger(
                careCheckInId,
              )
            }
            label="GET /api/check-ins/{checkInId}/care-card"
            onClick={() => {
              void runRequest(
                "GET /api/check-ins/{checkInId}/care-card",
                () =>
                  handleGetCareCard(
                    Number(careCheckInId),
                  ),
              )
            }}
          />

          {/* checkInId를 이용해 새로운 케어카드 생성 */}
          <ApiButton
            currentApi={loadingApi}
            danger
            disabled={
              !isPositiveInteger(
                careCheckInId,
              )
            }
            label="POST /api/check-ins/{checkInId}/care-card"
            onClick={() => {
              void runRequest(
                "POST /api/check-ins/{checkInId}/care-card",
                async () => {
                  const response =
                    await handleCreateCareCard(
                      Number(
                        careCheckInId,
                      ),
                    )

                  // 케어카드 생성 후 받은 careCardId를
                  // 피드백 입력칸에 자동으로 넣음
                  setCareCardId(
                    String(
                      response.careCardId,
                    ),
                  )

                  return response
                },
              )
            }}
          />

          <label>
            <span className="mb-2 block text-sm font-medium">
              케어카드 ID
            </span>

            <input
              className={inputClassName}
              min="1"
              onChange={(event) =>
                setCareCardId(
                  event.target.value,
                )
              }
              placeholder="케어카드 생성 후 자동 입력"
              type="number"
              value={careCardId}
            />
          </label>

          {/* careCardId에 해당하는 피드백 수정 */}
          <ApiButton
            currentApi={loadingApi}
            danger
            disabled={
              !isPositiveInteger(careCardId)
            }
            label="PATCH /api/care-cards/{careCardId}/feedback"
            onClick={() => {
              void runRequest(
                "PATCH /api/care-cards/{careCardId}/feedback",
                () =>
                  handleUpdateCareCardFeedback(
                    Number(careCardId),
                  ),
              )
            }}
          />
        </ApiSection>

        {/* 사용자 정보 조회 및 수정 */}
        <ApiSection title="user-controller">
          {/* 현재 로그인한 사용자 정보 조회 */}
          <ApiButton
            currentApi={loadingApi}
            label="GET /api/user"
            onClick={() => {
              void runRequest(
                "GET /api/user",
                handleGetUserProfile,
              )
            }}
          />

          {/* 테스트 함수에 작성된 값으로 사용자 정보 수정 */}
          <ApiButton
            currentApi={loadingApi}
            danger
            label="PATCH /api/user"
            onClick={() => {
              void runRequest(
                "PATCH /api/user",
                handleUpdateUserProfile,
              )
            }}
          />

          <p className="text-sm text-red-600">
            PATCH 버튼은 테스트 함수에 작성된
            닉네임과 출산 예정일로 실제 사용자
            정보를 수정합니다.
          </p>
        </ApiSection>

        {/* 마지막으로 실행한 API 결과 표시 */}
        <section className="sticky bottom-4 rounded-xl border border-gray-200 bg-white p-5 shadow-lg">
          <h2 className="mb-4 text-lg font-semibold">
            요청 결과
          </h2>

          {/* API 요청 진행 중 */}
          {loadingApi ? (
            <p className="rounded-lg bg-gray-50 p-4">
              {loadingApi} 요청 중...
            </p>
          ) : null}

          {/* API 요청 완료 */}
          {!loadingApi && result ? (
            <div
              className={
                result.isSuccess
                  ? "rounded-lg bg-green-50 p-4"
                  : "rounded-lg bg-red-50 p-4"
              }
            >
              <p>API: {result.apiName}</p>

              <p>
                결과:{" "}
                {result.isSuccess
                  ? "성공"
                  : "실패"}
              </p>

              <p>
                상태 코드:{" "}
                {result.status ??
                  (result.isSuccess
                    ? "성공 응답"
                    : "응답 없음")}
              </p>

              {/* 백엔드 응답 JSON을 보기 좋게 출력 */}
              <pre className="mt-4 max-h-80 overflow-auto whitespace-pre-wrap text-sm">
                {JSON.stringify(
                  result.data,
                  null,
                  2,
                )}
              </pre>
            </div>
          ) : null}

          {/* 아직 버튼을 누르지 않은 상태 */}
          {!loadingApi && !result ? (
            <p className="rounded-lg bg-gray-50 p-4 text-gray-500">
              아직 실행한 API가 없습니다.
            </p>
          ) : null}
        </section>
      </div>
    </main>
  )
}