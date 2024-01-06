'use client'

import { useQuery } from '@tanstack/react-query'
import { BarChart } from 'lucide-react'
import { Fragment, useEffect, useState } from 'react'

import commentApis from '@/apis/comment.apis'
import CommentInput from '@/components/comment-input'
import CommentRow from '@/components/comment-row'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { AccountType } from '@/types/account.types'
import { CommentItemType } from '@/types/comment.types'

type CommentProps = {
  accountData: AccountType | null
  videoId: string
}

const Comment = ({ accountData, videoId }: CommentProps) => {
  const [comments, setComments] = useState<CommentItemType[]>([])
  const [commentCount, setCommentCount] = useState<number>(0)

  // Query: Lấy danh sách comment
  const getCommentsQuery = useQuery({
    queryKey: ['getComments'],
    queryFn: () => commentApis.getComments({ contentId: videoId })
  })

  // Cập nhật lại danh sách comment
  useEffect(() => {
    if (!getCommentsQuery.data) return
    setComments(getCommentsQuery.data.data.data.comments)
    setCommentCount(getCommentsQuery.data?.data.data.pagination.totalRows)
  }, [getCommentsQuery.data])

  // Xử lý khi có comment mới
  const handleNewComment = (newComment: CommentItemType) => {
    setComments((prev) => [newComment, ...prev])
    setCommentCount((prev) => (prev += 1))
  }

  return (
    <Fragment>
      <div className='flex items-center space-x-6 mb-6'>
        <h3 className='text-xl font-semibold'>{commentCount} bình luận</h3>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant='ghost' className='space-x-3 h-11'>
              <BarChart strokeWidth={1.5} />
              <span>Sắp xếp theo</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent align='start' className='px-0 py-2 rounded-lg w-auto flex-col flex'>
            <Button variant='ghost' className='h-12 rounded-none font-normal'>
              Bình luận hàng đầu
            </Button>
            <Button variant='ghost' className='h-12 rounded-none font-normal'>
              Mới nhất xếp trước
            </Button>
          </PopoverContent>
        </Popover>
      </div>
      {accountData && (
        <CommentInput
          isRootComment
          accountData={accountData}
          contentId={videoId}
          onSuccess={(newComment) => handleNewComment(newComment)}
        />
      )}
      <div className='mt-6 space-y-5'>
        {comments.map((comment) => (
          <CommentRow key={comment._id} commentData={comment} contentId={videoId} />
        ))}
      </div>
    </Fragment>
  )
}

export default Comment
