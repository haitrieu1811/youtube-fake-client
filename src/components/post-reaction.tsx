import { useQueryClient } from '@tanstack/react-query'
import classNames from 'classnames'
import { ThumbsDown, ThumbsUp } from 'lucide-react'
import type { Dispatch, SetStateAction } from 'react'

import { ReactionContentType, ReactionType } from '@/constants/enum'
import useReaction from '@/hooks/useReaction'
import { PostItemType } from '@/types/post.types'
import { Button } from './ui/button'

type PostReactionProps = {
  postData: PostItemType
  setPosts?: Dispatch<SetStateAction<PostItemType[]>>
  isDetailMode?: boolean
}

const PostReaction = ({ postData, setPosts, isDetailMode = false }: PostReactionProps) => {
  const queryClient = useQueryClient()

  // Handle reaction
  const { handleReaction } = useReaction({
    onCreateSuccess(data) {
      const { reaction } = data.data.data
      setPosts &&
        setPosts((prevState) =>
          prevState.map((post) => {
            if (post._id === reaction.contentId) {
              if (reaction.type === ReactionType.Like) {
                return {
                  ...post,
                  likeCount: post.likeCount + 1,
                  isLiked: true
                }
              } else {
                return {
                  ...post,
                  dislikeCount: post.dislikeCount + 1,
                  isDisliked: true
                }
              }
            }
            return post
          })
        )
      isDetailMode && queryClient.invalidateQueries({ queryKey: ['getPostDetail', postData._id] })
    },
    onUpdateSuccess(data) {
      const { reaction } = data.data.data
      setPosts &&
        setPosts((prevState) =>
          prevState.map((post) => {
            if (post._id === reaction.contentId) {
              if (reaction.type === ReactionType.Like) {
                return {
                  ...post,
                  likeCount: post.likeCount + 1,
                  dislikeCount: post.dislikeCount - 1,
                  isLiked: true,
                  isDisliked: false
                }
              } else {
                return {
                  ...post,
                  likeCount: post.likeCount - 1,
                  dislikeCount: post.dislikeCount + 1,
                  isLiked: false,
                  isDisliked: true
                }
              }
            }
            return post
          })
        )
      isDetailMode && queryClient.invalidateQueries({ queryKey: ['getPostDetail', postData._id] })
    },
    onDeleteSuccess(data) {
      const { reaction } = data.data.data
      setPosts &&
        setPosts((prevState) =>
          prevState.map((post) => {
            if (post._id === reaction.contentId) {
              if (reaction.type === ReactionType.Like) {
                return {
                  ...post,
                  likeCount: post.likeCount - 1,
                  isLiked: false
                }
              } else {
                return {
                  ...post,
                  dislikeCount: post.dislikeCount - 1,
                  isDisliked: false
                }
              }
            }
            return post
          })
        )
      isDetailMode && queryClient.invalidateQueries({ queryKey: ['getPostDetail', postData._id] })
    }
  })

  return (
    <div className='flex items-center space-x-3'>
      {/* Like */}
      <div className='flex items-center space-x-0.5'>
        <Button
          size='icon'
          variant='ghost'
          className='rounded-full'
          onClick={() =>
            handleReaction({
              contentId: postData._id,
              contentType: ReactionContentType.Post,
              type: ReactionType.Like,
              isLiked: postData.isLiked,
              isDisliked: postData.isDisliked
            })
          }
        >
          <ThumbsUp
            strokeWidth={1.5}
            size={16}
            className={classNames({
              'fill-black dark:fill-white': postData.isLiked
            })}
          />
        </Button>
        <span className='text-muted-foreground text-sm'>{postData.likeCount}</span>
      </div>
      {/* Dislike */}
      <div className='flex items-center space-x-0.5'>
        <Button
          size='icon'
          variant='ghost'
          className='rounded-full'
          onClick={() =>
            handleReaction({
              contentId: postData._id,
              contentType: ReactionContentType.Post,
              type: ReactionType.Dislike,
              isLiked: postData.isLiked,
              isDisliked: postData.isDisliked
            })
          }
        >
          <ThumbsDown
            strokeWidth={1.5}
            size={16}
            className={classNames({
              'fill-black dark:fill-white': postData.isDisliked
            })}
          />
        </Button>
        <span className='text-muted-foreground text-sm'>{postData.dislikeCount}</span>
      </div>
    </div>
  )
}

export default PostReaction
