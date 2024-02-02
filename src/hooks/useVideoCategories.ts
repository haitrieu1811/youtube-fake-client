'use client'

import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import videoApis from '@/apis/video.apis'

const useVideoCategories = () => {
  // Query: Get video categories
  const getVideoCategoriesQuery = useQuery({
    queryKey: ['getVideos'],
    queryFn: () => videoApis.getVideoCategories({ limit: '100' })
  })

  // Video categories
  const videoCategories = useMemo(
    () => getVideoCategoriesQuery.data?.data.data.categories || [],
    [getVideoCategoriesQuery.data?.data.data.categories]
  )

  return {
    videoCategories,
    getVideoCategoriesQuery
  }
}

export default useVideoCategories
