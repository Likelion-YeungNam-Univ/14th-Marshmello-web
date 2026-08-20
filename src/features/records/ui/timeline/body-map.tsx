import bodyMapBaseSvg from "@/features/checkin/bodymap/body-map-base.svg"
import chestSvg from "@/features/checkin/bodymap/chest.svg?no-inline"
import abdomenSvg from "@/features/checkin/bodymap/abdomen.svg?no-inline"
import pelvisSvg from "@/features/checkin/bodymap/pelvis.svg?no-inline"
import leftArmSvg from "@/features/checkin/bodymap/left-arm.svg?no-inline"
import rightArmSvg from "@/features/checkin/bodymap/right-arm.svg?no-inline"
import leftLegSvg from "@/features/checkin/bodymap/left-leg.svg?no-inline"
import rightLegSvg from "@/features/checkin/bodymap/right-leg.svg?no-inline"

type BodyDiary = {
  bodyRegion?: number
  stretchMark?: boolean
  comment?: string
}

type TimelineBodyMapProps = {
  bodyDiaries: BodyDiary[]
  compact?: boolean
}

const BODY_MAP_WIDTH = 262
const BODY_MAP_HEIGHT = 411

const bodyParts = [
  {
    id: 1,
    part: "가슴",
    image: chestSvg,
    x: 98,
    y: 86,
    width: 62,
    height: 52,
    hitPath:
      "M5 0C4 14 1 30 0 52H62C61 33 58 15 57 0C48 2 42 4 34 5C25 5 17 2 10 1Z",
    zIndex: 30,
  },
  {
    id: 2,
    part: "복부",
    image: abdomenSvg,
    x: 99,
    y: 136,
    width: 61,
    height: 39,
    hitPath:
      "M2 0C3 10 4 20 2 30L0 35C12 39 21 39 30.5 39C41 39 51 38 61 35L59 30C56 20 57 10 58 0C45 2 39 2 30.5 2C21 2 14 2 2 0Z",
    zIndex: 30,
  },
  {
    id: 3,
    part: "골반",
    image: pelvisSvg,
    x: 96,
    y: 170,
    width: 67,
    height: 48,
    hitPath:
      "M2 2C13 6 23 9 33 9C44 9 55 6 65 2L64 11C54 18 47 26 42 35C39 42 37 47 33 47C29 47 27 44 23 38C18 29 11 20 3 12Z",
    zIndex: 40,
  },
  {
    id: 4,
    part: "왼쪽 팔",
    image: leftArmSvg,
    x: 34.5,
    y: 78.2,
    width: 57,
    height: 161,
    hitPath:
      "M57 13C51 20 50 31 48 42C46 53 42 64 37 72C32 81 29 92 25 106C22 116 20 120 14 124C9 128 5 133 5 135C7 137 10 136 13 133C16 131 18 131 21 130C20 137 14 147 11 151C13 154 17 154 20 151C24 146 27 137 29 128C31 121 38 110 44 100C50 90 55 77 57 68Z",
    zIndex: 20,
  },
  {
    id: 5,
    part: "오른쪽 팔",
    image: rightArmSvg,
    x: 168,
    y: 85,
    width: 59,
    height: 170,
    hitPath:
      "M1 8C4 16 5 29 8 41C11 54 16 65 21 76C27 89 34 103 38 112C41 118 42 120 47 123C52 126 56 132 57 136C55 138 52 137 48 134C46 132 44 132 42 132C44 140 49 151 50 157C48 161 44 161 41 157C37 151 34 142 32 134C30 126 24 117 18 108C12 98 7 87 4 77C1 67 1 55 1 44Z",
    zIndex: 20,
  },
  {
    id: 6,
    part: "왼쪽 다리",
    image: leftLegSvg,
    x: 88,
    y: 179,
    width: 42,
    height: 215,
    hitPath:
      "M9 1C20 5 31 24 40 36C40 52 38 68 37 82C37 96 34 105 34 116C35 132 34 143 32 155C30 166 31 174 33 184C35 193 34 201 31 204C27 207 21 204 17 202C14 199 15 195 18 189C21 183 21 177 20 169C19 159 15 150 14 139C12 129 13 117 14 108C15 98 14 91 12 83C9 70 6 57 5 45C3 29 5 12 9 1Z",
    zIndex: 10,
  },
  {
    id: 7,
    part: "오른쪽 다리",
    image: rightLegSvg,
    x: 131,
    y: 179,
    width: 41,
    height: 208,
    hitPath:
      "M30 1C20 5 11 15 5 28C1 36 0 43 1 53C2 65 4 76 3 86C2 98 5 108 6 119C6 132 5 140 7 151C9 163 8 171 7 178C5 187 6 198 9 201C13 204 20 202 24 199C26 196 24 191 21 186C18 181 18 176 19 169C20 159 24 149 25 139C27 128 27 117 26 108C25 99 26 90 28 80C30 70 34 57 35 47C37 31 34 13 30 1Z",
    zIndex: 10,
  },
]

export function TimelineBodyMap({
  bodyDiaries,
  compact = false,
}: TimelineBodyMapProps) {
  const selectedRegions =
    new Set(
      bodyDiaries
        .map(
          (item) =>
            item.bodyRegion,
        )
        .filter(
          (
            region,
          ): region is number =>
            typeof region ===
            "number",
        ),
    )

  return (
    <div className="flex w-full flex-col items-center">
      <div
        className={
          compact
            ? "relative aspect-[262/411] w-[172px]"
            : "relative aspect-[262/411] w-[250px]"
        }
      >
        <img
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full select-none"
          src={bodyMapBaseSvg}
        />

        {bodyParts.map(
          (part) => {
            const isSelected =
              selectedRegions.has(
                part.id,
              )

            return (
              <svg
                key={part.id}
                viewBox={`0 0 ${part.width} ${part.height}`}
                className="pointer-events-none absolute h-auto overflow-visible"
                style={{
                  left: `${(part.x / BODY_MAP_WIDTH) * 100}%`,
                  top: `${(part.y / BODY_MAP_HEIGHT) * 100}%`,
                  width: `${(part.width / BODY_MAP_WIDTH) * 100}%`,
                  zIndex:
                    part.zIndex,
                }}
              >
                <use
                  href={`${part.image}#body-part-path`}
                  aria-hidden="true"
                  className={
                    isSelected
                      ? "pointer-events-none opacity-100 [filter:drop-shadow(0_0_1px_#F19ED2)_drop-shadow(0_0_6px_#F19ED2CC)]"
                      : "pointer-events-none opacity-0"
                  }
                />
              </svg>
            )
          },
        )}
      </div>

      {!compact && bodyDiaries.length > 0 && (
        <div className="mt-[18px] w-full space-y-[10px]">
          {bodyDiaries.map(
            (diary, index) => (
              <div
                key={`${diary.bodyRegion}-${index}`}
                className="rounded-[10px] bg-[#faf8f9] px-[12px] py-[10px]"
              >
                <p className="text-[13px] font-medium text-[#3d3d3d]">
                  {bodyParts.find(
                    (part) =>
                      part.id ===
                      diary.bodyRegion,
                  )?.part ??
                    "기록 부위"}
                </p>

                {diary.comment && (
                  <p className="mt-[4px] text-[12px] leading-[1.5] text-[#777]">
                    {diary.comment}
                  </p>
                )}

                {diary.stretchMark !==
                  undefined && (
                  <p className="mt-[4px] text-[11px] text-[#999]">
                    튼살:{" "}
                    {diary.stretchMark
                      ? "있음"
                      : "없음"}
                  </p>
                )}
              </div>
            ),
          )}
        </div>
      )}
    </div>
  )
}
