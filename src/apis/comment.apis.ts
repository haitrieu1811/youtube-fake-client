import http from '@/lib/http'
import {
  GetCommentsResponse,
  CreateCommentReqBody,
  CreateCommentResponse,
  ReplyCommentReqBody,
  ReplyCommentResponse,
  GetRepliesCommentResponse,
  GetCommentDetailResponse,
  UpdateCommentResponse,
  UpdateCommentReqBody,
  GetCommentsReqQuery
} from '@/types/comment.types'
import { OnlyMessageResponse, PaginationReqQuery } from '@/types/utils.types'

const commentApis = {
  // Lấy danh sách bình luận
  getComments({ contentId, params }: { contentId: string; params?: GetCommentsReqQuery }) {
    return http.get<GetCommentsResponse>(`/comments/content/${contentId}`, { params })
  },

  // Thêm bình luận
  createComment(body: CreateCommentReqBody) {
    return http.post<CreateCommentResponse>('/comments', body)
  },

  // Trả lời bình luận
  replyComment({ body, commentId }: { body: ReplyCommentReqBody; commentId: string }) {
    return http.post<ReplyCommentResponse>(`/comments/${commentId}/reply`, body)
  },

  // Lấy danh sách trả lời bình luận
  getRepliesComment({ commentId, params }: { commentId: string; params?: PaginationReqQuery }) {
    return http.get<GetRepliesCommentResponse>(`/comments/${commentId}/replies`, { params })
  },

  // Lấy chi tiết bình luận
  getCommentDetail(commentId: string) {
    return http.get<GetCommentDetailResponse>(`/comments/${commentId}`)
  },

  // Cập nhật bình luận
  updateComment({ commentId, body }: { commentId: string; body: UpdateCommentReqBody }) {
    return http.patch<UpdateCommentResponse>(`/comments/${commentId}`, body)
  },

  // Xóa bình luận
  deleteComment(commentId: string) {
    return http.delete<OnlyMessageResponse>(`/comments/${commentId}`)
  }
} as const

export default commentApis
