'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import classNames from 'classnames'
import { ChevronDown, CornerDownRight, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'

import commentApis from '@/apis/comment.apis'
import { CommentItemType } from '@/types/comment.types'
import CommentRow from './comment-row'
import { Button } from './ui/button'

type CommentItemProps = {
  commentData: CommentItemType
}

const MAX_REPLIES_ONE_PAGE = 2

const CommentItem = ({ commentData }: CommentItemProps) => {
  const [replies, setReplies] = useState<CommentItemType[]>([])
  const [replyCount, setReplyCount] = useState<number>(0)
  const [isShowReplies, setIsShowReplies] = useState<boolean>(false)

  // Query: Lấy danh sách trả lời bình luận
  const getRepliesCommentQuery = useInfiniteQuery({
    queryKey: ['getRepliesComment', commentData._id],
    queryFn: ({ pageParam }) =>
      commentApis.getRepliesComment({
        commentId: commentData._id,
        params: {
          page: String(pageParam),
          limit: String(MAX_REPLIES_ONE_PAGE)
        }
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.data.data.pagination.page < lastPage.data.data.pagination.totalPages
        ? lastPage.data.data.pagination.page + 1
        : undefined,
    enabled: isShowReplies
  })

  // Đặt giá trị cho mảng replies
  useEffect(() => {
    if (!getRepliesCommentQuery.data) return
    setReplies(getRepliesCommentQuery.data.pages.map((page) => page.data.data.comments).flat())
  }, [getRepliesCommentQuery.data])

  // Đặt giá trị cho reply count
  useEffect(() => {
    setReplyCount(commentData.replyCount)
  }, [commentData])

  // Ẩn hiện phần phản hồi bình luận
  const toggleReplies = () => {
    setIsShowReplies((prev) => !prev)
  }

  return (
    <div>
      {/* Bình luận gốc */}
      <CommentRow
        commentData={commentData}
        commentRootId={commentData._id}
        replyAccountId={commentData.author._id}
        replyCount={replyCount}
        setReplies={setReplies}
        setReplyCount={setReplyCount}
      />
      {/* Nút show danh sách phản hồi bình luận */}
      {replyCount > 0 && (
        <div className='pl-11 py-2'>
          <Button
            variant='ghost'
            className='rounded-full space-x-2 text-blue-600 hover:text-blue-600 hover:bg-blue-500/10'
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
        </div>
      )}
      {/* Loading danh sách phản hồi */}
      {getRepliesCommentQuery.isLoading && (
        <div className='flex justify-center'>
          <Loader2 className='animate-spin w-10 h-10 stroke-muted-foreground' />
        </div>
      )}
      {/* Danh sách phản hồi */}
      {replies.length > 0 && isShowReplies && !getRepliesCommentQuery.isLoading && (
        <div className='pl-11 py-4 space-y-3'>
          {replies.map((comment) => (
            <CommentRow
              key={comment._id}
              isRootComment={false}
              commentRootId={commentData._id}
              commentData={comment}
              replyAccountId={comment.author._id}
              setReplies={setReplies}
              setReplyCount={setReplyCount}
            />
          ))}
          {/* Hiển thị thêm phản hồi */}
          {replyCount > MAX_REPLIES_ONE_PAGE && getRepliesCommentQuery.hasNextPage && (
            <div className='py-2'>
              <Button
                variant='ghost'
                className='rounded-full space-x-2 text-blue-600 hover:text-blue-600 hover:bg-blue-500/10'
                onClick={() => getRepliesCommentQuery.fetchNextPage()}
              >
                <CornerDownRight size={16} />
                <span>Hiện thêm phản hồi</span>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default CommentItem
