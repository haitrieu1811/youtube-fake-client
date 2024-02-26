import { useMutation } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'

import reactionApis from '@/apis/reaction.apis'
import { ReactionContentType, ReactionType } from '@/constants/enum'
import { CreateReactionResponse, DeleteReactionResponse, UpdateReactionResponse } from '@/types/reaction.types'

type UseReactionProps = {
  onCreateSuccess?: (data: AxiosResponse<CreateReactionResponse, any>) => void
  onUpdateSuccess?: (data: AxiosResponse<UpdateReactionResponse, any>) => void
  onDeleteSuccess?: (data: AxiosResponse<DeleteReactionResponse, any>) => void
}

const useReaction = ({ onCreateSuccess, onUpdateSuccess, onDeleteSuccess }: UseReactionProps) => {
  // Mutation: Create reaction
  const createReactionMutation = useMutation({
    mutationKey: ['createReaction'],
    mutationFn: reactionApis.createReaction,
    onSuccess: (data) => {
      onCreateSuccess && onCreateSuccess(data)
    }
  })

  // Mutation: Update reaction
  const updateReactionMutation = useMutation({
    mutationKey: ['updateReaction'],
    mutationFn: reactionApis.updateReaction,
    onSuccess: (data) => {
      onUpdateSuccess && onUpdateSuccess(data)
    }
  })

  // Mutation: Delete reaction
  const deleteReactionMutation = useMutation({
    mutationKey: ['deleteReaction'],
    mutationFn: reactionApis.deleteReaction,
    onSuccess: (data) => {
      onDeleteSuccess && onDeleteSuccess(data)
    }
  })

  // Xử lý reaction
  const handleReaction = ({
    type,
    contentId,
    contentType,
    isLiked,
    isDisliked
  }: {
    type: ReactionType
    contentId: string
    contentType: ReactionContentType
    isLiked: boolean
    isDisliked: boolean
  }) => {
    if (!isLiked && !isDisliked) {
      createReactionMutation.mutate({
        contentType,
        contentId,
        type
      })
    }
    if (isLiked || isDisliked) {
      if ((isLiked && type === ReactionType.Like) || (isDisliked && type === ReactionType.Dislike)) {
        deleteReactionMutation.mutate(contentId)
      } else {
        updateReactionMutation.mutate({
          contentId,
          body: { type }
        })
      }
    }
  }

  return {
    handleReaction
  }
}

export default useReaction
