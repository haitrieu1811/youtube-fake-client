import { CommentType } from '@/constants/enum'
import { PaginationReqQuery, PaginationType, SuccessResponse } from './utils.types'

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

export type CommentDetailType = {
  _id: string
  accountId: string
  contentId: string
  parentId: string | null
  content: string
  type: number
  replyAccountId: string | null
  createdAt: string
  updatedAt: string
}

// Request: Lấy danh sách bình luận
export type GetCommentsReqQuery = PaginationReqQuery & {
  sortBy?: 'createdAt' | 'likeCount'
  orderBy?: 'asc' | 'desc'
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

// Request: Cập nhật comment
export type UpdateCommentReqBody = {
  content: string
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

// Response: Lấy chi tiết bình luận
export type GetCommentDetailResponse = SuccessResponse<{
  comment: CommentDetailType
}>

// Response: Cập nhật bình luận
export type UpdateCommentResponse = SuccessResponse<{
  comment: CommentDetailType
}>
