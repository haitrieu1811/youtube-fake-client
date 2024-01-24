'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { Fragment, useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

import videoApis from '@/apis/video.apis'
import WatchOtherVideo from '@/components/watch-other-video'
import WatchOtherVideoSkeleton from '@/components/watch-other-video-skeleton'
import { VideoItemType } from '@/types/video.types'

type OtherVideos = {
  categoryId: string | null
  currentIdName: string
}

const OtherVideos = ({ categoryId, currentIdName }: OtherVideos) => {
  const [videos, setVideos] = useState<VideoItemType[]>([])

  // Query: Lấy danh sách video khác (cùng danh mục với video đang phát)
  const getVideosSameCategoryQuery = useInfiniteQuery({
    queryKey: ['getVideosSameCategory', categoryId],
    queryFn: () => videoApis.getVideosSameCategory({ categoryId: categoryId as string, params: { limit: '10' } }),
    enabled: !!categoryId,
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.data.data.pagination.page < lastPage.data.data.pagination.totalPages
        ? lastPage.data.data.pagination.page + 1
        : undefined
  })

  // Query: Lấy danh sách video công khai
  const getPublicVideosQuery = useInfiniteQuery({
    queryKey: ['getPublicVideos', categoryId],
    queryFn: () => videoApis.getPublicVideos({ limit: '10' }),
    enabled: categoryId === null,
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.data.data.pagination.page < lastPage.data.data.pagination.totalPages
        ? lastPage.data.data.pagination.page + 1
        : undefined
  })

  // Cập nhật giá trị cho videos
  useEffect(() => {
    if (categoryId) {
      if (!getVideosSameCategoryQuery.data) return
      setVideos(getVideosSameCategoryQuery.data.pages.flatMap((page) => page.data.data.videos))
      return
    }
    if (!getPublicVideosQuery.data) return
    setVideos(getPublicVideosQuery.data.pages.flatMap((page) => page.data.data.videos))
  }, [getVideosSameCategoryQuery.data, getPublicVideosQuery.data])

  // Loading danh sách video
  const isFetching = getVideosSameCategoryQuery.isFetching || getPublicVideosQuery.isFetching

  return (
    <Fragment>
      {!isFetching && (
        <InfiniteScroll
          dataLength={videos.length}
          next={categoryId ? getVideosSameCategoryQuery.fetchNextPage : getPublicVideosQuery.fetchNextPage}
          hasMore={categoryId ? getVideosSameCategoryQuery.hasNextPage : getPublicVideosQuery.hasNextPage}
          scrollThreshold={1}
          loader={
            <div className='flex justify-center py-5'>
              <Loader2 size={40} strokeWidth={1.5} className='animate-spin stroke-muted-foreground' />
            </div>
          }
          className='space-y-5 py-5'
        >
          {videos
            .filter((video) => video.idName !== currentIdName)
            .map((video) => (
              <WatchOtherVideo key={video._id} videoData={video} />
            ))}
        </InfiniteScroll>
      )}

      {isFetching &&
        Array(10)
          .fill(0)
          .map((_, index) => <WatchOtherVideoSkeleton key={index} />)}
    </Fragment>
  )
}

export default OtherVideos
