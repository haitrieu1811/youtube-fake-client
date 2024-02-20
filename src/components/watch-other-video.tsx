import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle2 } from 'lucide-react'

import { VideoItemType } from '@/types/video.types'
import PATH from '@/constants/path'
import { convertMomentToVietnamese, formatViews } from '@/lib/utils'
import moment from 'moment'
import VideoActions from './video-actions'

type WatchOtherVideoProps = {
  videoData: VideoItemType
}

const WatchOtherVideo = ({ videoData }: WatchOtherVideoProps) => {
  return (
    <div className='flex space-x-2 group'>
      <Link href={PATH.WATCH(videoData.idName)} className='flex-shrink-0'>
        <Image
          width={170}
          height={100}
          src={videoData.thumbnail}
          alt={videoData.title}
          className='w-[170px] h-[100px] rounded-lg object-cover'
        />
      </Link>
      <div className='flex-1 space-y-1'>
        <Link href={PATH.WATCH(videoData.idName)} className='text-sm font-medium line-clamp-2'>
          {videoData.title}
        </Link>
        <div className='flex items-center space-x-1.5'>
          <Link href={PATH.PROFILE(videoData.author.username)} className='text-muted-foreground text-xs'>
            {videoData.author.channelName}
          </Link>
          <CheckCircle2 size={14} strokeWidth={1.5} className='stroke-background fill-muted-foreground' />
        </div>
        <div className='text-muted-foreground text-xs space-x-2 flex items-center'>
          <span>{formatViews(videoData.viewCount)} lượt xem</span>
          <span className='w-0.5 h-0.5 rounded-full bg-muted-foreground' />
          <span>{convertMomentToVietnamese(moment(videoData.createdAt).fromNow())}</span>
        </div>
      </div>
      <div className='opacity-0 group-hover:opacity-100'>
        <VideoActions />
      </div>
    </div>
  )
}

export default WatchOtherVideo
