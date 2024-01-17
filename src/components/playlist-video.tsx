import moment from 'moment'
import Image from 'next/image'
import Link from 'next/link'

import PATH from '@/constants/path'
import { convertMomentToVietnamese, formatViews } from '@/lib/utils'
import { VideoItemType } from '@/types/video.types'
import VideoActions from './video-actions'

type PlaylistVideoProps = {
  index: number
  videoData: VideoItemType
}

const PlaylistVideo = ({ index, videoData }: PlaylistVideoProps) => {
  return (
    <div className='flex items-center p-2 hover:bg-muted cursor-pointer rounded-lg group'>
      <div className='w-[50px] text-center'>{index}</div>
      <div className='flex flex-1 space-x-2'>
        <Link href={PATH.WATCH(videoData.idName)} className='flex-shrink-0'>
          <Image
            width={160}
            height={90}
            src={videoData.thumbnail}
            className='w-[160px] h-[90px] rounded-lg object-cover'
            alt={videoData.title}
          />
        </Link>
        <div className='flex-1 space-y-1'>
          <Link href={PATH.WATCH(videoData.idName)} className='font-medium line-clamp-2'>
            {videoData.title}
          </Link>
          <div className='flex items-center space-x-2 text-xs text-muted-foreground'>
            <Link href={PATH.WATCH(videoData.author.username)}>{videoData.author.channelName}</Link>
            <span className='w-1 h-1 rounded-full bg-muted-foreground' />
            <div>{formatViews(videoData.viewCount)} lượt xem</div>
            <span className='w-1 h-1 rounded-full bg-muted-foreground' />
            <div>{convertMomentToVietnamese(moment(videoData.createdAt).fromNow())}</div>
          </div>
        </div>
      </div>
      <div className='opacity-0 group-hover:opacity-100'>
        <VideoActions />
      </div>
    </div>
  )
}

export default PlaylistVideo
