'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import { Fragment, useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

import videoApis from '@/apis/video.apis'
import HorizontalVideo from '@/components/horizontal-video'
import { VideoItemType } from '@/types/video.types'
import { Loader2 } from 'lucide-react'

const LikedClient = () => {
  const [likedVideos, setLikedVideos] = useState<VideoItemType[]>([])

  const getLikedVideosQuery = useInfiniteQuery({
    queryKey: ['getLikedVideos'],
    queryFn: ({ pageParam }) => videoApis.getLikedVideos({ page: String(pageParam), limit: '10' }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.data.data.pagination.page < lastPage.data.data.pagination.totalPages
        ? lastPage.data.data.pagination.page + 1
        : undefined
  })

  useEffect(() => {
    if (!getLikedVideosQuery.data) return
    const responseVideos = getLikedVideosQuery.data.pages.flatMap((page) => page.data.data.videos)
    setLikedVideos(responseVideos)
  }, [getLikedVideosQuery.data])

  return (
    <Fragment>
      {/* Liked videos */}
      {likedVideos.length > 0 && !getLikedVideosQuery.isLoading && (
        <InfiniteScroll
          dataLength={likedVideos.length}
          hasMore={getLikedVideosQuery.hasNextPage}
          next={getLikedVideosQuery.fetchNextPage}
          loader={
            <div className='flex justify-center items-center py-3'>
              <Loader2 size={40} strokeWidth={1.5} className='animate-spin' />
            </div>
          }
          className='space-y-5'
        >
          {likedVideos.map((video) => (
            <HorizontalVideo
              key={video._id}
              videoData={video}
              classNameThumbnail='flex-shrink-0 w-[250px] h-[140px] object-cover rounded-xl'
            />
          ))}
        </InfiniteScroll>
      )}

      {/* Haven't liked any videos yet */}
      {likedVideos.length === 0 && !getLikedVideosQuery.isLoading && <div>Bạn chưa thích video nào.</div>}
    </Fragment>
  )
}

export default LikedClient
