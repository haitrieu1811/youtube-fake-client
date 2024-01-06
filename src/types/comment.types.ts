import { CommentType } from '@/constants/enum'
import { PaginationType, SuccessResponse } from './utils.types'

export type CommentItemType = {
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
  content: string
  replyCount: number
  likeCount: number
  dislikeCount: number
  isLiked: boolean
  isDisliked: boolean
  createdAt: string
  updatedAt: string
}

// Request: Thêm comment
export type CreateCommentReqBody = {
  contentId: string
  content: string
  type: CommentType
}

// Request: Trả lời comment
export type ReplyCommentReqBody = {
  content: string
  replyAccountId?: string
}

// Response: Lấy danh sách comment
export type GetCommentsResponse = SuccessResponse<{
  comments: CommentItemType[]
  pagination: PaginationType
}>

// Response: Thêm comment
export type CreateCommentResponse = SuccessResponse<{
  comment: CommentItemType
}>

// Response: Trả lời comment
export type ReplyCommentResponse = SuccessResponse<{
  comment: CommentItemType
}>

// Response: Danh sách trả lời comment
export type GetRepliesCommentResponse = SuccessResponse<{
  comments: CommentItemType[]
  pagination: PaginationType
}>
