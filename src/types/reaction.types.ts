import { ReactionContentType, ReactionType } from '@/constants/enum'
import { SuccessResponse } from './utils.types'

export type ReactionItemType = {
  _id: string
  accountId: string
  contentId: string
  contentType: ReactionContentType
  type: ReactionType
  createdAt: string
  updatedAt: string
}

// Request: Reaction video, bài viết, bình luận
export type CreateReactionReqBody = {
  type: ReactionType
  contentId: string
  contentType: ReactionContentType
}

// Request: Cập nhật reaction
export type UpdateReactionReqBody = {
  type: ReactionType
}

// Response: Tạo reaction
export type CreateReactionResponse = SuccessResponse<{
  reaction: ReactionItemType
}>

// Response: Cập nhật reaction
export type UpdateReactionResponse = SuccessResponse<{
  reaction: ReactionItemType
}>

// Response: Xóa reaction
export type DeleteReactionResponse = SuccessResponse<{
  reaction: ReactionItemType
}>
