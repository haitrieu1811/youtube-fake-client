'use client'

import { useQuery } from '@tanstack/react-query'
import { Play, Shuffle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useContext, useEffect, useMemo, useState } from 'react'

import videoApis from '@/apis/video.apis'
import PlaylistVideo from '@/components/playlist-video'
import { Button } from '@/components/ui/button'
import PATH from '@/constants/path'
import useIsClient from '@/hooks/useIsClient'
import { AppContext } from '@/providers/app-provider'
import { VideoItemType } from '@/types/video.types'

const LikedClient = () => {
  const { account } = useContext(AppContext)
  const { isClient } = useIsClient()
  const [videos, setVideos] = useState<VideoItemType[]>([])

  // Query: Lấy danh sách video đã thích
  const getLikedVideosQuery = useQuery({
    queryKey: ['getLikedVideos'],
    queryFn: () => videoApis.getLikedVideos()
  })

  // Đặt giá trị cho videos
  useEffect(() => {
    if (!getLikedVideosQuery.data) return
    setVideos(getLikedVideosQuery.data.data.data.videos)
  }, [getLikedVideosQuery.data])

  const totalVideos = useMemo(
    () => getLikedVideosQuery.data?.data.data.pagination.totalRows || 0,
    [getLikedVideosQuery.data?.data.data.pagination.totalRows]
  )
  const latestVideo = useMemo(
    () => getLikedVideosQuery.data?.data.data.videos[0] || null,
    [getLikedVideosQuery.data?.data.data.videos[0]]
  )

  return (
    <div className='flex items-start space-x-6 p-6'>
      <div className='w-[360px] p-6 rounded-2xl space-y-6 sticky top-[80px] bg-muted'>
        {latestVideo && (
          <div className='relative group'>
            <Link
              href={{
                pathname: PATH.WATCH(latestVideo.idName),
                query: { list: 'liked' }
              }}
            >
              <Image
                width={500}
                height={500}
                src={latestVideo.thumbnail}
                alt={latestVideo.title}
                className='w-full h-[180px] rounded-2xl object-cover'
              />
            </Link>
            <div className='absolute inset-0 bg-black/70 rounded-2xl flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-all'>
              <span className='flex items-center space-x-2'>
                <Play size={18} strokeWidth={0} className='fill-white' />
                <span className='text-white uppercase font-medium text-sm'>Phát tất cả</span>
              </span>
            </div>
          </div>
        )}
        <div>
          <h1 className='text-[28px] font-semibold tracking-tight mb-5'>Video đã thích</h1>
          <Link href={PATH.CHANNEL} className='text-sm font-medium'>
            {account && isClient && account.channelName}
          </Link>
          <div className='text-xs text-muted-foreground'>{totalVideos} video</div>
        </div>
        <div className='flex flex-auto items-center space-x-2'>
          {latestVideo && (
            <Button className='rounded-full basis-1/2' asChild>
              <Link
                href={{
                  pathname: PATH.WATCH(latestVideo.idName),
                  query: { list: 'liked' }
                }}
              >
                <Play className='w-4 h-4 mr-2' />
                Phát tất cả
              </Link>
            </Button>
          )}
          <Button variant='outline' className='rounded-full basis-1/2'>
            <Shuffle className='w-4 h-4 mr-2' />
            Trộn bài
          </Button>
        </div>
      </div>
      <div className='flex-1'>
        {videos.map((video, index) => (
          <PlaylistVideo key={video._id} index={index + 1} videoData={video} playlistId='liked' />
        ))}
      </div>
    </div>
  )
}

export default LikedClient