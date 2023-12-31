'use client'

import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import videoApis from '@/apis/video.apis'
import { VideoItemType } from '@/types/video.types'
import VerticalVideo from './vertical-video'
import VerticalVideoSkeleton from './vertical-video-skeleton'

const HomePage = () => {
  const [videos, setVideos] = useState<VideoItemType[]>([])

  // Query: Lấy danh sách video công khai
  const getPublicVideosQuery = useQuery({
    queryKey: ['getPublicVideos'],
    queryFn: () => videoApis.getPublicVideos()
  })

  useEffect(() => {
    if (!getPublicVideosQuery.data) return
    const resVideos = getPublicVideosQuery.data.data.data.videos
    setVideos(resVideos)
  }, [getPublicVideosQuery.data])

  return (
    <div className='px-10 py-4'>
      {videos.length > 0 && !getPublicVideosQuery.isLoading && (
        <div className='grid grid-cols-12 gap-4'>
          {videos.map((video) => (
            <div key={video._id} className='col-span-12 md:col-span-4 lg:col-span-3'>
              <VerticalVideo videoData={video} />
            </div>
          ))}
        </div>
      )}
      {getPublicVideosQuery.isLoading && (
        <div className='grid grid-cols-12 gap-4'>
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
