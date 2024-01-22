'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import { BarChart, Loader2 } from 'lucide-react'
import { Dispatch, SetStateAction, createContext, useContext, useEffect, useState } from 'react'
import classNames from 'classnames'

import commentApis from '@/apis/comment.apis'
import CommentInput from '@/components/comment-input'
import CommentItem from '@/components/comment-item'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CommentType } from '@/constants/enum'
import { AppContext } from '@/providers/app-provider'
import { CommentItemType } from '@/types/comment.types'
import CommentList from '@/components/comment-list'

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

type SortBy = 'createdAt' | 'likeCount'

const Comment = ({ videoId }: CommentProps) => {
  const { account } = useContext(AppContext)
  const [comments, setComments] = useState<CommentItemType[]>([])
  const [commentCount, setCommentCount] = useState<number>(0)
  const [sortBy, setSortBy] = useState<SortBy>('likeCount')

  // Query: Lấy danh sách comment
  const getCommentsQuery = useQuery({
    queryKey: ['getComments', videoId, sortBy],
    queryFn: () => commentApis.getComments({ contentId: videoId, params: { sortBy } })
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

  // Sắp xếp bình luận
  const handleSort = (value: SortBy) => {
    setSortBy(value)
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
            <Button
              variant='ghost'
              className={classNames({
                'h-12 rounded-none font-normal': true,
                'bg-accent': sortBy === 'likeCount'
              })}
              onClick={() => handleSort('likeCount')}
            >
              Bình luận hàng đầu
            </Button>
            <Button
              variant='ghost'
              className={classNames({
                'h-12 rounded-none font-normal': true,
                'bg-accent': sortBy === 'createdAt'
              })}
              onClick={() => handleSort('createdAt')}
            >
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
      <div className='mt-6 relative'>
        <CommentList comments={comments} setComments={setComments} setCommentCount={setCommentCount} />
        {getCommentsQuery.isFetching && (
          <div className='absolute inset-0 bg-background/60 flex justify-center'>
            <Loader2 size={40} className='animate-spin mt-10 stroke-muted-foreground' />
          </div>
        )}
      </div>
    </WatchCommentContext.Provider>
  )
}

export default Comment
