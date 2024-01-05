import { CheckCircle2, Flag, History, ListPlus, MoreVertical } from 'lucide-react'
import moment from 'moment'
import Image from 'next/image'
import Link from 'next/link'

import { convertMomentToVietnamese, formatViews } from '@/lib/utils'
import { VideoItemType } from '@/types/video.types'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'

type VerticalVideoProps = {
  videoData: VideoItemType
}

const VerticalVideo = ({ videoData }: VerticalVideoProps) => {
  return (
    <div className='space-y-2'>
      <Link href={`/watch/${videoData.idName}`}>
        <Image
          width={800}
          height={800}
          src={videoData.thumbnail}
          alt={videoData.title}
          className='w-full h-[180px] object-cover rounded-lg'
        />
      </Link>
      <div className='flex space-x-3 group'>
        <Link href={`/@${videoData.author.username}`} className='flex-shrink-0'>
          <Avatar className='w-9 h-9'>
            <AvatarImage src={videoData.author.avatar} className='object-cover' />
            <AvatarFallback className='font-medium'>{videoData.author.channelName[0].toUpperCase()}</AvatarFallback>
          </Avatar>
        </Link>
        <div className='flex-1'>
          <div className='flex items-start space-x-4'>
            <div className='flex-1'>
              <Link href={`/watch/${videoData.idName}`} className='font-medium line-clamp-2'>
                {videoData.title}
              </Link>
              <div className='flex items-center space-x-2'>
                <Link href={`/@${videoData.author.username}`} className='text-sm text-muted-foreground'>
                  {videoData.author.channelName}
                </Link>
                {videoData.author.tick && (
                  <CheckCircle2 className='w-[14px] h-[14px] fill-muted-foreground stroke-white dark:stroke-black' />
                )}
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger className='opacity-0 group-hover:opacity-100' asChild>
                <Button size='icon' variant='ghost' className='w-9 h-9 rounded-full'>
                  <MoreVertical size={18} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='bg-background py-2'>
                <DropdownMenuItem className='space-x-4 px-4 py-2.5 hover:cursor-pointer'>
                  <History size={18} strokeWidth={1.5} />
                  <span>Thêm vào danh sách xem sau</span>
                </DropdownMenuItem>
                <DropdownMenuItem className='space-x-4 px-4 py-2.5 hover:cursor-pointer'>
                  <Flag size={18} strokeWidth={1.5} />
                  <span>Báo vi phạm</span>
                </DropdownMenuItem>
                <DropdownMenuItem className='space-x-4 px-4 py-2.5 hover:cursor-pointer'>
                  <ListPlus size={18} strokeWidth={1.5} />
                  <span>Thêm vào playlist</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
