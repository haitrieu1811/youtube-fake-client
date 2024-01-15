import http from '@/lib/http'
import { OnlyMessageResponse } from '@/types/utils.types'
import { GetWatchHistoriesReqQuery, GetWatchHistoriesResponse } from '@/types/watchHistory.types'

const watchHistoryApis = {
  // Lưu video đã xem
  createWatchHistory(videoId: string) {
    return http.post<OnlyMessageResponse>(`/watch-histories/video/${videoId}`)
  },

  // Lưu video đã xem
  getWatchHistories(params?: GetWatchHistoriesReqQuery) {
    return http.get<GetWatchHistoriesResponse>('/watch-histories', { params })
  },

  // Xóa một lịch sử xem
  deleteWatchHistory(watchHistoryId: string) {
    return http.delete<OnlyMessageResponse>(`/watch-histories/${watchHistoryId}`)
  },

  // Xóa toàn bộ lịch sử xem
  deleteAllWatchHistories() {
    return http.delete<OnlyMessageResponse>('/watch-histories/all')
  }
} as const

export default watchHistoryApis
