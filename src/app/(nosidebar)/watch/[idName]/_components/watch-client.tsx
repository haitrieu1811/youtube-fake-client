'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import { MediaPlayer, MediaProvider } from '@vidstack/react'
import { DefaultVideoLayout, defaultLayoutIcons } from '@vidstack/react/player/layouts/default'
import '@vidstack/react/player/styles/default/layouts/video.css'
import '@vidstack/react/player/styles/default/theme.css'
import uniq from 'lodash/uniq'
import { CheckCircle2, Download, Flag, ListPlus, MoreHorizontal, Share2 } from 'lucide-react'
import moment from 'moment'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Fragment, useContext, useEffect, useMemo, useRef, useState } from 'react'

import videoApis from '@/apis/video.apis'
import watchHistoryApis from '@/apis/watchHistory.apis'
import SubscribeButton from '@/components/subscribe-button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import WatchOtherVideo from '@/components/watch-other-video'
import PATH from '@/constants/path'
import { convertMomentToVietnamese, randomIntegerExcludingArray } from '@/lib/utils'
import { AppContext } from '@/providers/app-provider'
import { WatchContext } from '@/providers/watch-provider'
import { VideoItemType } from '@/types/video.types'
import Comment from './comment'
import Playlist from './playlist'
import Reaction from './reaction'

type WatchClientProps = {
  idName: string
}

const MAX_LENGTH_OF_DESCRIPTION = 50

const WatchClient = ({ idName }: WatchClientProps) => {
  const searchParams = useSearchParams()
  const playlistId = searchParams.get('list')
  const { account } = useContext(AppContext)
  const { isShuffle, isRepeat, playlistVideoIndexHistory, setPlaylistVideoIndexHistory } = useContext(WatchContext)
  const [isShowMoreDescription, setIsShowMoreDescription] = useState<boolean>(false)
  const [subscribeCount, setSubscribeCount] = useState<number>(0)
  const [playlistVideos, setPlaylistVideos] = useState<VideoItemType[]>([])
  const [nextVideoIdName, setNextVideoIdName] = useState<string>('')
  const linkRef = useRef<HTMLAnchorElement>(null)

  // Query: Lấy thông tin chi tiết video
  const watchVideoQuery = useQuery({
    queryKey: ['watchVideo'],
    queryFn: () => videoApis.watchVideo(idName)
  })

  // Thông tin video
  const videoInfo = useMemo(() => watchVideoQuery.data?.data.data.video, [watchVideoQuery.data?.data.data.video])

  // Cập nhật thông tin video
  useEffect(() => {
    if (!videoInfo) return
    setSubscribeCount(videoInfo.channel.subscribeCount)
  }, [videoInfo])

  // Mutation: Thêm vào lịch sử xem
  const createWatchHistoryMutation = useMutation({
    mutationKey: ['createWatchHistory'],
    mutationFn: watchHistoryApis.createWatchHistory
  })

  // Thêm vào lịch sử xem
  useEffect(() => {
    if (!videoInfo) return
    createWatchHistoryMutation.mutate(videoInfo._id)
  }, [videoInfo?._id])

  // Xem thêm mô tả
  const handleShowMoreDescription = () => {
    setIsShowMoreDescription((prevState) => !prevState)
  }

  // Query: Lấy danh sách video đã thích (playlist)
  const getLikedVideosQuery = useQuery({
    queryKey: ['getLikedVideos'],
    queryFn: () => videoApis.getLikedVideos(),
    enabled: playlistId === 'liked'
  })

  // Đặt giá trị cho playlist videos
  useEffect(() => {
    if (playlistId === 'liked') {
      if (!getLikedVideosQuery.data) return
      setPlaylistVideos(getLikedVideosQuery.data.data.data.videos)
    }
    // Thêm index video đã xem vào history để tránh lặp lại video khi phát ngẫu nhiên
    if (playlistId && idName && playlistVideos.length > 0) {
      const foundIndex = playlistVideos.findIndex((video) => video.idName === idName)
      setPlaylistVideoIndexHistory((prevState) => uniq([...prevState, foundIndex]))
    }
  }, [getLikedVideosQuery.data])

  // Tổng số video có trong playlist
  const totalPlaylistVideo = useMemo(() => {
    if (playlistId === 'liked') {
      if (!getLikedVideosQuery.data) return 0
      return getLikedVideosQuery.data.data.data.pagination.totalRows
    }
    return 0
  }, [getLikedVideosQuery.data?.data.data.pagination.totalRows])

  // Index video hiện tại
  const currentPlaylistVideoIndex = useMemo(
    () => playlistVideos.findIndex((video) => video.idName === idName) + 1,
    [playlistVideos]
  )

  // Chuyển đến video tiếp theo khi hết video hiện tại nếu đang có playlist
  const handleNextVideoInPlaylist = () => {
    if (!playlistId) return // Phát video riêng lẻ thì không next video
    let _playlistVideoIndexHistory = playlistVideoIndexHistory
    // Khi phát hết video
    if (playlistVideoIndexHistory.length === totalPlaylistVideo) {
      if (!isRepeat) return
      setPlaylistVideoIndexHistory([])
      _playlistVideoIndexHistory = []
    }
    let nextVideoIndex = isShuffle
      ? randomIntegerExcludingArray(totalPlaylistVideo - 1, _playlistVideoIndexHistory)
      : currentPlaylistVideoIndex
    console.log('>>> nextVideoIndex', nextVideoIndex)
    if (isRepeat && nextVideoIndex === totalPlaylistVideo) {
      nextVideoIndex = 0
    }
    setNextVideoIdName(playlistVideos[nextVideoIndex]?.idName)
  }

  // Tự chuyển video khi kết thúc video hiện tại nếu có playlist
  useEffect(() => {
    if (!nextVideoIdName || !linkRef.current) return
    linkRef.current.click()
  }, [nextVideoIdName])

  return (
    <div className='flex space-x-8'>
      <div className='flex-1'>
        {videoInfo && (
          <Fragment>
            {/* Trình phát video */}
            <MediaPlayer
              autoplay
              src={`http://localhost:4000/static/video-hls/${videoInfo.idName}/master.m3u8`}
              className='z-0'
              onEnded={handleNextVideoInPlaylist}
            >
              <MediaProvider />
              <DefaultVideoLayout thumbnails={videoInfo.thumbnail} icons={defaultLayoutIcons} />
            </MediaPlayer>
            <div className='mt-4'>
              <h1 className='font-bold text-xl tracking-tight'>{videoInfo.title}</h1>
              <div className='flex justify-between items-center mt-4'>
                {/* Thông tin kênh người đăng */}
                <div className='flex items-center space-x-6'>
                  <div className='flex'>
                    <Link href={PATH.PROFILE(videoInfo.channel.username)}>
                      <Avatar>
                        <AvatarImage src={videoInfo.channel.avatar} alt={videoInfo.channel.channelName} />
                        <AvatarFallback>{videoInfo.channel.channelName[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </Link>
                    <div className='flex-1 ml-3'>
                      <div className='flex items-center'>
                        <Link href={PATH.PROFILE(videoInfo.channel.username)} className='font-medium'>
                          {videoInfo.channel.channelName}
                        </Link>
                        {videoInfo.channel.tick && (
                          <CheckCircle2 className='fill-zinc-800 dark:fill-zinc-500 stroke-background w-[15px] h-[15px] ml-2' />
                        )}
                      </div>
                      <div className='text-xs text-muted-foreground'>{subscribeCount} người đăng ký</div>
                    </div>
                  </div>
                  <SubscribeButton
                    isSubscribedBefore={videoInfo.channel.isSubscribed}
                    channelId={videoInfo.channel._id}
                    channelName={videoInfo.channel.channelName}
                    onSubscribeSuccess={() => setSubscribeCount((prevState) => (prevState += 1))}
                    onUnsubscribeSuccess={() => setSubscribeCount((prevState) => (prevState -= 1))}
                  />
                </div>
                {/* Like, dislike, chia sẻ */}
                <div className='flex items-center space-x-4'>
                  <Reaction videoInfo={videoInfo} />
                  <Button
                    variant='secondary'
                    className='rounded-full space-x-3 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  >
                    <Share2 size={18} strokeWidth={1.5} />
                    <span>Chia sẻ</span>
                  </Button>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        size='icon'
                        variant='secondary'
                        className='rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700'
                      >
                        <MoreHorizontal size={20} strokeWidth={1.5} />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align='start' className='px-0 py-2 rounded-xl w-48 overflow-hidden'>
                      <Button variant='ghost' className='space-x-3 w-full rounded-none justify-start h-10 font-normal'>
                        <Download size={16} strokeWidth={1.5} />
                        <span>Tải xuống</span>
                      </Button>
                      <Button variant='ghost' className='space-x-3 w-full rounded-none justify-start h-10 font-normal'>
                        <ListPlus size={16} strokeWidth={1.5} />
                        <span>Lưu</span>
                      </Button>
                      <Button variant='ghost' className='space-x-3 w-full rounded-none justify-start h-10 font-normal'>
                        <Flag size={16} strokeWidth={1.5} />
                        <span>Báo vi phạm</span>
                      </Button>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
            <Separator className='my-3' />
            <div className='rounded-lg bg-muted/50 hover:bg-muted p-3 space-y-1 cursor-pointer'>
              {/* Lượt xem, ngày đăng */}
              <div className='flex items-center space-x-2 font-medium text-sm'>
                <span>{videoInfo.viewCount} lượt xem</span>
                <span>
                  {!isShowMoreDescription
                    ? convertMomentToVietnamese(moment(videoInfo.createdAt).fromNow())
                    : `${moment(videoInfo.createdAt).date()} thg ${moment(videoInfo.createdAt).month() + 1}, ${moment(
                        videoInfo.createdAt
                      ).year()}`}
                </span>
              </div>
              {/* Mô tả */}
              <div className='text-sm text-muted-foreground'>
                {videoInfo.description.split(' ').length <= MAX_LENGTH_OF_DESCRIPTION
                  ? videoInfo.description
                  : isShowMoreDescription
                  ? videoInfo.description
                  : `${videoInfo.description.split(' ').slice(0, MAX_LENGTH_OF_DESCRIPTION).join(' ')}...`}
              </div>
              {videoInfo.description.length > MAX_LENGTH_OF_DESCRIPTION && (
                <div className='text-sm font-medium' onClick={handleShowMoreDescription}>
                  {!isShowMoreDescription ? 'Xem thêm' : 'Ẩn bớt'}
                </div>
              )}
            </div>
            {/* Bình luận */}
            <div className='my-6'>
              <Comment accountData={account} videoId={videoInfo._id} />
            </div>
          </Fragment>
        )}
      </div>
      <div className='w-1/3'>
        {/* Playlist */}
        {!!playlistId && (
          <div className='mb-6'>
            <Playlist
              playlistId={playlistId}
              currentIdName={idName}
              currentVideoIndex={currentPlaylistVideoIndex}
              videos={playlistVideos}
              totalVideo={totalPlaylistVideo}
            />
            {/* Chuyển đến video tiếp theo thông qua Link */}
            <Link
              ref={linkRef}
              href={{
                pathname: PATH.WATCH(nextVideoIdName),
                query: { list: playlistId }
              }}
            />
          </div>
        )}
        <div className='space-y-2'>
          {playlistVideos.map((video) => (
            <WatchOtherVideo key={video._id} videoData={video} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default WatchClient
