import { CheckCircle2 } from 'lucide-react'
import moment from 'moment'
import Image from 'next/image'
import Link from 'next/link'

import PATH from '@/constants/path'
import { convertMomentToVietnamese, formatViews } from '@/lib/utils'
import { VideoItemType } from '@/types/video.types'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import VideoActions from './video-actions'
import VideoThumbnailFallback from './video-thumbnail-fallback'

type VerticalVideoProps = {
  videoData: VideoItemType
}

const VerticalVideo = ({ videoData }: VerticalVideoProps) => {
  return (
    <div className='space-y-2'>
      <Link href={PATH.WATCH(videoData.idName)}>
        {videoData.thumbnail && (
          <Image
            width={800}
            height={800}
            src={videoData.thumbnail}
            alt={videoData.title}
            className='w-full h-[180px] object-cover rounded-lg'
          />
        )}
        {!videoData.thumbnail && <VideoThumbnailFallback wrapperClassName='h-[180px] rounded-lg' />}
      </Link>
      <div className='flex space-x-3'>
        <Link href={PATH.PROFILE(videoData.author.username)} className='flex-shrink-0'>
          <Avatar className='w-9 h-9'>
            <AvatarImage src={videoData.author.avatar} className='object-cover' />
            <AvatarFallback className='font-medium'>{videoData.author.channelName[0].toUpperCase()}</AvatarFallback>
          </Avatar>
        </Link>
        <div className='flex-1'>
          <div className='flex items-start space-x-4'>
            <div className='flex-1'>
              <Link href={PATH.WATCH(videoData.idName)} className='font-medium line-clamp-1'>
                {videoData.title}
              </Link>
              <div className='flex items-center space-x-1.5'>
                <Link href={PATH.PROFILE(videoData.author.username)} className='text-sm text-muted-foreground'>
                  {videoData.author.channelName}
                </Link>
                {videoData.author.tick && (
                  <CheckCircle2 className='w-4 h-4 fill-muted-foreground stroke-white dark:stroke-black' />
                )}
              </div>
            </div>
            <VideoActions />
          </div>
          <div className='text-sm text-muted-foreground flex items-center space-x-2'>
            <div>{formatViews(videoData.viewCount)} lượt xem</div>
            <div className='w-0.5 h-0.5 bg-muted-foreground rounded-full' />
            <div>{convertMomentToVietnamese(moment(videoData.createdAt).fromNow())}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerticalVideo
