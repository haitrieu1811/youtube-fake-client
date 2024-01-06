import http from '@/lib/http'
import {
  CreateReactionReqBody,
  CreateReactionResponse,
  DeleteReactionResponse,
  UpdateReactionReqBody,
  UpdateReactionResponse
} from '@/types/reaction.types'

const reactionApis = {
  // Thêm một reaction
  createReaction(body: CreateReactionReqBody) {
    return http.post<CreateReactionResponse>('/reactions', body)
  },

  // Xóa một reaction
  deleteReaction(contentId: string) {
    return http.delete<DeleteReactionResponse>(`/reactions/content/${contentId}`)
  },

  // Cập nhật reaction
  updateReaction({ contentId, body }: { contentId: string; body: UpdateReactionReqBody }) {
    return http.patch<UpdateReactionResponse>(`/reactions/content/${contentId}`, body)
  }
} as const

export default reactionApis
