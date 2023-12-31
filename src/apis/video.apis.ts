import http from '@/lib/http'
import { PaginationReqQuery } from '@/types/utils.types'
import {
  CreateVideoReqBody,
  CreateVideoResponse,
  GetPublicVideosReqQuery,
  GetPublicVideosResponse,
  GetVideoCategoriesResponse
} from '@/types/video.types'

const videoApis = {
  // Lấy danh sách danh mục video
  getVideoCategories(params?: PaginationReqQuery) {
    return http.get<GetVideoCategoriesResponse>('/videos/categories', { params })
  },

  // Lấy danh sách video công khai
  getPublicVideos(params?: GetPublicVideosReqQuery) {
    return http.get<GetPublicVideosResponse>('/videos/public', { params })
  },

  // Tạo video mới
  createVideo(body: CreateVideoReqBody) {
    return http.post<CreateVideoResponse>('/videos', body)
  }
}

export default videoApis
