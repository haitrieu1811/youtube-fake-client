import { PaginationReqQuery, PaginationType, SuccessResponse } from './utils.types'

export type WatchHistoryItemType = {
  _id: string
  historyId: string
  idName: string
  thumbnail: string
  title: string
  description: string
  viewCount: number
  author: {
    _id: string
    username: string
    channelName: string
    avatar: string
    tick: boolean
    createdAt: string
    updatedAt: string
  }
  createdAt: string
  updatedAt: string
}

// Request: Lấy lịch sử xem
export type GetWatchHistoriesReqQuery = PaginationReqQuery & {
  searchQuery?: string
}

// Response: Lấy lịch sử xem
export type GetWatchHistoriesResponse = SuccessResponse<{
  videos: WatchHistoryItemType[]
  pagination: PaginationType
}>
