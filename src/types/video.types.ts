import { VideoAudience } from '@/constants/enum'
import { PaginationReqQuery, PaginationType, SuccessResponse } from './utils.types'

export type VideoCategoryType = {
  _id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
}

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
  category: VideoCategoryType | null
  audience: number
  isDraft: boolean
  viewCount: number
  commentCount: number
  likeCount: number
  dislikeCount: number
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

const a = {
  _id: '_id',
  idName: 'RvwnogKHWrs4IHiXcKMkJ',
  thumbnail: 'http://localhost:4000/static/images/8f150360e0fb01ee0533e9704.jpg',
  title: 'RvwnogKHWrs4IHiXcKMkJ',
  description: '',
  viewCount: 0,
  audience: 1,
  isDraft: true,
  createdAt: '2024-01-03T03:04:13.739Z',
  updatedAt: '2024-01-03T03:04:23.795Z'
}

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
