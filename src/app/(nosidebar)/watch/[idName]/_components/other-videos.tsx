'use client'

import { useQuery } from '@tanstack/react-query'
import { Fragment, useEffect, useState } from 'react'

import videoApis from '@/apis/video.apis'
import WatchOtherVideo from '@/components/watch-other-video'
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
    queryFn: () => videoApis.getPublicVideos()
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

  return (
    <Fragment>
      {videos
        .filter((video) => video.idName !== currentIdName)
        .map((video) => (
          <WatchOtherVideo key={video._id} videoData={video} />
        ))}
    </Fragment>
  )
}

export default OtherVideos
