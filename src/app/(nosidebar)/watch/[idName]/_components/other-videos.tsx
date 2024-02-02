'use client'

import { Loader2 } from 'lucide-react'
import { Fragment, useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

import WatchOtherVideo from '@/components/watch-other-video'
import WatchOtherVideoSkeleton from '@/components/watch-other-video-skeleton'
import useSuggestedVideos from '@/hooks/useSuggestedVideos'
import { VideoItemType } from '@/types/video.types'

type OtherVideos = {
  categoryId: string | null
  currentIdName: string
}

const OtherVideos = ({ categoryId, currentIdName }: OtherVideos) => {
  const [videos, setVideos] = useState<VideoItemType[]>([])
  const { getSuggestedVideosQuery } = useSuggestedVideos({ categoryId: categoryId || undefined })

  // Set videos
  useEffect(() => {
    if (!getSuggestedVideosQuery.data) return
    setVideos(getSuggestedVideosQuery.data.pages.flatMap((page) => page.data.data.videos))
  }, [getSuggestedVideosQuery.data])

  return (
    <Fragment>
      {/* Videos */}
      {!getSuggestedVideosQuery.isFetching && (
        <InfiniteScroll
          dataLength={videos.length}
          next={getSuggestedVideosQuery.fetchNextPage}
          hasMore={getSuggestedVideosQuery.hasNextPage}
          scrollThreshold={1}
          loader={
            <div className='flex justify-center py-5'>
              <Loader2 size={40} strokeWidth={1.5} className='animate-spin stroke-muted-foreground' />
            </div>
          }
          className='space-y-2'
        >
          {videos
            .filter((video) => video.idName !== currentIdName)
            .map((video) => (
              <WatchOtherVideo key={video._id} videoData={video} />
            ))}
        </InfiniteScroll>
      )}
      {/* Videos skeleton */}
      {getSuggestedVideosQuery.isFetching &&
        Array(10)
          .fill(0)
          .map((_, index) => <WatchOtherVideoSkeleton key={index} />)}
    </Fragment>
  )
}

export default OtherVideos
