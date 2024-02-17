'use client'

import { useMutation } from '@tanstack/react-query'
import classNames from 'classnames'
import { BarChart, Loader2 } from 'lucide-react'
import { Dispatch, SetStateAction, createContext, useContext, useState } from 'react'

import commentApis from '@/apis/comment.apis'
import CommentInput from '@/components/comment-input'
import CommentList from '@/components/comment-list'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CommentType } from '@/constants/enum'
import useComments from '@/hooks/useComments'
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

type SortBy = 'createdAt' | 'likeCount'

const Comment = ({ videoId }: CommentProps) => {
  const { account } = useContext(AppContext)
  const [sortBy, setSortBy] = useState<SortBy>('likeCount')
  const { getCommentsQuery, comments, commentCount, setComments, setCommentCount } = useComments({
    contentId: videoId,
    limit: 5
  })

  // Mutation: Add a comment
  const createCommentMutation = useMutation({
    mutationKey: ['createComment'],
    mutationFn: commentApis.createComment,
    onSuccess: (data) => {
      const { comment } = data.data.data
      setComments((prev) => [comment, ...prev])
      setCommentCount((prev) => (prev += 1))
    }
  })

  // Add a comment
  const handleCreateComment = (content: string) => {
    createCommentMutation.mutate({
      contentId: videoId,
      type: CommentType.Video,
      content
    })
  }

  // Sort comment
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
      {/* Type comment */}
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
      {/* Comments */}
      <div className='mt-6 relative'>
        <CommentList
          comments={comments}
          setComments={setComments}
          setCommentCount={setCommentCount}
          fetchMoreComments={getCommentsQuery.fetchNextPage}
          hasMoreComments={getCommentsQuery.hasNextPage}
        />
        {getCommentsQuery.isLoading && (
          <div className='absolute inset-0 bg-background/60 flex justify-center'>
            <Loader2 size={40} className='animate-spin mt-10 stroke-muted-foreground' />
          </div>
        )}
      </div>
    </WatchCommentContext.Provider>
  )
}

export default Comment
