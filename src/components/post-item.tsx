import Tippy from '@tippyjs/react/headless'
import { MessageSquareText, MoreVertical, Pencil, ThumbsDown, ThumbsUp, Trash } from 'lucide-react'
import moment from 'moment'
import Image from 'next/image'
import Link from 'next/link'

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import PATH from '@/constants/path'
import { convertMomentToVietnamese } from '@/lib/utils'
import { PostItemType } from '@/types/post.types'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'

type PostItemProps = {
  postData: PostItemType
}

const PostItem = ({ postData }: PostItemProps) => {
  return (
    <div className='flex space-x-5 border border-border rounded-xl p-5 group'>
      <div className='flex-shrink-0'>
        {/* Avatar */}
        <Avatar>
          <AvatarImage src={postData.author.avatar} alt={postData.author.channelName} />
          <AvatarFallback>{postData.author.channelName[0].toUpperCase()}</AvatarFallback>
        </Avatar>
      </div>
      <div className='flex-1 space-y-2'>
        <div className='flex items-center space-x-2'>
          {/* Channel name */}
          <Link href={PATH.PROFILE(postData.author.username)} className='text-[13px] font-medium'>
            {postData.author.channelName}
          </Link>
          {/* Created at */}
          <span className='text-xs text-muted-foreground'>
            {convertMomentToVietnamese(moment(postData.createdAt).fromNow())}
          </span>
        </div>
        {/* Content */}
        <div className='space-y-2'>
          <div className='whitespace-pre-line text-sm'>{postData.content}</div>
          {postData.images.length > 0 && (
            <Carousel className='w-[638px]'>
              <CarouselContent>
                {postData.images.map((image) => (
                  <CarouselItem key={image}>
                    <Image
                      width={1000}
                      height={1000}
                      src={image}
                      alt={image}
                      className='rounded-xl h-[638px] w-[638px] object-cover'
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className='-left-5 w-10 h-10' />
              <CarouselNext className='-right-5 w-10 h-10' />
            </Carousel>
          )}
          <div className='flex items-center space-x-4'>
            {/* Likes and dislikes */}
            <div className='flex items-center space-x-3 -ml-2.5'>
              <div className='flex items-center space-x-0.5'>
                <Button size='icon' variant='ghost' className='rounded-full'>
                  <ThumbsUp strokeWidth={1.5} size={16} />
                </Button>
                <span className='text-muted-foreground text-sm'>{postData.likeCount}</span>
              </div>
              <div className='flex items-center space-x-0.5'>
                <Button size='icon' variant='ghost' className='rounded-full'>
                  <ThumbsDown strokeWidth={1.5} size={16} />
                </Button>
                <span className='text-muted-foreground text-sm'>{postData.dislikeCount}</span>
              </div>
            </div>
            {/* Comments */}
            <Button size='icon' variant='ghost' className='rounded-full'>
              <MessageSquareText strokeWidth={1.5} size={16} />
            </Button>
          </div>
        </div>
      </div>
      {/* Actions */}
      <div>
        <Tippy
          interactive
          placement='bottom-start'
          trigger='click'
          offset={[0, 10]}
          render={() => (
            <div className='bg-background rounded-xl py-2 border border-border overflow-hidden shadow-lg'>
              <Button variant='ghost' className='flex justify-start space-x-3 rounded-none w-full'>
                <Pencil strokeWidth={1.5} size={18} />
                <span>Chỉnh sửa</span>
              </Button>
              <Button variant='ghost' className='flex justify-start space-x-3 rounded-none w-full'>
                <Trash strokeWidth={1.5} size={18} />
                <span>Xóa</span>
              </Button>
            </div>
          )}
        >
          <Button size='icon' variant='ghost' className='rounded-full opacity-0 group-hover:opacity-100'>
            <MoreVertical strokeWidth={1.5} size={18} />
          </Button>
        </Tippy>
      </div>
    </div>
  )
}

export default PostItem
