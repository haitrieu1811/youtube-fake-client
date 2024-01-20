'use client'

import { useQuery } from '@tanstack/react-query'
import { Fragment, useEffect, useState } from 'react'

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
  const getVideosSameCategoryQuery = useQuery({
    queryKey: ['getVideosSameCategory'],
    queryFn: () => videoApis.getVideosSameCategory({ categoryId: categoryId as string }),
    enabled: !!categoryId
  })

  // Query: Lấy danh sách video công khai
  const getPublicVideosQuery = useQuery({
    queryKey: ['getPublicVideos'],
    queryFn: () => videoApis.getPublicVideos(),
    enabled: categoryId === null
  })

  // Cập nhật giá trị cho videos
  useEffect(() => {
    if (categoryId) {
      if (!getVideosSameCategoryQuery.data) return
      setVideos(getVideosSameCategoryQuery.data.data.data.videos)
      return
    }
    if (!getPublicVideosQuery.data) return
    setVideos(getPublicVideosQuery.data.data.data.videos)
  }, [getVideosSameCategoryQuery.data, getPublicVideosQuery.data])

  const isFetching = getVideosSameCategoryQuery.isFetching || getPublicVideosQuery.isFetching

  return (
    <Fragment>
      {!isFetching &&
        videos
          .filter((video) => video.idName !== currentIdName)
          .map((video) => <WatchOtherVideo key={video._id} videoData={video} />)}

      {isFetching &&
        Array(10)
          .fill(0)
          .map((_, index) => <WatchOtherVideoSkeleton key={index} />)}
    </Fragment>
  )
}

export default OtherVideos
