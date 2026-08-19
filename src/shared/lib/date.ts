/**
 * 오늘을 기준으로 offsetDays만큼 이동한 날짜를
 * YYYY-MM-DD 형식으로 반환합니다.
 */
export function getDateByOffset(offsetDays = 0) {
  const date = new Date()

  date.setDate(date.getDate() + offsetDays)

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-")
}