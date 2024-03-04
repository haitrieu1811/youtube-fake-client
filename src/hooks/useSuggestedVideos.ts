'use client'

import videoApis from '@/apis/video.apis'
import { useInfiniteQuery } from '@tanstack/react-query'

type UseSuggestedVideosProps = {
  categoryId?: string
}

const useSuggestedVideos = ({ categoryId }: UseSuggestedVideosProps) => {
  // Query: Get suggested videos
  const getSuggestedVideosQuery = useInfiniteQuery({
    queryKey: ['getSuggestedVideos', categoryId],
    queryFn: () =>
      videoApis.getSuggestedVideos({
        category: categoryId && categoryId !== 'all' ? categoryId : undefined,
        limit: '10'
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.data.data.pagination.page < lastPage.data.data.pagination.totalPages
        ? lastPage.data.data.pagination.page + 1
        : undefined
  })

  return {
    getSuggestedVideosQuery
  }
}

export default useSuggestedVideos
