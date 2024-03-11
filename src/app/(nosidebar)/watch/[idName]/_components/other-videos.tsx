'use client'

import { CheckCircle2, Loader2 } from 'lucide-react'
import moment from 'moment'
import Image from 'next/image'
import Link from 'next/link'
import { Fragment, useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

import { Skeleton } from '@/components/ui/skeleton'
import VideoActions from '@/components/video-actions'
import PATH from '@/constants/path'
import useSuggestedVideos from '@/hooks/useSuggestedVideos'
import { convertMomentToVietnamese, formatViews } from '@/lib/utils'
import { VideoItemType } from '@/types/video.types'

type OtherVideos = {
  categoryId: string
  currentIdName: string
}

const OtherVideos = ({ categoryId, currentIdName }: OtherVideos) => {
  const [videos, setVideos] = useState<VideoItemType[]>([])
  const { getSuggestedVideosQuery } = useSuggestedVideos({ categoryId })

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
              <div key={video._id} className='flex space-x-2 group'>
                <Link href={PATH.WATCH(video.idName)} className='flex-shrink-0'>
                  <Image
                    width={170}
                    height={100}
                    src={video.thumbnail}
                    alt={video.title}
                    className='w-[170px] h-[100px] rounded-lg object-cover'
                  />
                </Link>
                <div className='flex-1 space-y-1'>
                  <Link href={PATH.WATCH(video.idName)} className='text-sm font-medium line-clamp-2'>
                    {video.title}
                  </Link>
                  <div className='flex items-center space-x-1.5'>
                    <Link href={PATH.PROFILE(video.author.username)} className='text-muted-foreground text-xs'>
                      {video.author.channelName}
                    </Link>
                    <CheckCircle2 size={14} strokeWidth={1.5} className='stroke-background fill-muted-foreground' />
                  </div>
                  <div className='text-muted-foreground text-xs space-x-2 flex items-center'>
                    <span>{formatViews(video.viewCount)} lượt xem</span>
                    <span className='w-0.5 h-0.5 rounded-full bg-muted-foreground' />
                    <span>{convertMomentToVietnamese(moment(video.createdAt).fromNow())}</span>
                  </div>
                </div>
                <div className='opacity-0 group-hover:opacity-100'>
                  <VideoActions videoData={video} />
                </div>
              </div>
            ))}
        </InfiniteScroll>
      )}
      {/* Videos skeleton */}
      {getSuggestedVideosQuery.isFetching &&
        Array(10)
          .fill(0)
          .map((_, index) => (
            <div key={index} className='flex space-x-2'>
              <Skeleton className='w-[170px] h-[100px] rounded-lg' />
              <div className='flex-1 space-y-2'>
                <Skeleton className='w-[160px] h-4' />
                <Skeleton className='w-[140px] h-3' />
                <div className='flex items-center space-x-2'>
                  {Array(2)
                    .fill(0)
                    .map((_, index) => (
                      <Skeleton key={index} className='w-[40px] h-3' />
                    ))}
                </div>
              </div>
            </div>
          ))}
    </Fragment>
  )
}

export default OtherVideos
