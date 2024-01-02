import http from '@/lib/http'
import { PaginationReqQuery } from '@/types/utils.types'
import {
  CreateVideoReqBody,
  CreateVideoResponse,
  GetPublicVideosReqQuery,
  GetPublicVideosResponse,
  GetVideoCategoriesResponse,
  GetVideoDetailToUpdateResponse,
  GetVideosOfMeResponse,
  UpdateVideoReqBody,
  UpdateVideoResponse
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
  },

  // Lấy danh sách video của tôi
  getVideosOfMe(params?: PaginationReqQuery) {
    return http.get<GetVideosOfMeResponse>('/videos/me', { params })
  },

  // Cập nhật video
  updateVideo({ body, videoId }: { body: UpdateVideoReqBody; videoId: string }) {
    return http.patch<UpdateVideoResponse>(`/videos/${videoId}`, body)
  },

  // Lấy thông tin video để cập nhật
  getVideoDetailToUpdate(videoId: string) {
    return http.get<GetVideoDetailToUpdateResponse>(`/videos/${videoId}/to-update`)
  }
}

export default videoApis
