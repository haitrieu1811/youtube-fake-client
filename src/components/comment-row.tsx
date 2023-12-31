'use client'

import classNames from 'classnames'
import { CheckCircle2, ChevronDown, Flag, MoreVertical, Pencil, ThumbsDown, ThumbsUp, Trash2 } from 'lucide-react'
import moment from 'moment'
import Link from 'next/link'
import { Fragment, useContext, useState } from 'react'

import { convertMomentToVietnamese } from '@/lib/utils'
import { AppContext } from '@/providers/app-provider'
import { CommentItemType } from '@/types/comment.types'
import CommentInput from './comment-input'
import { CommentItemContext } from './comment-item'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'

type CommentRowProps = {
  isRootComment?: boolean
  commentData: CommentItemType
  contentId: string
  isShowReplies?: boolean
}

const CommentRow = ({ isRootComment = true, commentData, contentId, isShowReplies = false }: CommentRowProps) => {
  const { account } = useContext(AppContext)
  const { toggleReplies, replyCount } = useContext(CommentItemContext)
  const [isShowReplyInput, setIsShowReplyInput] = useState<boolean>(false)

  const handleStartReply = () => {
    setIsShowReplyInput(true)
  }

  const handleStopReply = () => {
    setIsShowReplyInput(false)
  }

  return (
    <div className='flex items-start space-x-4 group'>
      <Link href={'/'} className='flex-shrink-0'>
        <Avatar
          className={classNames({
            'w-6 h-6': !isRootComment
          })}
        >
          <AvatarImage src={commentData.author.avatar} alt={commentData.author.channelName} />
          <AvatarFallback
            className={classNames({
              'text-xs': !isRootComment
            })}
          >
            {commentData.author.channelName[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </Link>
      <div className='flex-1 space-y-1'>
        <div className='flex items-center space-x-3'>
          <div className='flex items-center space-x-1'>
            <h4 className='text-[13px] font-medium'>@{commentData.author.username}</h4>
            <CheckCircle2 size={12} className='fill-blue-600 dark:fill-blue-500 stroke-background' />
          </div>
          <div className='text-muted-foreground text-xs'>
            {convertMomentToVietnamese(moment(commentData.createdAt).fromNow())}
          </div>
        </div>
        <div className='text-sm'>{commentData.content}</div>
        <div className='flex items-center space-x-3 -ml-2'>
          <div className='space-x-1 flex items-center'>
            <Button variant='ghost' size='icon' className='rounded-full'>
              <ThumbsUp strokeWidth={1.5} size={16} />
            </Button>
            <span className='text-xs text-muted-foreground'>{commentData.likeCount}</span>
          </div>
          <div className='space-x-1 flex items-center'>
            <Button variant='ghost' size='icon' className='rounded-full'>
              <ThumbsDown strokeWidth={1.5} size={16} />
            </Button>
            <span className='text-xs text-muted-foreground'>{commentData.likeCount}</span>
          </div>
          <Button variant='ghost' className='text-xs rounded-full' onClick={handleStartReply}>
            Phản hồi
          </Button>
        </div>
        {/* Nhập phản hồi */}
        {account && (
          <CommentInput
            isRootComment={false}
            isShow={isShowReplyInput}
            contentId={contentId}
            authorId={commentData.author._id}
            onCancel={handleStopReply}
          />
        )}
        {isRootComment && !!replyCount && replyCount > 0 && (
          <Button
            variant='ghost'
            className='rounded-full space-x-2 text-blue-600 hover:text-blue-600 hover:bg-blue-500/10 -ml-3.5'
            onClick={toggleReplies}
          >
            <ChevronDown
              size={16}
              className={classNames({
                'transition-all': true,
                '-rotate-180': isShowReplies
              })}
            />
            <span>{replyCount} phản hồi</span>
          </Button>
        )}
      </div>
      <Popover>
        <PopoverTrigger className='opacity-0 group-hover:opacity-100' asChild>
          <Button size='icon' variant='ghost' className='flex-shrink-0 rounded-full'>
            <MoreVertical size={18} />
          </Button>
        </PopoverTrigger>
        <PopoverContent align='start' className='p-0 w-auto flex flex-col py-2 rounded-xl'>
          {account && account._id === commentData.author._id && (
            <Fragment>
              <Button variant='ghost' className='space-x-3 justify-start rounded-none pr-10'>
                <Pencil size={18} strokeWidth={1.5} />
                <span>Chỉnh sửa</span>
              </Button>
              <Button variant='ghost' className='space-x-3 justify-start rounded-none pr-10'>
                <Trash2 size={18} strokeWidth={1.5} />
                <span>Xóa</span>
              </Button>
            </Fragment>
          )}
          {account && account._id !== commentData.author._id && (
            <Button variant='ghost' className='space-x-3 justify-start rounded-none pr-10'>
              <Flag size={18} strokeWidth={1.5} />
              <span>Báo vi phạm</span>
            </Button>
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default CommentRow
