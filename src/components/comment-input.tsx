'use client'

import { useMutation } from '@tanstack/react-query'
import classNames from 'classnames'
import { Loader2 } from 'lucide-react'
import { ChangeEvent, FormEvent, Fragment, useContext, useState } from 'react'

import commentApis from '@/apis/comment.apis'
import { CommentType } from '@/constants/enum'
import { AppContext } from '@/providers/app-provider'
import { CommentItemType } from '@/types/comment.types'
import { CommentItemContext } from './comment-item'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'

type CommentInputProps = {
  isRootComment?: boolean
  isShow?: boolean
  authorId?: string
  contentId: string
  autoFocus?: boolean
  value?: string
  actionText?: string
  cancelText?: string
  commentId?: string
  onCancel?: () => void
  onSuccess?: (newComment: CommentItemType) => void
}

const CommentInput = ({
  isRootComment = false,
  isShow = true,
  authorId,
  contentId,
  autoFocus = false,
  value,
  actionText = 'Bình luận',
  cancelText = 'Hủy',
  commentId,
  onCancel,
  onSuccess
}: CommentInputProps) => {
  const { account } = useContext(AppContext)
  const { rootCommentData, setReplies, setReplyCount } = useContext(CommentItemContext)
  const [content, setContent] = useState<string>(value || '')
  const [isStartComment, setIsStartComment] = useState<boolean>(false)

  const startComment = () => {
    setIsStartComment(true)
  }

  const stopComment = () => {
    setIsStartComment(false)
    setContent('')
    onCancel && onCancel()
  }

  const handleChangeContent = (e: ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value)
  }

  // Mutation: Thêm bình luận
  const createCommentMutation = useMutation({
    mutationKey: ['createComment'],
    mutationFn: commentApis.createComment,
    onSuccess: (data) => {
      const { comment } = data.data.data
      onSuccess && onSuccess(comment)
      stopComment()
    }
  })

  // Mutation: Trả lời bình luận
  const replyCommentMutation = useMutation({
    mutationKey: ['replyComment'],
    mutationFn: commentApis.replyComment,
    onSuccess: (data) => {
      const { comment } = data.data.data
      onSuccess && onSuccess(comment)
      stopComment()
      setReplies((prevState) => [comment, ...prevState])
      setReplyCount((prevState) => (prevState += 1))
    }
  })

  // Mutation: Cập nhật bình luận
  const updateCommentMutation = useMutation({
    mutationKey: ['updateComment'],
    mutationFn: commentApis.updateComment
  })

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!content.trim()) return
    if (commentId) {
      updateCommentMutation.mutate({
        commentId,
        body: {
          content
        }
      })
    }
    if (isRootComment) {
      createCommentMutation.mutate({
        content,
        contentId,
        type: CommentType.Video
      })
    } else {
      if (!rootCommentData) return
      replyCommentMutation.mutate({
        commentId: rootCommentData._id,
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
          {account && (
            <Avatar
              className={classNames({
                'flex-shrink-0': true,
                'w-6 h-6': !isRootComment
              })}
            >
              <AvatarImage src={account.avatar} alt={account.channelName} />
              <AvatarFallback>{account.channelName[0].toUpperCase()}</AvatarFallback>
            </Avatar>
          )}
          <div className='flex-1'>
            <form onSubmit={onSubmit}>
              <input
                autoFocus={autoFocus}
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
                {isStartComment && (
                  <Fragment>
                    <Button type='button' variant='ghost' className='rounded-full' onClick={stopComment}>
                      {cancelText}
                    </Button>
                    <Button
                      type='submit'
                      disabled={!content || createCommentMutation.isPending}
                      className='rounded-full bg-blue-700 hover:bg-blue-800 text-white'
                    >
                      {createCommentMutation.isPending && <Loader2 className='w-4 h-4 mr-3 animate-spin' />}
                      {actionText}
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
