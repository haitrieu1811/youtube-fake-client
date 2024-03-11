'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { Fragment, useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

import bookmarkApis from '@/apis/bookmark.apis'
import HorizontalVideo from '@/components/horizontal-video'
import { PlaylistVideoItemType } from '@/types/playlist.types'

const WatchLaterClient = () => {
  const [bookmarkVideos, setBookmarkVideos] = useState<PlaylistVideoItemType[]>([])

  const getBookmarkVideosQuery = useInfiniteQuery({
    queryKey: ['getBookmarkVideos'],
    queryFn: ({ pageParam }) => bookmarkApis.getBookmarkVideos({ page: String(pageParam), limit: '10' }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.data.data.pagination.page < lastPage.data.data.pagination.totalPages
        ? lastPage.data.data.pagination.page + 1
        : undefined
  })

  useEffect(() => {
    if (!getBookmarkVideosQuery.data) return
    const responseVideos = getBookmarkVideosQuery.data.pages.flatMap((page) => page.data.data.videos)
    setBookmarkVideos(responseVideos)
  }, [getBookmarkVideosQuery.data])

  return (
    <Fragment>
      {/* Liked videos */}
      {bookmarkVideos.length > 0 && !getBookmarkVideosQuery.isLoading && (
        <InfiniteScroll
          dataLength={bookmarkVideos.length}
          hasMore={getBookmarkVideosQuery.hasNextPage}
          next={getBookmarkVideosQuery.fetchNextPage}
          loader={
            <div className='flex justify-center items-center py-3'>
              <Loader2 size={40} strokeWidth={1.5} className='animate-spin' />
            </div>
          }
          className='space-y-5'
        >
          {bookmarkVideos.map((video) => (
            <HorizontalVideo
              key={video._id}
              videoData={video as any}
              classNameThumbnail='flex-shrink-0 w-[250px] h-[140px] object-cover rounded-xl'
            />
          ))}
        </InfiniteScroll>
      )}

      {/* Haven't liked any videos yet */}
      {bookmarkVideos.length === 0 && !getBookmarkVideosQuery.isLoading && <div>Chưa có video xem sau nào.</div>}
    </Fragment>
  )
}

export default WatchLaterClient
