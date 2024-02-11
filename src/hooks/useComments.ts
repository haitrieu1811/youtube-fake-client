'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import commentApis from '@/apis/comment.apis'
import { CommentItemType } from '@/types/comment.types'

type UseCommentsProps = {
  contentId: string
  limit?: number
}

const useComments = ({ contentId, limit = 10 }: UseCommentsProps) => {
  const [commentCount, setCommentCount] = useState<number>(0)
  const [comments, setComments] = useState<CommentItemType[]>([])

  // Query: Get comments
  const getCommentsQuery = useInfiniteQuery({
    queryKey: ['getComments', contentId],
    queryFn: ({ pageParam }) =>
      commentApis.getComments({
        contentId,
        params: {
          page: String(pageParam),
          limit: String(limit)
        }
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.data.data.pagination.page < lastPage.data.data.pagination.totalPages
        ? lastPage.data.data.pagination.page + 1
        : undefined
  })

  // Update comments
  useEffect(() => {
    if (!getCommentsQuery.data) return
    setComments(getCommentsQuery.data.pages.flatMap((page) => page.data.data.comments))
    setCommentCount(getCommentsQuery.data.pages[0].data.data.pagination.totalRowsWithReplies)
  }, [getCommentsQuery.data])

  return {
    getCommentsQuery,
    comments,
    setComments,
    commentCount,
    setCommentCount
  }
}

export default useComments
