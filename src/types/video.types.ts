import { PaginationReqQuery, PaginationType, SuccessResponse } from './utils.types'

export type VideoItemType = {
  _id: string
  idName: string
  thumbnail: string
  title: string
  author: {
    _id: string
    email: string
    username: string
    channelName: string
    avatar: string
    tick: boolean
    createdAt: string
    updatedAt: string
  }
  viewCount: number
  createdAt: string
  updatedAt: string
}

// Requests: Lấy danh sách video công khai
export type GetPublicVideosReqQuery = PaginationReqQuery & {
  category?: string
}

// Response: Lấy danh sách video công khai
export type GetPublicVideosResponse = SuccessResponse<{
  videos: VideoItemType[]
  pagination: PaginationType
}>
