'use client'

import { useQuery } from '@tanstack/react-query'
import { MediaPlayer, MediaProvider } from '@vidstack/react'
import { DefaultVideoLayout, defaultLayoutIcons } from '@vidstack/react/player/layouts/default'
import '@vidstack/react/player/styles/default/layouts/video.css'
import '@vidstack/react/player/styles/default/theme.css'
import classNames from 'classnames'
import {
  BarChart,
  Bell,
  CheckCircle2,
  Download,
  Flag,
  ListPlus,
  MoreHorizontal,
  Share2,
  ThumbsDown,
  ThumbsUp
} from 'lucide-react'
import moment from 'moment'
import Link from 'next/link'
import { Fragment, useContext, useMemo, useState } from 'react'

import videoApis from '@/apis/video.apis'
import CommentInput from '@/components/comment-input'
import CommentItem from '@/components/comment-item'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { convertMomentToVietnamese } from '@/lib/utils'
import { AppContext } from '@/providers/app-provider'

type WatchClientProps = {
  idName: string
}

const MAX_LENGTH_OF_DESCRIPTION = 260

const WatchClient = ({ idName }: WatchClientProps) => {
  const { account } = useContext(AppContext)
  const [isShowMoreDescription, setIsShowMoreDescription] = useState<boolean>(false)

  // Query: Lấy thông tin chi tiết video
  const watchVideoQuery = useQuery({
    queryKey: ['watchVideo'],
    queryFn: () => videoApis.watchVideo(idName)
  })

  // Thông tin video
  const videoInfo = useMemo(() => watchVideoQuery.data?.data.data.video, [watchVideoQuery.data?.data.data.video])

  // Xem thêm mô tả
  const handleShowMoreDescription = () => {
    setIsShowMoreDescription((prevState) => !prevState)
  }

  return (
    <div>
      <div className='flex justify-between'>
        <div className='w-2/3'>
          {videoInfo && (
            <Fragment>
              <MediaPlayer
                autoplay
                src={`http://localhost:4000/static/video-hls/${videoInfo.idName}/master.m3u8`}
                className='z-0'
              >
                <MediaProvider />
                <DefaultVideoLayout thumbnails={videoInfo.thumbnail} icons={defaultLayoutIcons} />
              </MediaPlayer>
              <div className='mt-4'>
                <h1 className='font-bold text-xl tracking-tight'>{videoInfo.title}</h1>
                <div className='flex justify-between items-center mt-4'>
                  <div className='flex items-center space-x-6'>
                    <div className='flex'>
                      <Link href='/'>
                        <Avatar>
                          <AvatarImage src={videoInfo.channel.avatar} alt={videoInfo.channel.channelName} />
                          <AvatarFallback>{videoInfo.channel.channelName[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                      </Link>
                      <div className='flex-1 ml-3'>
                        <div className='flex items-center'>
                          <Link href='/' className='font-medium'>
                            {videoInfo.channel.channelName}
                          </Link>
                          {videoInfo.channel.tick && (
                            <CheckCircle2 className='fill-zinc-800 dark:fill-zinc-500 stroke-background w-[15px] h-[15px] ml-2' />
                          )}
                        </div>
                        <div className='text-xs text-muted-foreground'>
                          {videoInfo.channel.subscribeCount} người đăng ký
                        </div>
                      </div>
                    </div>
                    {!videoInfo.channel.isSubscribed && <Button className='rounded-full'>Đăng ký</Button>}
                    {videoInfo.channel.isSubscribed && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant='secondary' className='rounded-full space-x-3'>
                            <Bell size={18} strokeWidth={1.5} />
                            <span>Đã đăng ký</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className='max-w-xs'>
                          <AlertDialogHeader>
                            <AlertDialogDescription className='pb-6'>
                              Hủy đăng ký {videoInfo.channel.channelName}?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className='rounded-full'>Hủy</AlertDialogCancel>
                            <AlertDialogAction className='rounded-full'>Hủy đăng ký</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                  <div className='flex items-center space-x-4'>
                    <div className='flex'>
                      <Button
                        variant='secondary'
                        className='rounded-l-full space-x-3 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                      >
                        <ThumbsUp
                          size={18}
                          strokeWidth={1.5}
                          className={classNames({
                            'fill-black dark:fill-white': videoInfo.isLiked
                          })}
                        />
                        <span>{videoInfo.likeCount}</span>
                      </Button>
                      <div className='w-[1px] bg-zinc-300 dark:bg-zinc-700' />
                      <Button
                        variant='secondary'
                        className='rounded-r-full space-x-3 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                      >
                        <ThumbsDown
                          size={18}
                          strokeWidth={1.5}
                          className={classNames({
                            'fill-black dark:fill-white': videoInfo.isDisliked
                          })}
                        />
                        <span>{videoInfo.dislikeCount}</span>
                      </Button>
                    </div>
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
                        <Button
                          variant='ghost'
                          className='space-x-3 w-full rounded-none justify-start h-10 font-normal'
                        >
                          <Download size={16} strokeWidth={1.5} />
                          <span>Tải xuống</span>
                        </Button>
                        <Button
                          variant='ghost'
                          className='space-x-3 w-full rounded-none justify-start h-10 font-normal'
                        >
                          <ListPlus size={16} strokeWidth={1.5} />
                          <span>Lưu</span>
                        </Button>
                        <Button
                          variant='ghost'
                          className='space-x-3 w-full rounded-none justify-start h-10 font-normal'
                        >
                          <Flag size={16} strokeWidth={1.5} />
                          <span>Báo vi phạm</span>
                        </Button>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
              <Separator className='my-3' />
              <div className='rounded-lg bg-muted p-3 space-y-1 cursor-pointer hover:bg-zinc-200/50 dark:hover:bg-zinc-700'>
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
                <div className='text-sm text-muted-foreground'>
                  {videoInfo.description.length <= MAX_LENGTH_OF_DESCRIPTION
                    ? videoInfo.description
                    : isShowMoreDescription
                    ? videoInfo.description
                    : `${videoInfo.description.substring(0, MAX_LENGTH_OF_DESCRIPTION)}...`}
                </div>
                {videoInfo.description.length > MAX_LENGTH_OF_DESCRIPTION && (
                  <div className='text-sm font-medium' onClick={handleShowMoreDescription}>
                    {!isShowMoreDescription ? 'Xem thêm' : 'Ẩn bớt'}
                  </div>
                )}
              </div>
              {/* Phần bình luận */}
              <div>
                <div className='flex items-center space-x-6 my-6'>
                  <h3 className='text-xl font-semibold'>42 bình luận</h3>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant='ghost' className='space-x-3 h-11 rounded-full'>
                        <BarChart strokeWidth={1.5} />
                        <span>Sắp xếp theo</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align='start' className='px-0 py-2 rounded-lg w-auto flex-col flex'>
                      <Button variant='ghost' className='h-12 rounded-none font-normal'>
                        Bình luận hàng đầu
                      </Button>
                      <Button variant='ghost' className='h-12 rounded-none font-normal'>
                        Mới nhất xếp trước
                      </Button>
                    </PopoverContent>
                  </Popover>
                </div>
                {account && <CommentInput accountData={account} isRootComment />}
                <div className='mt-6'>
                  <div>
                    <CommentItem />
                    <div className='pl-11 py-4'>
                      <CommentItem isRootComment={false} />
                      <CommentItem isRootComment={false} />
                      <CommentItem isRootComment={false} />
                    </div>
                  </div>
                </div>
              </div>
            </Fragment>
          )}
        </div>
        <div></div>
      </div>
    </div>
  )
}

export default WatchClient
