'use client'

import '@vidstack/react/player/styles/default/layouts/video.css'
import '@vidstack/react/player/styles/default/theme.css'
import classNames from 'classnames'
import { ThumbsDown, ThumbsUp } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { ReactionContentType, ReactionType } from '@/constants/enum'
import useReaction from '@/hooks/useReaction'
import { WatchedVideoType } from '@/types/video.types'

type ReactionProps = {
  videoInfo: WatchedVideoType
}

const Reaction = ({ videoInfo }: ReactionProps) => {
  const [isLiked, setIsLiked] = useState<boolean>(false)
  const [isDisliked, setIsDisiked] = useState<boolean>(false)
  const [likeCount, setLikeCount] = useState<number>(0)
  const [dislikeCount, setDislikeCount] = useState<number>(0)

  const { handleReaction } = useReaction({
    onCreateSuccess(data) {
      const { type } = data.data.data.reaction
      if (type === ReactionType.Like) {
        setLikeCount((prev) => prev + 1)
        setIsLiked(true)
      }
      if (type === ReactionType.Dislike) {
        setDislikeCount((prev) => prev + 1)
        setIsDisiked(true)
      }
    },
    onUpdateSuccess(data) {
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
    },
    onDeleteSuccess(data) {
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

  // Cập nhật thông tin video
  useEffect(() => {
    if (!videoInfo) return
    setIsLiked(videoInfo.isLiked)
    setIsDisiked(videoInfo.isDisliked)
    setLikeCount(videoInfo.likeCount)
    setDislikeCount(videoInfo.dislikeCount)
  }, [videoInfo])

  return (
    <div className='flex'>
      <Button
        variant='secondary'
        className='rounded-l-full space-x-3 hover:bg-zinc-200 dark:hover:bg-zinc-700'
        onClick={() =>
          handleReaction({
            contentId: videoInfo._id,
            contentType: ReactionContentType.Video,
            type: ReactionType.Like,
            isLiked,
            isDisliked
          })
        }
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
        onClick={() =>
          handleReaction({
            contentId: videoInfo._id,
            contentType: ReactionContentType.Video,
            type: ReactionType.Dislike,
            isLiked,
            isDisliked
          })
        }
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
