'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import classNames from 'classnames'
import { CheckCircle2, Flag, MoreVertical, Pencil, ThumbsDown, ThumbsUp, Trash2 } from 'lucide-react'
import moment from 'moment'
import Link from 'next/link'
import { Dispatch, Fragment, SetStateAction, useContext, useMemo, useState } from 'react'

import commentApis from '@/apis/comment.apis'
import { WatchCommentContext } from '@/app/(nosidebar)/watch/[idName]/_components/comment'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { ReactionContentType, ReactionType } from '@/constants/enum'
import PATH from '@/constants/path'
import useReaction from '@/hooks/useReaction'
import { convertMomentToVietnamese } from '@/lib/utils'
import { AppContext } from '@/providers/app-provider'
import { CommentItemType } from '@/types/comment.types'
import CommentInput from './comment-input'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { toast } from './ui/use-toast'
import { CommentListContext } from './comment-list'

type CommentRowProps = {
  isRootComment?: boolean
  commentData: CommentItemType
  commentRootId?: string
  replyAccountId?: string
  replyCount?: number
  setReplies: Dispatch<SetStateAction<CommentItemType[]>>
  setReplyCount: Dispatch<SetStateAction<number>>
}

const MAX_LENGTH_COMMENT_CONTENT = 50

const CommentRow = ({
  isRootComment = true,
  commentData,
  commentRootId,
  replyAccountId,
  replyCount,
  setReplies,
  setReplyCount
}: CommentRowProps) => {
  const { account } = useContext(AppContext)
  const { setComments, setCommentCount } = useContext(CommentListContext)
  const [isShowReplyInput, setIsShowReplyInput] = useState<boolean>(false)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [isSeeMoreContent, setIsSeeMoreContent] = useState<boolean>(false)

  const toggleSeeMoreContent = () => {
    setIsSeeMoreContent((prevState) => !prevState)
  }

  // Query: Lấy thông tin bình luận
  const getCommentDetailQuery = useQuery({
    queryKey: ['getCommentDetail', commentData._id],
    queryFn: () => commentApis.getCommentDetail(commentData._id),
    enabled: isEditing
  })

  // Thông tin bình luận
  const commentDetail = useMemo(
    () => getCommentDetailQuery.data?.data.data.comment,
    [getCommentDetailQuery.data?.data.data.comment]
  )

  // Mutation: Trả lời bình luận
  const replyCommentMutation = useMutation({
    mutationKey: ['replyComment'],
    mutationFn: commentApis.replyComment,
    onSuccess: (data) => {
      const { comment } = data.data.data
      setReplies((prevState) => [...prevState, comment])
      setReplyCount((prevState) => (prevState += 1))
      setCommentCount && setCommentCount((prevState) => (prevState += 1))
    }
  })

  // Trả lời bình luận
  const handleReplyComment = (content: string) => {
    if (!commentRootId) return
    replyCommentMutation.mutate({
      commentId: commentRootId,
      body: {
        content,
        replyAccountId
      }
    })
  }

  // Mutation: Cập nhật bình luận
  const updateCommentMutation = useMutation({
    mutationKey: ['updateComment'],
    mutationFn: commentApis.updateComment,
    onSuccess: (data) => {
      const { comment } = data.data.data
      let setState = setComments
      if (comment.parentId) setState = setReplies
      setState((prevState) =>
        prevState.map((item) => {
          if (item._id === comment._id) {
            return {
              ...item,
              content: comment.content
            }
          }
          return item
        })
      )
    }
  })

  // Cập nhật bình luận
  const handleUpdateComment = (content: string) => {
    updateCommentMutation.mutate({
      commentId: commentData._id,
      body: { content }
    })
  }

  // Mutation: Xóa bình luận
  const deleteCommentMutation = useMutation({
    mutationKey: ['deleteComment'],
    mutationFn: commentApis.deleteComment
  })

  // Xóa bình luận
  const handleDeleteComment = (commentId: string) => {
    deleteCommentMutation.mutate(commentId, {
      onSuccess: () => {
        const title = isRootComment ? 'Đã xóa bình luận' : 'Đã xóa phản hồi'
        const description = isRootComment ? 'Bình luận đã được xóa vĩnh viễn' : 'Phản hồi đã được xóa vĩnh viễn'
        toast({
          title,
          description,
          className: 'shadow-none bg-black dark:bg-white text-white dark:text-black'
        })
        if (!isRootComment) {
          setReplyCount((prevState) => (prevState -= 1))
          setCommentCount && setCommentCount((prevState) => (prevState -= 1))
          setReplies((prevState) => prevState.filter((item) => item._id !== commentId))
        } else {
          if (replyCount === undefined) return
          setCommentCount && setCommentCount((prevState) => (prevState -= replyCount + 1))
          setComments((prevState) => prevState.filter((item) => item._id !== commentId))
        }
      }
    })
  }

  // Like/dislike bình luận
  const { handleReaction } = useReaction({
    onCreateSuccess(data) {
      const { reaction } = data.data.data
      let setState = setComments
      if (!isRootComment) setState = setReplies
      setState((prevState) =>
        prevState.map((item) => {
          if (item._id === commentData._id) {
            if (reaction.type === ReactionType.Like) {
              return {
                ...item,
                isLiked: true,
                likeCount: item.likeCount + 1
              }
            } else {
              return {
                ...item,
                isDisliked: true,
                dislikeCount: item.dislikeCount + 1
              }
            }
          }
          return item
        })
      )
    },
    onUpdateSuccess(data) {
      const { reaction } = data.data.data
      let setState = setComments
      if (!isRootComment) setState = setReplies
      setState((prevState) =>
        prevState.map((item) => {
          if (item._id === commentData._id) {
            if (reaction.type === ReactionType.Like) {
              return {
                ...item,
                isLiked: true,
                isDisliked: false,
                likeCount: item.likeCount + 1,
                dislikeCount: item.dislikeCount - 1
              }
            } else {
              return {
                ...item,
                isLiked: false,
                isDisliked: true,
                likeCount: item.likeCount - 1,
                dislikeCount: item.dislikeCount + 1
              }
            }
          }
          return item
        })
      )
    },
    onDeleteSuccess(data) {
      const { reaction } = data.data.data
      let setState = setComments
      if (!isRootComment) setState = setReplies
      setState((prevState) =>
        prevState.map((item) => {
          if (item._id === commentData._id) {
            if (reaction.type === ReactionType.Like) {
              return {
                ...item,
                isLiked: false,
                likeCount: item.likeCount - 1
              }
            } else {
              return {
                ...item,
                isDisliked: false,
                dislikeCount: item.dislikeCount - 1
              }
            }
          }
          return item
        })
      )
    }
  })

  return (
    <div className='flex items-start space-x-4 group'>
      <Link href={PATH.PROFILE(commentData.author.username)} className='flex-shrink-0'>
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
        {/* Khi không chỉnh sửa thì hiển thị thông tin bình luận */}
        {!isEditing && (
          <Fragment>
            <div className='flex items-center space-x-3'>
              <div className='flex items-center space-x-1'>
                <Link href={PATH.PROFILE(commentData.author.username)}>
                  <h4 className='text-[13px] font-medium'>@{commentData.author.username}</h4>
                </Link>
                <CheckCircle2 size={12} className='fill-blue-600 dark:fill-blue-500 stroke-background' />
              </div>
              <div className='text-muted-foreground text-xs'>
                {convertMomentToVietnamese(moment(commentData.createdAt).fromNow())}
              </div>
            </div>
            <div className='space-y-1'>
              <div className='text-sm'>
                {commentData.replyAccount && (
                  <Link href={PATH.PROFILE(commentData.replyAccount.username)} className='text-blue-500 mr-1.5'>
                    @{commentData.replyAccount.username}
                  </Link>
                )}
                {commentData.content.split(' ').length <= MAX_LENGTH_COMMENT_CONTENT
                  ? commentData.content
                  : !isSeeMoreContent
                  ? `${commentData.content.split(' ').slice(0, MAX_LENGTH_COMMENT_CONTENT).join(' ')}...`
                  : commentData.content}
              </div>
              {commentData.content.split(' ').length > MAX_LENGTH_COMMENT_CONTENT && (
                <Button variant='link' className='p-0 h-auto' onClick={toggleSeeMoreContent}>
                  {!isSeeMoreContent ? 'Đọc thêm' : 'Ẩn bớt'}
                </Button>
              )}
            </div>
            <div className='flex items-center space-x-3 -ml-2'>
              <div className='space-x-1 flex items-center'>
                <Button
                  variant='ghost'
                  size='icon'
                  className='rounded-full'
                  onClick={() =>
                    handleReaction({
                      contentId: commentData._id,
                      contentType: ReactionContentType.Comment,
                      isLiked: commentData.isLiked,
                      isDisliked: commentData.isDisliked,
                      type: ReactionType.Like
                    })
                  }
                >
                  <ThumbsUp
                    strokeWidth={1.5}
                    size={16}
                    className={classNames({
                      'fill-black dark:fill-white': commentData.isLiked
                    })}
                  />
                </Button>
                <span className='text-xs text-muted-foreground'>{commentData.likeCount}</span>
              </div>
              <div className='space-x-1 flex items-center'>
                <Button
                  variant='ghost'
                  size='icon'
                  className='rounded-full'
                  onClick={() =>
                    handleReaction({
                      contentId: commentData._id,
                      contentType: ReactionContentType.Comment,
                      isLiked: commentData.isLiked,
                      isDisliked: commentData.isDisliked,
                      type: ReactionType.Dislike
                    })
                  }
                >
                  <ThumbsDown
                    strokeWidth={1.5}
                    size={16}
                    className={classNames({
                      'fill-black dark:fill-white': commentData.isDisliked
                    })}
                  />
                </Button>
                <span className='text-xs text-muted-foreground'>{commentData.dislikeCount}</span>
              </div>
              <Button variant='ghost' className='text-xs rounded-full' onClick={() => setIsShowReplyInput(true)}>
                Phản hồi
              </Button>
            </div>
          </Fragment>
        )}
        {/* Chỉnh sửa */}
        {isEditing && commentDetail && (
          <CommentInput
            autoFocus
            value={commentDetail.content}
            actionText='Lưu'
            isPending={updateCommentMutation.isPending}
            classNameInput={classNames({
              'text-sm': true,
              'py-1': !isRootComment,
              'py-2': isRootComment
            })}
            onCancel={() => setIsEditing(false)}
            onSubmit={(content) => handleUpdateComment(content)}
          />
        )}
        {/* Nhập phản hồi */}
        {account && isShowReplyInput && !isEditing && (
          <div className='flex items-start space-x-4'>
            <Avatar className='flex-shrink-0 w-6 h-6'>
              <AvatarImage src={account.avatar} alt={account.channelName} />
              <AvatarFallback>{account.channelName[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className='flex-1'>
              <CommentInput
                autoFocus
                actionText='Phản hồi'
                classNameInput='text-sm py-1'
                onCancel={() => setIsShowReplyInput(false)}
                onSubmit={(content) => handleReplyComment(content)}
              />
            </div>
          </div>
        )}
      </div>
      {!isEditing && (
        <Popover>
          <PopoverTrigger className='opacity-0 group-hover:opacity-100' asChild>
            <Button size='icon' variant='ghost' className='flex-shrink-0 rounded-full'>
              <MoreVertical size={18} />
            </Button>
          </PopoverTrigger>
          <PopoverContent align='start' className='p-0 w-auto flex flex-col py-2 rounded-xl'>
            {account && account?._id === commentData.author._id && (
              <Fragment>
                <Button
                  variant='ghost'
                  className='space-x-3 justify-start rounded-none pr-10'
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil size={18} strokeWidth={1.5} />
                  <span>Chỉnh sửa</span>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant='ghost' className='space-x-3 justify-start rounded-none pr-10'>
                      <Trash2 size={18} strokeWidth={1.5} />
                      <span>Xóa</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className='max-w-xs'>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{isRootComment ? 'Xóa bình luận' : 'Xóa phản hồi'}</AlertDialogTitle>
                      <AlertDialogDescription>
                        Xóa {isRootComment ? 'bình luận' : 'phản hồi'} của bạn vĩnh viễn?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className='rounded-full'>Hủy</AlertDialogCancel>
                      <AlertDialogAction className='rounded-full' onClick={() => handleDeleteComment(commentData._id)}>
                        Xóa
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </Fragment>
            )}
            {account && account?._id !== commentData.author._id && (
              <Button variant='ghost' className='space-x-3 justify-start rounded-none pr-10'>
                <Flag size={18} strokeWidth={1.5} />
                <span>Báo vi phạm</span>
              </Button>
            )}
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}

export default CommentRow
