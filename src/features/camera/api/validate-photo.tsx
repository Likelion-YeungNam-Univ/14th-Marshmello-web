import { apiClient } from "@/shared/api/axios"; 
//back이랑 연결한 api와 axios를 통해서 주고받음

export async function validatePhoto(blob : Blob) : Promise<boolean> {
  const formData = new FormData()

  //image : 백엔드가 받을 필드 이름
  // 실제 jpeg 이미지 데이터
  // 서버에 전달할 파일 이름
  formData.append("image_id", blob, "checkin.jpg")

  //post 요청보내기
  const response = await apiClient.post<boolean>(
    //백엔드 api 경로
    "/api/photos/validate",
    
    formData,
  )
  
  return response.data

}