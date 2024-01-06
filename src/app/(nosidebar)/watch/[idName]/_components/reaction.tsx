'use client'

import { useMutation } from '@tanstack/react-query'
import '@vidstack/react/player/styles/default/layouts/video.css'
import '@vidstack/react/player/styles/default/theme.css'
import classNames from 'classnames'
import { ThumbsDown, ThumbsUp } from 'lucide-react'
import { useEffect, useState } from 'react'

import reactionApis from '@/apis/reaction.apis'
import { Button } from '@/components/ui/button'
import { ReactionContentType, ReactionType } from '@/constants/enum'
import { WatchedVideoType } from '@/types/video.types'

type ReactionProps = {
  videoInfo: WatchedVideoType
}

const Reaction = ({ videoInfo }: ReactionProps) => {
  const [isLiked, setIsLiked] = useState<boolean>(false)
  const [isDisliked, setIsDisiked] = useState<boolean>(false)
  const [likeCount, setLikeCount] = useState<number>(0)
  const [dislikeCount, setDislikeCount] = useState<number>(0)

  // Cập nhật thông tin video
  useEffect(() => {
    if (!videoInfo) return
    setIsLiked(videoInfo.isLiked)
    setIsDisiked(videoInfo.isDisliked)
    setLikeCount(videoInfo.likeCount)
    setDislikeCount(videoInfo.dislikeCount)
  }, [videoInfo])

  // Mutation: Thêm reaction
  const createReactionMutation = useMutation({
    mutationKey: ['createReaction'],
    mutationFn: reactionApis.createReaction,
    onSuccess: (data) => {
      const { type } = data.data.data.reaction
      if (type === ReactionType.Like) {
        setLikeCount((prev) => prev + 1)
        setIsLiked(true)
      }
      if (type === ReactionType.Dislike) {
        setDislikeCount((prev) => prev + 1)
        setIsDisiked(true)
      }
    }
  })

  // Mutation: Cập nhật reaction
  const updateReactionMutation = useMutation({
    mutationKey: ['updateReaction'],
    mutationFn: reactionApis.updateReaction,
    onSuccess: (data) => {
      const { type } = data.data.data.reaction
      if (type === ReactionType.Like) {
        setLikeCount((prev) => prev + 1)
        setDislikeCount((prev) => prev - 1)
        setIsLiked(true)
        setIsDisiked(false)
      }
      if (type === ReactionType.Dislike) {
        setDislikeCount((prev) => prev + 1)
        setLikeCount((prev) => prev - 1)
        setIsDisiked(true)
        setIsLiked(false)
      }
    }
  })

  // Mutation: Xóa reaction
  const deleteReactionMutation = useMutation({
    mutationKey: ['deleteReaction'],
    mutationFn: reactionApis.deleteReaction,
    onSuccess: (data) => {
      const { type } = data.data.data.reaction
      if (type === ReactionType.Like) {
        setLikeCount((prev) => prev - 1)
        setIsLiked(false)
      }
      if (type === ReactionType.Dislike) {
        setDislikeCount((prev) => prev - 1)
        setIsDisiked(false)
      }
    }
  })

  // Xử lý reaction
  const handleReaction = (type: ReactionType) => {
    if (!videoInfo) return
    if (!isLiked && !isDisliked) {
      createReactionMutation.mutate({
        contentType: ReactionContentType.Video,
        contentId: videoInfo._id,
        type
      })
    }
    if (isLiked || isDisliked) {
      if ((isLiked && type === ReactionType.Like) || (isDisliked && type === ReactionType.Dislike)) {
        deleteReactionMutation.mutate(videoInfo._id)
      } else {
        updateReactionMutation.mutate({
          contentId: videoInfo._id,
          body: {
            type
          }
        })
      }
    }
  }

  return (
    <div className='flex'>
      <Button
        variant='secondary'
        className='rounded-l-full space-x-3 hover:bg-zinc-200 dark:hover:bg-zinc-700'
        onClick={() => handleReaction(ReactionType.Like)}
      >
        <ThumbsUp
          size={20}
          strokeWidth={1.5}
          className={classNames({
            'fill-black dark:fill-white': isLiked
          })}
        />
        <span>{likeCount}</span>
      </Button>
      <div className='w-[1px] bg-zinc-300 dark:bg-zinc-700' />
      <Button
        variant='secondary'
        className='rounded-r-full space-x-3 hover:bg-zinc-200 dark:hover:bg-zinc-700'
        onClick={() => handleReaction(ReactionType.Dislike)}
      >
        <ThumbsDown
          size={20}
          strokeWidth={1.5}
          className={classNames({
            'fill-black dark:fill-white': isDisliked
          })}
        />
        <span>{dislikeCount}</span>
      </Button>
    </div>
  )
}

export default Reaction
