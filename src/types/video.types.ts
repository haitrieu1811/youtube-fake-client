import { VideoAudience } from '@/constants/enum'
import { PaginationReqQuery, PaginationType, SuccessResponse } from './utils.types'

export type VideoCategoryType = {
  _id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
}

export type AuthorVideoItemType = {
  _id: string
  email: string
  username: string
  channelName: string
  avatar: string
  tick: boolean
  createdAt: string
  updatedAt: string
}

export type VideoItemType = {
  _id: string
  idName: string
  thumbnail: string
  title: string
  description: string
  author: AuthorVideoItemType
  category: VideoCategoryType | null
  audience: VideoAudience
  isDraft?: boolean
  viewCount: number
  commentCount?: number
  likeCount?: number
  dislikeCount?: number
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

export type WatchedVideoType = {
  _id: string
  idName: string
  title: string
  thumbnail: string
  description: string
  viewCount: number
  isLiked: boolean
  likeCount: number
  dislikeCount: number
  isDisliked: boolean
  channel: {
    _id: string
    username: string
    channelName: string
    avatar: string
    tick: boolean
    isSubscribed: boolean
    subscribeCount: number
  }
  category: VideoCategoryType | null
  createdAt: string
  updatedAt: string
}

// Resquest: Tạo video
export type CreateVideoReqBody = {
  idName: string
  thumbnail?: string
  title: string
  category?: string
  description?: string
  audience?: VideoAudience
  isDraft: boolean
}

// Requests: Lấy danh sách video công khai
export type GetPublicVideosReqQuery = PaginationReqQuery & {
  category?: string
}

// Request: Cập nhật video
export type UpdateVideoReqBody = {
  thumbnail?: string | null
  title?: string
  category?: string
  description?: string
  audience?: VideoAudience
  isDraft?: boolean
}

// Request: Lấy danh sách video của tôi
export type GetVideosOfMeReqQuery = PaginationReqQuery & {
  sortBy?: string
  orderBy?: 'asc' | 'desc'
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

// Response: Lấy danh sách video của tôi
export type GetVideosOfMeResponse = SuccessResponse<{
  videos: VideoItemType[]
  pagination: PaginationType
}>

// Response: Lấy danh sách video theo username
export type GetVideosByUsernameResponse = SuccessResponse<{
  videos: VideoItemType[]
  pagination: PaginationType
}>

// Response: Cập nhật video
export type UpdateVideoResponse = SuccessResponse<{
  video: {
    _id: string
    idName: string
    accountId: string
    thumbnail: null
    title: string
    category: null
    description: string
    views: number
    audience: number
    isDraft: boolean
    createdAt: string
    updatedAt: string
  }
}>

// Response: Lấy thông tin video để cập nhật
export type GetVideoDetailToUpdateResponse = SuccessResponse<{
  video: {
    _id: string
    idName: string
    thumbnail: string
    title: string
    description: string
    viewCount: number
    audience: number
    isDraft: boolean
    category: VideoCategoryType | null
    createdAt: string
    updatedAt: string
  }
}>

// Response: Xem video
export type WatchVideoResponse = SuccessResponse<{
  video: WatchedVideoType
}>

// Response: Lấy danh sách video đã thích
export type GetLikedVideosResponse = SuccessResponse<{
  videos: VideoItemType[]
  pagination: PaginationType
}>

// Response: Lấy danh sách video cùng danh mục
export type GetVideosSameCategoryResponse = SuccessResponse<{
  videos: VideoItemType[]
  pagination: PaginationType
}>
