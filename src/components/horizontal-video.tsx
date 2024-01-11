import { CheckCircle2 } from 'lucide-react'
import moment from 'moment'
import Image from 'next/image'
import Link from 'next/link'

import { convertMomentToVietnamese, formatViews } from '@/lib/utils'
import { SearchResultItem } from '@/types/search.types'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import VideoActions from './video-actions'

type HorizontalVideoProps = {
  videoData: SearchResultItem
}

const HorizontalVideo = ({ videoData }: HorizontalVideoProps) => {
  return (
    <div className='flex space-x-4'>
      <Link href={`/watch/${videoData.idName}`} className='flex-shrink-0 basis-1/3 h-[200px]'>
        <Image
          width={500}
          height={500}
          src={videoData.thumbnail}
          alt={videoData.title}
          className='w-full h-full object-cover rounded-xl'
        />
      </Link>
      <div className='flex-1 group'>
        <div className='flex space-x-4'>
          <div className='flex-1'>
            <Link href={`/watch/${videoData.idName}`} className='text-lg tracking-tight'>
              <h3 className='line-clamp-2'>{videoData.title}</h3>
            </Link>
            <div className='flex items-center space-x-2 text-xs text-muted-foreground'>
              <span>{formatViews(videoData.viewCount)} lượt xem</span>
              <span className='w-[3px] h-[3px] bg-muted-foreground rounded-full' />
              <span>{convertMomentToVietnamese(moment(videoData.createdAt).fromNow())}</span>
            </div>
            <Link href={`/@${videoData.author.username}`} className='inline-flex items-center space-x-2 my-3'>
              <Avatar className='w-6 h-6'>
                <AvatarImage src={videoData.author.avatar} alt={videoData.author.channelName} />
                <AvatarFallback>{videoData.author.channelName[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className='text-xs text-muted-foreground'>{videoData.author.channelName}</span>
              <CheckCircle2 className='w-[14px] h-[14px] fill-muted-foreground stroke-background' />
            </Link>
            <div className='text-xs text-muted-foreground line-clamp-2'>{videoData.description}</div>
            <Badge className='rounded-sm mt-3'>Mới</Badge>
          </div>
          <VideoActions className='opacity-0 group-hover:opacity-100' />
        </div>
      </div>
    </div>
  )
}

export default HorizontalVideo
