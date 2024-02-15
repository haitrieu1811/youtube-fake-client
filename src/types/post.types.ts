import { PostAudience } from '@/constants/enum'
import { SuccessResponse } from './utils.types'

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
