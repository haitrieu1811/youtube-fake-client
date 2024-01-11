import http from '@/lib/http'
import { OnlyMessageResponse, PaginationReqQuery } from '@/types/utils.types'
import {
  CreateVideoReqBody,
  CreateVideoResponse,
  GetPublicVideosReqQuery,
  GetPublicVideosResponse,
  GetVideoCategoriesResponse,
  GetVideoDetailToUpdateResponse,
  GetVideosOfMeResponse,
  UpdateVideoReqBody,
  UpdateVideoResponse,
  WatchVideoResponse,
  GetVideosOfMeReqQuery,
  GetVideosByUsernameResponse
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
  getVideosOfMe(params?: GetVideosOfMeReqQuery) {
    return http.get<GetVideosOfMeResponse>('/videos/me', { params })
  },

  // Lấy danh sách video theo username
  getVideosByUsername({ params, username }: { params?: GetVideosOfMeReqQuery; username: string }) {
    return http.get<GetVideosByUsernameResponse>(`/videos/username/${username}`, { params })
  },

  // Cập nhật video
  updateVideo({ body, videoId }: { body: UpdateVideoReqBody; videoId: string }) {
    return http.patch<UpdateVideoResponse>(`/videos/${videoId}`, body)
  },

  // Lấy thông tin video để cập nhật
  getVideoDetailToUpdate(videoId: string) {
    return http.get<GetVideoDetailToUpdateResponse>(`/videos/${videoId}/to-update`)
  },

  // Xóa hình thu nhỏ video
  deleteThumbnailImage(videoId: string) {
    return http.delete<OnlyMessageResponse>(`/videos/${videoId}/thumbnail`)
  },

  // Xóa video (một hoặc nhiều)
  deleteVideos(videoIds: string[]) {
    return http.delete<OnlyMessageResponse>('/videos', { data: { videoIds } })
  },

  // Xem video
  watchVideo(idName: string) {
    return http.get<WatchVideoResponse>(`/videos/watch/idName/${idName}`)
  },

  // Đăng ký kênh
  subscribe(accountId: string) {
    return http.post<OnlyMessageResponse>(`/subscriptions/subscribe/account/${accountId}`)
  },

  // Hủy đăng ký kênh
  unsubscribe(accountId: string) {
    return http.delete<OnlyMessageResponse>(`/subscriptions/unsubscribe/account/${accountId}`)
  },

  // Like video
  likeVideo() {
    return http.post<OnlyMessageResponse>('/reactions')
  }
}

export default videoApis
