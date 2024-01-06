'use client'

import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import { CommentItemType } from '@/types/comment.types'
import CommentItem from './comment-item'
import commentApis from '@/apis/comment.apis'
import { Loader2 } from 'lucide-react'

type CommentRowProps = {
  commentData: CommentItemType
  contentId: string
}

const CommentRow = ({ commentData, contentId }: CommentRowProps) => {
  const [replies, setReplies] = useState<CommentItemType[]>([])
  const [isShowReplies, setIsShowReplies] = useState<boolean>(false)

  // Query: Lấy danh sách trả lời bình luận
  const getRepliesCommentQuery = useQuery({
    queryKey: ['getRepliesComment', commentData._id],
    queryFn: () => commentApis.getRepliesComment({ commentId: commentData._id }),
    enabled: isShowReplies
  })

  // Đặt giá trị cho mảng replies
  useEffect(() => {
    if (!getRepliesCommentQuery.data) return
    setReplies(getRepliesCommentQuery.data.data.data.comments)
  }, [getRepliesCommentQuery.data])

  const handleShowReplies = () => {
    setIsShowReplies((prev) => !prev)
  }

  const handleReplySuccess = (newComment: CommentItemType) => {
    setReplies((prev) => [newComment, ...prev])
  }

  return (
    <div>
      <CommentItem
        commentData={commentData}
        contentId={contentId}
        replyCount={commentData.replyCount}
        isShowReplies={isShowReplies}
        onShowReplies={handleShowReplies}
        onReplySuccess={(newComment) => handleReplySuccess(newComment)}
      />
      {getRepliesCommentQuery.isLoading && (
        <div className='flex justify-center'>
          <Loader2 className='animate-spin w-10 h-10 stroke-muted-foreground' />
        </div>
      )}
      {replies.length > 0 && isShowReplies && (
        <div className='pl-11 py-4 space-y-3'>
          {replies.map((comment) => (
            <CommentItem key={comment._id} commentData={comment} contentId={contentId} isRootComment={false} />
          ))}
        </div>
      )}
    </div>
  )
}

export default CommentRow
