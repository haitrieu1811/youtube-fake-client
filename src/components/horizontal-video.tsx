import { CheckCircle2, LucideIcon } from 'lucide-react'
import moment from 'moment'
import Image from 'next/image'
import Link from 'next/link'

import PATH from '@/constants/path'
import { convertMomentToVietnamese, formatViews } from '@/lib/utils'
import { SearchResultItem } from '@/types/search.types'
import { VideoItemType } from '@/types/video.types'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'
import VideoActions from './video-actions'
import { WatchHistoryItemType } from '@/types/watchHistory.types'

type VideoAction = {
  icon: LucideIcon
  method: () => void
  explainText?: string
}

type HorizontalVideoProps = {
  videoData: SearchResultItem | VideoItemType | WatchHistoryItemType
  videoActions?: VideoAction[]
  classNameThumbnail?: string
}

const HorizontalVideo = ({
  videoData,
  videoActions,
  classNameThumbnail = 'flex-shrink-0 w-[360px] h-[200px] object-cover rounded-xl'
}: HorizontalVideoProps) => {
  return (
    <TooltipProvider>
      <div className='flex space-x-4'>
        <Link href={PATH.WATCH(videoData.idName)}>
          <Image
            width={500}
            height={500}
            src={videoData.thumbnail}
            alt={videoData.title}
            className={classNameThumbnail}
          />
        </Link>
        <div className='flex-1 group'>
          <div className='flex space-x-4'>
            <div className='flex-1'>
              <Link href={PATH.WATCH(videoData.idName)} className='text-lg tracking-tight'>
                <h3 className='line-clamp-2'>{videoData.title}</h3>
              </Link>
              <div className='flex items-center space-x-2 text-xs text-muted-foreground'>
                <span>{formatViews(videoData.viewCount)} lượt xem</span>
                <span className='w-[3px] h-[3px] bg-muted-foreground rounded-full' />
                <span>{convertMomentToVietnamese(moment(videoData.createdAt).fromNow())}</span>
              </div>
              <Link href={PATH.PROFILE(videoData.author.username)} className='inline-flex items-center space-x-2 my-3'>
                <Avatar className='w-6 h-6'>
                  <AvatarImage src={videoData.author.avatar} alt={videoData.author.channelName} />
                  <AvatarFallback>{videoData.author.channelName[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className='text-xs text-muted-foreground'>{videoData.author.channelName}</span>
                <CheckCircle2 className='w-[14px] h-[14px] fill-blue-500 stroke-background' />
              </Link>
              <div className='text-xs text-muted-foreground line-clamp-2'>{videoData.description}</div>
            </div>
            <div className='flex space-x-3 opacity-0 group-hover:opacity-100'>
              {videoActions && (
                <div>
                  {videoActions.map((item, index) => (
                    <Tooltip key={index}>
                      <TooltipTrigger asChild>
                        <Button variant='ghost' className='w-9 h-9 rounded-full p-0' onClick={item.method}>
                          <item.icon strokeWidth={1.5} size={18} />
                        </Button>
                      </TooltipTrigger>
                      {item.explainText && <TooltipContent>{item.explainText}</TooltipContent>}
                    </Tooltip>
                  ))}
                </div>
              )}
              <VideoActions />
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

export default HorizontalVideo
