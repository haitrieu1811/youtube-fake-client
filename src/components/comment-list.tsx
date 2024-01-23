'use client'

import { Dispatch, SetStateAction, createContext } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

import { CommentItemType } from '@/types/comment.types'
import CommentItem from './comment-item'
import { Loader2 } from 'lucide-react'

type CommentListContextType = {
  comments: CommentItemType[]
  setComments: Dispatch<SetStateAction<CommentItemType[]>>
  setCommentCount?: Dispatch<SetStateAction<number>>
}

export const CommentListContext = createContext<CommentListContextType>({
  comments: [],
  setComments: () => null,
  setCommentCount: () => null
})

type CommentListProps = {
  comments: CommentItemType[]
  setComments: Dispatch<SetStateAction<CommentItemType[]>>
  setCommentCount?: Dispatch<SetStateAction<number>>
  fetchMoreComments: () => void
  hasMoreComments: boolean
}

const CommentList = ({
  comments,
  setComments,
  setCommentCount,
  fetchMoreComments,
  hasMoreComments
}: CommentListProps) => {
  return (
    <CommentListContext.Provider
      value={{
        comments,
        setComments,
        setCommentCount
      }}
    >
      <InfiniteScroll
        dataLength={comments.length}
        next={fetchMoreComments}
        hasMore={hasMoreComments}
        scrollThreshold={1}
        loader={
          <div className='flex justify-center py-5'>
            <Loader2 size={40} strokeWidth={1.5} className='animate-spin stroke-muted-foreground' />
          </div>
        }
        className='space-y-5 py-5'
      >
        {comments.map((comment) => (
          <CommentItem key={comment._id} commentData={comment} />
        ))}
      </InfiniteScroll>
    </CommentListContext.Provider>
  )
}

export default CommentList
