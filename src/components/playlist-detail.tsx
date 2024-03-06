'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import { Play, Shuffle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useContext, useEffect, useMemo, useState } from 'react'

import bookmarkApis from '@/apis/bookmark.apis'
import playlistApis from '@/apis/playlist.apis'
import videoApis from '@/apis/video.apis'
import PATH from '@/constants/path'
import useIsClient from '@/hooks/useIsClient'
import { getRandomInt } from '@/lib/utils'
import { AppContext } from '@/providers/app-provider'
import { WatchContext } from '@/providers/watch-provider'
import { PlaylistVideoItemType } from '@/types/playlist.types'
import { VideoItemType } from '@/types/video.types'
import PlaylistVideo from './playlist-video'
import PlaylistVideoSkeleton from './playlist-video-skeleton'
import { Button } from './ui/button'
import { Skeleton } from './ui/skeleton'

type PlaylistDetailProps = {
  playlistId: string
}

const PlaylistDetail = ({ playlistId }: PlaylistDetailProps) => {
  const { account } = useContext(AppContext)
  const { isClient } = useIsClient()
  const { setIsShuffle } = useContext(WatchContext)

  const [videos, setVideos] = useState<VideoItemType[] | PlaylistVideoItemType[]>([])

  const getLikedVideosQuery = useInfiniteQuery({
    queryKey: ['getLikedVideos'],
    queryFn: ({ pageParam }) => videoApis.getLikedVideos({ page: String(pageParam), limit: '10' }),
    enabled: playlistId === 'LL',
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.data.data.pagination.page < lastPage.data.data.pagination.totalPages
        ? lastPage.data.data.pagination.page + 1
        : undefined
  })

  const getBookmarkVideosQuery = useInfiniteQuery({
    queryKey: ['getBookmarkVideos'],
    queryFn: ({ pageParam }) => bookmarkApis.getBookmarkVideos({ page: String(pageParam), limit: '10' }),
    enabled: playlistId === 'WL',
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.data.data.pagination.page < lastPage.data.data.pagination.totalPages
        ? lastPage.data.data.pagination.page + 1
        : undefined
  })

  const getVideosFromPlaylistQuery = useInfiniteQuery({
    queryKey: ['getVideosFromPlaylist'],
    queryFn: ({ pageParam }) =>
      playlistApis.getVideosFromPlaylist({ playlistId, params: { page: String(pageParam), limit: '10' } }),
    enabled: playlistId !== 'LL' && playlistId !== 'WL',
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.data.data.pagination.page < lastPage.data.data.pagination.totalPages
        ? lastPage.data.data.pagination.page + 1
        : undefined
  })

  // Set videos
  useEffect(() => {
    switch (playlistId) {
      case 'LL':
        if (!getLikedVideosQuery.data) return
        return setVideos(getLikedVideosQuery.data.pages.map((page) => page.data.data.videos).flat())
      case 'WL':
        if (!getBookmarkVideosQuery.data) return
        return setVideos(getBookmarkVideosQuery.data.pages.map((page) => page.data.data.videos).flat())
      default:
        if (!getVideosFromPlaylistQuery.data) return
        return setVideos(getVideosFromPlaylistQuery.data.pages.map((page) => page.data.data.videos).flat())
    }
  }, [getLikedVideosQuery.data, getBookmarkVideosQuery.data, getVideosFromPlaylistQuery.data])

  const latestVideo = useMemo(() => videos[0], [videos])
  const totalVideos = useMemo(() => {
    switch (playlistId) {
      case 'LL':
        if (!getLikedVideosQuery.data) return 0
        return getLikedVideosQuery.data.pages[0].data.data.pagination.totalRows
      case 'WL':
        if (!getBookmarkVideosQuery.data) return 0
        return getBookmarkVideosQuery.data.pages[0].data.data.pagination.totalRows
      default:
        if (!getVideosFromPlaylistQuery.data) return 0
        return getVideosFromPlaylistQuery.data.pages[0].data.data.pagination.totalRows
    }
  }, [getLikedVideosQuery.data, getBookmarkVideosQuery.data, getVideosFromPlaylistQuery.data])
  const playlistName = useMemo(() => {
    switch (playlistId) {
      case 'LL':
        return 'Video đã thích'
      case 'WL':
        return 'Xem sau'
      default:
        if (!getVideosFromPlaylistQuery.data) return ''
        return getVideosFromPlaylistQuery.data.pages[0].data.data.playlistName
    }
  }, [getLikedVideosQuery.data, getBookmarkVideosQuery.data, getVideosFromPlaylistQuery.data])

  return (
    <div className='flex items-start space-x-6 p-6'>
      <div className='w-[360px] p-6 rounded-2xl space-y-6 sticky top-[80px] bg-muted'>
        {/* Show latest video */}
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
        {!latestVideo && <Skeleton className='h-[180px] rounded-2xl' />}
        <div>
          <h1 className='text-[28px] font-semibold tracking-tight mb-5'>{playlistName}</h1>
          {account && isClient && (
            <Link href={PATH.CHANNEL} className='text-sm font-medium'>
              {account.channelName}
            </Link>
          )}
          {!(account && isClient) && <Skeleton className='w-[100px] h-3 rounded-sm mb-1.5' />}
          <div className='text-xs text-muted-foreground'>{totalVideos} video</div>
        </div>
        <div className='flex flex-auto items-center space-x-2'>
          {latestVideo && (
            <Button className='rounded-full basis-1/2' asChild>
              <Link
                onClick={() => setIsShuffle(false)}
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
          {!latestVideo && <Skeleton className='basis-1/2 h-9 rounded-full' />}
          {videos.length > 0 && (
            <Button variant='outline' className='rounded-full basis-1/2' asChild>
              <Link
                onClick={() => setIsShuffle(true)}
                href={{
                  // getRandomInt lấy ngẫu nhiên một index để lấy ra video trong videos mà vẫn đảm bảo index đó nằm trong vùng hợp lệ (0 <= n <= videos.length - 1)
                  pathname: PATH.WATCH(videos[getRandomInt(totalVideos - 1)]?.idName),
                  query: { list: 'liked' }
                }}
              >
                <Shuffle className='w-4 h-4 mr-2' />
                Trộn bài
              </Link>
            </Button>
          )}
          {videos.length === 0 && <Skeleton className='basis-1/2 h-9 rounded-full' />}
        </div>
      </div>
      <div className='flex-1'>
        {/* Danh sách video */}
        {!getLikedVideosQuery.isFetching &&
          videos.map((video, index) => (
            <PlaylistVideo key={video._id} index={index + 1} videoData={video} playlistId='liked' />
          ))}
        {/* Skeleton */}
        {getLikedVideosQuery.isFetching &&
          Array(10)
            .fill(0)
            .map((_, index) => <PlaylistVideoSkeleton key={index} />)}
      </div>
    </div>
  )
}

export default PlaylistDetail
