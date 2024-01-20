'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import { BarChart } from 'lucide-react'
import { Dispatch, SetStateAction, createContext, useContext, useEffect, useState } from 'react'

import commentApis from '@/apis/comment.apis'
import CommentInput from '@/components/comment-input'
import CommentItem from '@/components/comment-item'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CommentType } from '@/constants/enum'
import { AppContext } from '@/providers/app-provider'
import { CommentItemType } from '@/types/comment.types'

type WatchCommentContextType = {
  setComments: Dispatch<SetStateAction<CommentItemType[]>>
  setCommentCount: Dispatch<SetStateAction<number>>
}

const initialWatchCommentContext: WatchCommentContextType = {
  setComments: () => null,
  setCommentCount: () => null
}

export const WatchCommentContext = createContext<WatchCommentContextType>(initialWatchCommentContext)

type CommentProps = {
  videoId: string
}

const Comment = ({ videoId }: CommentProps) => {
  const { account } = useContext(AppContext)
  const [comments, setComments] = useState<CommentItemType[]>([])
  const [commentCount, setCommentCount] = useState<number>(0)

  // Query: Lấy danh sách comment
  const getCommentsQuery = useQuery({
    queryKey: ['getComments', videoId],
    queryFn: () => commentApis.getComments({ contentId: videoId })
  })

  // Cập nhật lại danh sách comment
  useEffect(() => {
    if (!getCommentsQuery.data) return
    setComments(getCommentsQuery.data.data.data.comments)
    setCommentCount(getCommentsQuery.data?.data.data.pagination.totalRows)
  }, [getCommentsQuery.data])

  // Mutation: Thêm bình luận
  const createCommentMutation = useMutation({
    mutationKey: ['createComment'],
    mutationFn: commentApis.createComment,
    onSuccess: (data) => {
      const { comment } = data.data.data
      setComments((prev) => [comment, ...prev])
      setCommentCount((prev) => (prev += 1))
    }
  })

  // Thêm bình luận
  const handleCreateComment = (content: string) => {
    createCommentMutation.mutate({
      contentId: videoId,
      type: CommentType.Video,
      content
    })
  }

  return (
    <WatchCommentContext.Provider
      value={{
        setComments,
        setCommentCount
      }}
    >
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
      {/* Nhập bình luận */}
      <div className='flex items-start space-x-4'>
        <Avatar>
          <AvatarImage src={account?.avatar} alt={account?.channelName} />
          <AvatarFallback>{account?.channelName[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className='flex-1'>
          <CommentInput
            isPending={createCommentMutation.isPending}
            classNameInput='py-1.5 text-sm'
            onSubmit={(content) => handleCreateComment(content)}
          />
        </div>
      </div>
      {/* Danh sách bình luận */}
      <div className='mt-6 space-y-5'>
        {comments.map((comment) => (
          <CommentItem key={comment._id} commentData={comment} />
        ))}
      </div>
    </WatchCommentContext.Provider>
  )
}

export default Comment
