import http from '@/lib/http'
import { GetVideoStatusResponse, UploadImagesResponse, UploadVideoHLSResponse } from '@/types/media.types'

const mediaApis = {
  // Upload hình ảnh
  uploadImage(body: FormData) {
    return http.post<UploadImagesResponse>('/medias/upload-images', body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // Upload video HLS
  uploadVideoHLS(body: FormData) {
    return http.post<UploadVideoHLSResponse>('/medias/upload-video-hls', body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // Lấy trạng thái vieo
  getVideoStatus(uuid: string) {
    return http.get<GetVideoStatusResponse>(`/medias/video-status/${uuid}`)
  }
}

export default mediaApis
