'use client'

import { Dispatch, SetStateAction, createContext } from 'react'

import { CommentItemType } from '@/types/comment.types'
import CommentItem from './comment-item'

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
}

const CommentList = ({ comments, setComments, setCommentCount }: CommentListProps) => {
  return (
    <CommentListContext.Provider
      value={{
        comments,
        setComments,
        setCommentCount
      }}
    >
      <div className='space-y-5'>
        {comments.map((comment) => (
          <CommentItem key={comment._id} commentData={comment} />
        ))}
      </div>
    </CommentListContext.Provider>
  )
}

export default CommentList
