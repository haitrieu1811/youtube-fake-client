import { PostAudience } from '@/constants/enum'
import { PaginationType, SuccessResponse } from './utils.types'

// Original post
export type OriginalPostType = {
  _id: string
  accountId: string
  content: string
  images: string[]
  audience: PostAudience
  createdAt: string
  updatedAt: string
}

// Post item
export type PostItemType = {
  _id: string
  author: {
    _id: string
    username: string
    channelName: string
    avatar: string
    tick: boolean
    createdAt: string
    updatedAt: string
  }
  images: string[]
  content: string
  audience: PostAudience
  likeCount: number
  dislikeCount: number
  isLiked: boolean
  isDisliked: boolean
  createdAt: string
  updatedAt: string
}

// Request: Create a new post
export type CreatePostReqBody = {
  content: string
  audience: PostAudience
  images?: string[]
}

// Response: Create a new post
export type CreatePostReponse = SuccessResponse<{
  post: OriginalPostType
}>

// Response: Get posts by account id
export type GetPostsResponse = SuccessResponse<{
  posts: PostItemType[]
  pagination: PaginationType
}>
