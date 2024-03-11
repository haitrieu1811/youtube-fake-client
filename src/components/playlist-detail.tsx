'use client'

import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { CheckCircle2, Play, Shuffle, Trash2 } from 'lucide-react'
import moment from 'moment'
import Image from 'next/image'
import Link from 'next/link'
import { useContext, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'

import playlistApis from '@/apis/playlist.apis'
import VideoActions from '@/components/video-actions'
import PATH from '@/constants/path'
import useIsClient from '@/hooks/useIsClient'
import { convertMomentToVietnamese, formatViews, getRandomInt } from '@/lib/utils'
import { AppContext } from '@/providers/app-provider'
import { WatchContext } from '@/providers/watch-provider'
import { PlaylistVideoItemType } from '@/types/playlist.types'
import { VideoItemType } from '@/types/video.types'
import PlaylistVideoSkeleton from './playlist-video-skeleton'
import { Button } from './ui/button'
import { Skeleton } from './ui/skeleton'

type PlaylistDetailProps = {
  playlistId: string
}

const PlaylistDetail = ({ playlistId }: PlaylistDetailProps) => {
  const queryClient = useQueryClient()
  const { account } = useContext(AppContext)
  const { isClient } = useIsClient()
  const { setIsShuffle } = useContext(WatchContext)

  const [videos, setVideos] = useState<VideoItemType[] | PlaylistVideoItemType[]>([])

  const getVideosFromPlaylistQuery = useInfiniteQuery({
    queryKey: ['getVideosFromPlaylist', playlistId],
    queryFn: ({ pageParam }) =>
      playlistApis.getVideosFromPlaylist({ playlistId, params: { page: String(pageParam), limit: '10' } }),
    enabled: playlistId !== 'LL' && playlistId !== 'WL',
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.data.data.pagination.page < lastPage.data.data.pagination.totalPages
        ? lastPage.data.data.pagination.page + 1
        : undefined
  })

  useEffect(() => {
    if (!getVideosFromPlaylistQuery.data) return
    const responseVideos = getVideosFromPlaylistQuery.data.pages.flatMap((page) => page.data.data.videos)
    return setVideos(responseVideos)
  }, [getVideosFromPlaylistQuery.data])

  const latestVideo = useMemo(() => videos[0], [videos])

  const totalVideos = useMemo(() => {
    if (!getVideosFromPlaylistQuery.data) return 0
    return getVideosFromPlaylistQuery.data.pages[0].data.data.pagination.totalRows
  }, [getVideosFromPlaylistQuery.data])

  const playlistName = useMemo(() => {
    if (!getVideosFromPlaylistQuery.data) return ''
    return getVideosFromPlaylistQuery.data.pages[0].data.data.playlistName
  }, [getVideosFromPlaylistQuery.data])

  const removeVideoFromPlaylistMutation = useMutation({
    mutationKey: ['removeVideoFromPlaylist'],
    mutationFn: playlistApis.removeVideoFromPlaylist,
    onSuccess: () => {
      toast.success(`Đã xóa khỏi ${playlistName || 'danh sách phát'}`)
      queryClient.invalidateQueries({ queryKey: ['getVideosFromPlaylist', playlistId] })
    }
  })

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
        <h1 className='text-[28px] font-semibold tracking-tight mb-5'>{playlistName}</h1>
        {account && isClient && (
          <Link href={PATH.CHANNEL} className='text-sm font-medium'>
            {account.channelName}
          </Link>
        )}
        {!(account && isClient) && <Skeleton className='w-[100px] h-3 rounded-sm mb-1.5' />}
        <div className='text-xs text-muted-foreground'>{totalVideos} video</div>
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
        {/* Videos */}
        {!getVideosFromPlaylistQuery.isFetching &&
          videos.map((video, index) => (
            <div key={video._id} className='flex items-center p-2 hover:bg-muted cursor-pointer rounded-lg'>
              <div className='w-[50px] text-center'>{index + 1}</div>
              <div className='flex flex-1 space-x-2'>
                <Link
                  href={{
                    pathname: PATH.WATCH(video.idName),
                    query: { list: playlistId }
                  }}
                  className='flex-shrink-0'
                >
                  <Image
                    width={160}
                    height={90}
                    src={video.thumbnail}
                    className='w-[160px] h-[90px] rounded-lg object-cover'
                    alt={video.title}
                  />
                </Link>
                <div className='flex-1 space-y-1'>
                  <Link
                    href={{
                      pathname: PATH.WATCH(video.idName),
                      query: { list: playlistId }
                    }}
                    className='font-medium line-clamp-2'
                  >
                    {video.title}
                  </Link>
                  <div className='flex items-center space-x-2 text-xs text-muted-foreground'>
                    <Link href={PATH.PROFILE(video.author.username)} className='flex items-center space-x-1'>
                      <span>{video.author.channelName}</span>
                      {video.author.tick && (
                        <CheckCircle2 strokeWidth={1.5} className='w-4 h-4 fill-muted-foreground stroke-background' />
                      )}
                    </Link>
                    <span className='w-1 h-1 rounded-full bg-muted-foreground' />
                    <div>{formatViews(video.viewCount)} lượt xem</div>
                    <span className='w-1 h-1 rounded-full bg-muted-foreground' />
                    <div>{convertMomentToVietnamese(moment(video.createdAt).fromNow())}</div>
                  </div>
                </div>
              </div>
              <VideoActions
                videoData={video}
                extendedActions={
                  <Button
                    variant='ghost'
                    className='flex w-full pr-10 justify-start rounded-none'
                    onClick={() => removeVideoFromPlaylistMutation.mutate({ playlistId, videoId: video._id })}
                  >
                    <Trash2 size={18} strokeWidth={1.5} className='mr-3' />
                    Xóa khỏi danh sách phát
                  </Button>
                }
              />
            </div>
          ))}

        {/* Skeleton */}
        {getVideosFromPlaylistQuery.isFetching &&
          Array(10)
            .fill(0)
            .map((_, index) => <PlaylistVideoSkeleton key={index} />)}
      </div>
    </div>
  )
}

export default PlaylistDetail
