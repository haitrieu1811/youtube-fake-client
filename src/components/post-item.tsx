import classNames from 'classnames'
import { Flag, MessageSquareText, MoreVertical, Pencil, ThumbsDown, ThumbsUp, Trash } from 'lucide-react'
import moment from 'moment'
import Image from 'next/image'
import Link from 'next/link'
import { Dispatch, Fragment, SetStateAction, useContext, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ReactionContentType, ReactionType } from '@/constants/enum'
import PATH from '@/constants/path'
import useReaction from '@/hooks/useReaction'
import { convertMomentToVietnamese } from '@/lib/utils'
import { AppContext } from '@/providers/app-provider'
import { PostItemType } from '@/types/post.types'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'

const MAX_LENGTH_OF_CONTENT = 50

type PostItemProps = {
  postData: PostItemType
  setPosts?: Dispatch<SetStateAction<PostItemType[]>>
  isDetailMode?: boolean
}

const PostItem = ({ postData, setPosts, isDetailMode = false }: PostItemProps) => {
  const queryClient = useQueryClient()
  const { account } = useContext(AppContext)
  const [isExpandContent, setIsExpandContent] = useState<boolean>(false)

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

  // Toggle expand content
  const handleToggleExpandContent = () => {
    setIsExpandContent((prevState) => !prevState)
  }

  return (
    <div className='flex space-x-5 border border-border rounded-xl p-5'>
      <div className='flex-shrink-0'>
        {/* Avatar */}
        <Link href={PATH.PROFILE(postData.author.username)}>
          <Avatar>
            <AvatarImage src={postData.author.avatar} alt={postData.author.channelName} />
            <AvatarFallback>{postData.author.channelName[0].toUpperCase()}</AvatarFallback>
          </Avatar>
        </Link>
      </div>
      <div className='flex-1 space-y-2'>
        <div className='flex items-center space-x-2'>
          {/* Channel name */}
          <Link href={PATH.PROFILE(postData.author.username)} className='text-[13px] font-medium'>
            {postData.author.channelName}
          </Link>
          {/* Created at */}
          <span className='text-xs text-muted-foreground'>
            {convertMomentToVietnamese(moment(postData.createdAt).fromNow())}
          </span>
        </div>
        {/* Content */}
        <div className='space-y-2'>
          <div className='space-y-3'>
            <div className='whitespace-pre-line text-sm'>
              {postData.content.split(' ').length <= MAX_LENGTH_OF_CONTENT
                ? postData.content
                : !isExpandContent
                ? postData.content.split(' ').slice(0, MAX_LENGTH_OF_CONTENT).join(' ') + '...'
                : postData.content}
            </div>
            {postData.content.split(' ').length > MAX_LENGTH_OF_CONTENT && (
              <Button variant='link' className='p-0 h-auto text-blue-500' onClick={handleToggleExpandContent}>
                {!isExpandContent ? 'Đọc thêm' : 'Ẩn bớt'}
              </Button>
            )}
          </div>
          {postData.images.length > 0 && (
            <Carousel className='w-[638px]'>
              <CarouselContent>
                {postData.images.map((image) => (
                  <CarouselItem key={image}>
                    <Image
                      width={1000}
                      height={1000}
                      src={image}
                      alt={image}
                      className='rounded-xl h-[638px] w-[638px] object-cover'
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className='-left-5 w-10 h-10' />
              <CarouselNext className='-right-5 w-10 h-10' />
            </Carousel>
          )}
          <div className='flex items-center space-x-6'>
            {/* Likes and dislikes */}
            <div className='flex items-center space-x-3 -ml-2.5'>
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
            {/* Comments */}
            {!isDetailMode && (
              <div className='flex items-center space-x-0.5'>
                <Button size='icon' variant='ghost' className='rounded-full' asChild>
                  <Link href={PATH.POST_DETAIL(postData._id)}>
                    <MessageSquareText strokeWidth={1.5} size={16} />
                  </Link>
                </Button>
                <span className='text-muted-foreground text-sm'>{postData.commentCount}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Actions */}
      <Popover>
        <PopoverTrigger asChild>
          <Button size='icon' variant='ghost' className='rounded-full'>
            <MoreVertical strokeWidth={1.5} size={18} />
          </Button>
        </PopoverTrigger>
        <PopoverContent align='start' className='px-0 py-2 w-auto rounded-xl'>
          {account?._id === postData.author._id && (
            <Fragment>
              <Button variant='ghost' className='flex justify-start space-x-3 rounded-none w-full pr-10'>
                <Pencil strokeWidth={1.5} size={18} />
                <span>Chỉnh sửa</span>
              </Button>
              <Button variant='ghost' className='flex justify-start space-x-3 rounded-none w-full pr-10'>
                <Trash strokeWidth={1.5} size={18} />
                <span>Xóa</span>
              </Button>
            </Fragment>
          )}
          {account?._id !== postData.author._id && (
            <Button variant='ghost' className='flex justify-start space-x-3 rounded-none w-full pr-10'>
              <Flag strokeWidth={1.5} size={18} />
              <span>Báo vi phạm</span>
            </Button>
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default PostItem
