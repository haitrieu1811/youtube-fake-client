'use client'

import { useQuery } from '@tanstack/react-query'
import { ChevronDown, Lock, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Fragment, useContext, useEffect, useMemo, useState } from 'react'

import videoApis from '@/apis/video.apis'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import VideoActions from '@/components/video-actions'
import PATH from '@/constants/path'
import useIsClient from '@/hooks/useIsClient'
import { AppContext } from '@/providers/app-provider'
import { VideoItemType } from '@/types/video.types'
import classNames from 'classnames'

type PlaylistProps = {
  playlistId: string
  currentIdName: string
}

const Playlist = ({ playlistId, currentIdName }: PlaylistProps) => {
  const { account } = useContext(AppContext)
  const { isClient } = useIsClient()
  const [isShow, setIsShow] = useState<boolean>(true)
  const [videos, setVideos] = useState<VideoItemType[]>([])

  // Query: Lấy danh sách video đã thích
  const getLikedVideosQuery = useQuery({
    queryKey: ['getLikedVideos'],
    queryFn: () => videoApis.getLikedVideos(),
    enabled: playlistId === 'liked'
  })

  // Đặt giá trị cho video
  useEffect(() => {
    if (playlistId === 'liked') {
      if (!getLikedVideosQuery.data) return
      setVideos(getLikedVideosQuery.data.data.data.videos)
    }
  }, [getLikedVideosQuery.data])

  // Tổng số video
  const totalVideo = useMemo(() => {
    if (playlistId === 'liked') {
      if (!getLikedVideosQuery.data) return
      return getLikedVideosQuery.data.data.data.pagination.totalRows
    }
  }, [getLikedVideosQuery.data?.data.data.pagination.totalRows])

  // Index video hiện tại
  const currentIndex = useMemo(() => videos.findIndex((video) => video.idName === currentIdName) + 1, [videos])

  // Ẩn hiện playlist
  const handleToggle = () => {
    setIsShow((prevState) => !prevState)
  }

  return (
    <Fragment>
      {!isShow && (
        <div className='rounded-xl p-4 flex items-center space-x-4 bg-muted'>
          <div className='flex-1 space-y-1'>
            <span className='font-semibold text-sm'>
              {videos[currentIndex]?.title ? 'Tiếp theo: ' : 'Hết danh sách phát'}
            </span>
            {videos[currentIndex] && (
              <span className='text-muted-foreground line-clamp-1 text-sm'>{videos[currentIndex].title}</span>
            )}
            <div className='flex items-center space-x-2 text-muted-foreground text-xs'>
              <Link href='/'>Video đã thích</Link>
              <span className='w-1 h-px bg-muted-foreground' />
              <span>
                {currentIndex}/{totalVideo}
              </span>
            </div>
          </div>
          <Button variant='ghost' size='icon' className='rounded-full' onClick={handleToggle}>
            <ChevronDown strokeWidth={1.5} />
          </Button>
        </div>
      )}
      {isShow && (
        <div className='border border-border rounded-xl'>
          <div className='flex justify-between items-center p-4'>
            <div className='space-y-3'>
              <h2 className='text-xl font-semibold'>Video đã thích</h2>
              <div className='space-x-2 flex items-center'>
                <Badge className='space-x-2 rounded-sm bg-muted-foreground hover:bg-muted-foreground'>
                  <Lock size={16} strokeWidth={1.5} />
                  <span>Riêng tư</span>
                </Badge>
                {account && isClient && (
                  <Link href={PATH.CHANNEL} className='text-xs'>
                    {account.channelName}
                  </Link>
                )}
                <div className='text-xs text-muted-foreground'>
                  {currentIndex}/{totalVideo}
                </div>
              </div>
            </div>
            <Button variant='ghost' size='icon' className='rounded-full' onClick={handleToggle}>
              <X strokeWidth={1.5} />
            </Button>
          </div>
          {/* Danh sách video */}
          <div className='max-h-[400px] overflow-y-auto'>
            {videos.map((video, index) => (
              <div
                key={video._id}
                className={classNames({
                  'flex items-center space-x-2 p-3 group': true,
                  'hover:bg-muted': video.idName !== currentIdName,
                  'bg-muted': video.idName === currentIdName
                })}
              >
                <div className='text-xs text-muted-foreground'>{index + 1}</div>
                <div className='flex-1 flex items-center space-x-2'>
                  <Link
                    href={{
                      pathname: PATH.WATCH(video.idName),
                      query: { list: playlistId }
                    }}
                    className='flex-shrink-0'
                  >
                    <Image
                      width={100}
                      height={100}
                      src={video.thumbnail}
                      alt={video.title}
                      className='rounded-lg w-[100px] h-14 object-cover'
                    />
                  </Link>
                  <div className='flex-1 leading-tight'>
                    <Link
                      href={{
                        pathname: PATH.WATCH(video.idName),
                        query: { list: playlistId }
                      }}
                      className='block font-medium'
                    >
                      <span className='line-clamp-2'>{video.title}</span>
                    </Link>
                    <Link href={PATH.PROFILE(video.author.username)} className='text-xs text-muted-foreground'>
                      {video.author.channelName}
                    </Link>
                  </div>
                </div>
                <div className='opacity-0 group-hover:opacity-100'>
                  <VideoActions />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Fragment>
  )
}

export default Playlist
