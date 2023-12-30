import http from '@/lib/http'
import { GetPublicVideosReqQuery, GetPublicVideosResponse } from '@/types/video.types'

const videoApis = {
  // Lấy danh sách video công khai
  getPublicVideos(params?: GetPublicVideosReqQuery) {
    return http.get<GetPublicVideosResponse>('/videos/public', { params })
  }
}

export default videoApis
