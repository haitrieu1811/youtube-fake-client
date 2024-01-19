'use client'

import classNames from 'classnames'
import { CheckCircle2, ChevronDown, Lock, Play, Repeat, Shuffle, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useContext, useRef } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import VideoActions from '@/components/video-actions'
import PATH from '@/constants/path'
import useIsClient from '@/hooks/useIsClient'
import { AppContext } from '@/providers/app-provider'
import { WatchContext } from '@/providers/watch-provider'
import { VideoItemType } from '@/types/video.types'

type PlaylistProps = {
  playlistId: string
  currentIdName: string
  currentVideoIndex: number
  videos: VideoItemType[]
  totalVideo: number
}

const Playlist = ({ playlistId, videos, totalVideo, currentIdName, currentVideoIndex }: PlaylistProps) => {
  const { account } = useContext(AppContext)
  const { isOpenPlaylist, setIsOpenPlaylist, isRepeat, setIsRepeat, isShuffle, setIsShuffle } = useContext(WatchContext)
  const { isClient } = useIsClient()
  const listVideosRef = useRef<HTMLDivElement>(null)

  // Ẩn hiện playlist
  const handleToggle = () => {
    setIsOpenPlaylist((prevState) => !prevState)
  }

  return (
    <TooltipProvider>
      {!isOpenPlaylist && (
        <div className='rounded-xl p-4 flex items-start space-x-4 bg-muted'>
          <div className='flex-1 space-y-1'>
            <span className='font-semibold text-sm'>
              {videos[currentVideoIndex]?.title ? 'Tiếp theo: ' : 'Hết danh sách phát'}
            </span>
            {videos[currentVideoIndex] && (
              <span className='text-muted-foreground line-clamp-1 text-sm'>{videos[currentVideoIndex].title}</span>
            )}
            <div className='flex items-center space-x-2 text-muted-foreground text-xs'>
              <Link href={PATH.LIKED}>Video đã thích</Link>
              <span className='w-1 h-px bg-muted-foreground' />
              <span>
                {currentVideoIndex}/{totalVideo}
              </span>
            </div>
          </div>
          <Button variant='ghost' size='icon' className='rounded-full' onClick={handleToggle}>
            <ChevronDown strokeWidth={1.5} />
          </Button>
        </div>
      )}
      {isOpenPlaylist && (
        <div ref={listVideosRef} className='border border-border rounded-xl'>
          <div className='flex justify-between items-start p-4'>
            <div className='space-y-2'>
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
                  {currentVideoIndex}/{totalVideo}
                </div>
              </div>
              <div className='flex -ml-2'>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='w-10 h-10 rounded-full'
                      onClick={() => setIsRepeat((prevState) => !prevState)}
                    >
                      <Repeat
                        size={18}
                        strokeWidth={isRepeat ? 2 : 1.5}
                        className={classNames({
                          'stroke-muted-foreground': !isRepeat
                        })}
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Danh sách phát lặp</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='w-10 h-10 rounded-full'
                      onClick={() => setIsShuffle((prevState) => !prevState)}
                    >
                      <Shuffle
                        size={18}
                        strokeWidth={isShuffle ? 2 : 1.5}
                        className={classNames({
                          'stroke-muted-foreground': !isShuffle
                        })}
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Danh sách phát ngẫu nhiên</TooltipContent>
                </Tooltip>
              </div>
            </div>
            <Button variant='ghost' size='icon' className='rounded-full' onClick={handleToggle}>
              <X strokeWidth={1.5} />
            </Button>
          </div>
          {/* Danh sách video */}
          <div className='max-h-[400px] overflow-y-auto'>
            {videos.map((video, index) => {
              const isActive = video.idName === currentIdName
              return (
                <div
                  key={video._id}
                  className={classNames({
                    'flex items-center space-x-2 px-3 py-1.5 group': true,
                    'hover:bg-muted': !isActive,
                    'bg-muted': isActive
                  })}
                >
                  <div className='text-xs text-muted-foreground w-4'>
                    {isActive ? <Play size={14} strokeWidth={0} className='fill-muted-foreground' /> : index + 1}
                  </div>
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
                      <div className='flex items-center space-x-1'>
                        <Link href={PATH.PROFILE(video.author.username)} className='text-xs text-muted-foreground'>
                          {video.author.channelName}
                        </Link>
                        {video.author.tick && (
                          <CheckCircle2
                            size={12}
                            strokeWidth={1.5}
                            className='fill-muted-foreground stroke-background'
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className='opacity-0 group-hover:opacity-100'>
                    <VideoActions />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </TooltipProvider>
  )
}

export default Playlist
