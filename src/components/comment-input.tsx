'use client'

import { useMutation } from '@tanstack/react-query'
import classNames from 'classnames'
import { ChangeEvent, FormEvent, Fragment, useState } from 'react'
import { Loader2 } from 'lucide-react'

import commentApis from '@/apis/comment.apis'
import { CommentType } from '@/constants/enum'
import { AccountType } from '@/types/account.types'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { CommentItemType } from '@/types/comment.types'

type CommentInputProps = {
  accountData: AccountType
  isRootComment?: boolean
  contentId: string
  onSuccess?: (newComment: CommentItemType) => void
  isShow?: boolean
  onCancel?: () => void
  parentCommentId?: string
  authorId?: string
  onReplySuccess?: (newComment: CommentItemType) => void
}

const CommentInput = ({
  accountData,
  isRootComment = false,
  contentId,
  onSuccess,
  isShow = true,
  onCancel,
  parentCommentId,
  authorId,
  onReplySuccess
}: CommentInputProps) => {
  const [content, setContent] = useState<string>('')
  const [isStart, setIsStart] = useState<boolean>(false)

  const startComment = () => {
    setIsStart(true)
  }

  const stopComment = () => {
    setIsStart(false)
    setContent('')
    onCancel && onCancel()
  }

  const handleChangeContent = (e: ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value)
  }

  // Mutation: Thêm comment
  const createCommentMutation = useMutation({
    mutationKey: ['createComment'],
    mutationFn: commentApis.createComment,
    onSuccess: (data) => {
      const { comment } = data.data.data
      onSuccess && onSuccess(comment)
      stopComment()
    }
  })

  // Mutation: Trả lời comment
  const replyCommentMutation = useMutation({
    mutationKey: ['replyComment'],
    mutationFn: commentApis.replyComment,
    onSuccess: (data) => {
      const { comment } = data.data.data
      onSuccess && onSuccess(comment)
      stopComment()
      onReplySuccess && onReplySuccess(comment)
    }
  })

  // Thêm comment
  const handleCreateComment = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!content.trim()) return
    if (isRootComment) {
      createCommentMutation.mutate({
        content,
        contentId,
        type: CommentType.Video
      })
    } else {
      if (!parentCommentId) return
      replyCommentMutation.mutate({
        commentId: parentCommentId,
        body: {
          content,
          replyAccountId: authorId
        }
      })
    }
  }

  return (
    <Fragment>
      {isShow && (
        <div className='flex items-start space-x-5'>
          <Avatar
            className={classNames({
              'flex-shrink-0': true,
              'w-6 h-6': !isRootComment
            })}
          >
            <AvatarImage src={accountData.avatar} alt={accountData.channelName} />
            <AvatarFallback>{accountData.channelName[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className='flex-1'>
            <form onSubmit={handleCreateComment}>
              <input
                autoFocus={!isRootComment}
                type='text'
                placeholder={isRootComment ? 'Viết bình luận...' : 'Phản hồi...'}
                value={content}
                className={classNames({
                  'outline-none w-full placeholder:text-muted-foreground border-b border-b-border bg-transparent': true,
                  'py-1 text-[13px]': !isRootComment,
                  'py-2 text-sm': isRootComment
                })}
                onChange={handleChangeContent}
                onFocus={startComment}
              />
              <div className='flex justify-end items-center space-x-3 mt-2'>
                {isStart && (
                  <Fragment>
                    <Button type='button' variant='ghost' className='rounded-full' onClick={stopComment}>
                      Hủy
                    </Button>
                    <Button
                      type='submit'
                      disabled={!content || createCommentMutation.isPending}
                      className='rounded-full bg-blue-700 hover:bg-blue-800 text-white'
                    >
                      {createCommentMutation.isPending && <Loader2 className='w-4 h-4 mr-3 animate-spin' />}
                      {isRootComment ? 'Bình luận' : 'Phản hồi'}
                    </Button>
                  </Fragment>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </Fragment>
  )
}

export default CommentInput
