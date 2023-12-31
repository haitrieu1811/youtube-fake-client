import { VideoAudience } from '@/constants/enum'
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

export type VideoCreatedType = {
  _id: string
  idName: string
  accountId: string
  thumbnail: string
  title: string
  category: string
  description: string
  views: number
  audience: number
  createdAt: string
  updatedAt: string
}

export type VideoCategoryItemType = {
  _id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
}

// Resquest: Tạo video
export type CreateVideoReqBody = {
  idName: string
  thumbnail: string
  title: string
  category: string
  description?: string
  audience?: VideoAudience
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

// Response: Tạo video
export type CreateVideoResponse = SuccessResponse<{
  newVideo: VideoCreatedType
}>

// Response: Lấy danh sách danh mục video
export type GetVideoCategoriesResponse = SuccessResponse<{
  categories: VideoCategoryItemType[]
  pagination: PaginationType
}>
