'use client'

import { useEffect, useState } from 'react'

import useSuggestedVideos from '@/hooks/useSuggestedVideos'
import useVideoCategories from '@/hooks/useVideoCategories'
import { VideoItemType } from '@/types/video.types'
import VerticalVideo from './vertical-video'
import VerticalVideoSkeleton from './vertical-video-skeleton'
import VideoCategoriesSlider from './video-categories-slider'

const HomePage = () => {
  const [videos, setVideos] = useState<VideoItemType[]>([])
  const [currentVideoCategoryId, setCurrentVideoCategoryId] = useState<string>('')
  const { getSuggestedVideosQuery } = useSuggestedVideos({ categoryId: currentVideoCategoryId })
  const { videoCategories, getVideoCategoriesQuery } = useVideoCategories()

  // Set videos
  useEffect(() => {
    if (!getSuggestedVideosQuery.data) return
    setVideos(getSuggestedVideosQuery.data.pages.flatMap((page) => page.data.data.videos))
  }, [getSuggestedVideosQuery.data])

  return (
    <div className='pl-8 pr-10 pb-4 relative'>
      {getSuggestedVideosQuery.isFetching && <div className='absolute inset-0 z-[1] bg-background/50' />}
      {/* Video categories slider */}
      {!getVideoCategoriesQuery.isLoading && (
        <div className='sticky top-14 z-[1] py-4 bg-background'>
          <VideoCategoriesSlider
            videoCategories={[{ value: 'all', label: 'Tất cả' }].concat(
              videoCategories.map((videoCategory) => ({
                value: videoCategory._id,
                label: videoCategory.name
              }))
            )}
            onChange={(videoCategoryId) => setCurrentVideoCategoryId(videoCategoryId)}
          />
        </div>
      )}
      {/* Suggested videos */}
      {videos.length > 0 && !getSuggestedVideosQuery.isLoading && (
        <div className='grid grid-cols-12 gap-5'>
          {videos.map((video) => (
            <div key={video._id} className='col-span-12 md:col-span-4 lg:col-span-3'>
              <VerticalVideo videoData={video} />
            </div>
          ))}
        </div>
      )}
      {/* Videos skeleton */}
      {getSuggestedVideosQuery.isLoading && (
        <div className='grid grid-cols-12 gap-5'>
          {Array(12)
            .fill(0)
            .map((_, index) => (
              <div key={index} className='col-span-12 md:col-span-4 lg:col-span-3'>
                <VerticalVideoSkeleton />
              </div>
            ))}
        </div>
      )}
    </div>
  )
}

export default HomePage
