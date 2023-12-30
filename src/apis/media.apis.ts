import http from '@/lib/http'
import { UploadImagesResponse } from '@/types/media.types'

const mediaApis = {
  // Upload hình ảnh
  uploadImage(body: FormData) {
    return http.post<UploadImagesResponse>('/medias/upload-images', body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

export default mediaApis
