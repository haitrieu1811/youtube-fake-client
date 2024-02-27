'use client'

import { useEffect, useState } from 'react'

import useSuggestedVideos from '@/hooks/useSuggestedVideos'
import { VideoItemType } from '@/types/video.types'
import VerticalVideo from './vertical-video'
import VerticalVideoSkeleton from './vertical-video-skeleton'

const HomePage = () => {
  const [videos, setVideos] = useState<VideoItemType[]>([])
  const { getSuggestedVideosQuery } = useSuggestedVideos({})

  // Đặt giá trị cho videos
  useEffect(() => {
    if (!getSuggestedVideosQuery.data) return
    setVideos(getSuggestedVideosQuery.data.pages.flatMap((page) => page.data.data.videos))
  }, [getSuggestedVideosQuery.data])

  return (
    <div className='px-10 py-4'>
      {videos.length > 0 && !getSuggestedVideosQuery.isLoading && (
        <div className='grid grid-cols-12 gap-5'>
          {videos.map((video) => (
            <div key={video._id} className='col-span-12 md:col-span-4 lg:col-span-3'>
              <VerticalVideo videoData={video} />
            </div>
          ))}
        </div>
      )}
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
