'use client'

import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { Dispatch, SetStateAction, createContext, useEffect, useState } from 'react'

import commentApis from '@/apis/comment.apis'
import { CommentItemType } from '@/types/comment.types'
import CommentRow from './comment-row'

type CommentRowContextType = {
  rootCommentData: CommentItemType | null
  toggleReplies: () => void
  replies: CommentItemType[]
  setReplies: Dispatch<SetStateAction<CommentItemType[]>>
  replyCount: number
  setReplyCount: Dispatch<SetStateAction<number>>
}

const initialContext: CommentRowContextType = {
  rootCommentData: null,
  toggleReplies: () => null,
  replies: [],
  setReplies: () => null,
  replyCount: 0,
  setReplyCount: () => null
}

export const CommentItemContext = createContext<CommentRowContextType>(initialContext)

type CommentItemProps = {
  commentData: CommentItemType
  contentId: string
}

const CommentItem = ({ commentData, contentId }: CommentItemProps) => {
  const [isShowReplies, setIsShowReplies] = useState<boolean>(false)
  const [replies, setReplies] = useState<CommentItemType[]>(initialContext.replies)
  const [replyCount, setReplyCount] = useState<number>(initialContext.replyCount)

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

  // Đặt giá trị cho reply count
  useEffect(() => {
    setReplyCount(commentData.replyCount)
  }, [commentData])

  // Ẩn hiện phần phản hồi bình luận
  const toggleReplies = () => {
    setIsShowReplies((prev) => !prev)
  }

  return (
    <CommentItemContext.Provider
      value={{
        rootCommentData: commentData,
        toggleReplies,
        replies,
        setReplies,
        replyCount,
        setReplyCount
      }}
    >
      <div>
        {/* Comment gốc */}
        <CommentRow contentId={contentId} commentData={commentData} isShowReplies={isShowReplies} />
        {getRepliesCommentQuery.isLoading && (
          <div className='flex justify-center'>
            <Loader2 className='animate-spin w-10 h-10 stroke-muted-foreground' />
          </div>
        )}
        {/* Danh sách phản hồi comment */}
        {replies.length > 0 && isShowReplies && (
          <div className='pl-11 py-4 space-y-3'>
            {replies.map((comment) => (
              <CommentRow key={comment._id} commentData={comment} contentId={contentId} isRootComment={false} />
            ))}
          </div>
        )}
      </div>
    </CommentItemContext.Provider>
  )
}

export default CommentItem
