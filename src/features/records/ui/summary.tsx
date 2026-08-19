type RecordsSummaryProps = {
  monthText: string
  count: number
  topBodyRegionLabel: string
}

export function RecordsSummary({
  monthText,
  count,
  topBodyRegionLabel,
}: RecordsSummaryProps) {
  return (
    <div className="ml-[5px]">
      <p className="text-[10px] font-bold tracking-[-0.1px] text-[#7a4e88]">
        이번 달 이야기
      </p>

      <h1 className="max-w-[355px] text-[20px] font-medium leading-[1.4] tracking-[-0.2px]">
        {monthText}엔 총{" "}
        {count}일 기록을 남겼고,
        <br />
        그 중{" "}
        <span className="text-[#885d94]">
          {topBodyRegionLabel}
        </span>{" "}
        쪽이 가장 자주 신경 쓰였어요.
      </h1>

      <p className="mt-[5px] text-[8px] leading-[1.4] text-black/45">
        *이 리포트는 자가 진단을 바탕으로 한 참고 정보이며,
        의학적 진단이 아닙니다.
      </p>
    </div>
  )
}