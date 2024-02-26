import { MessageSquareText } from 'lucide-react'
import moment from 'moment'
import Image from 'next/image'
import Link from 'next/link'
import type { Dispatch, SetStateAction } from 'react'

import PATH from '@/constants/path'
import { convertMomentToVietnamese } from '@/lib/utils'
import { PostItemType } from '@/types/post.types'
import PostActions from './post-actions'
import PostReaction from './post-reaction'
import { Button } from './ui/button'

type SmallPostType = {
  postData: PostItemType
  setPosts?: Dispatch<SetStateAction<PostItemType[]>>
}

const SmallPost = ({ postData, setPosts }: SmallPostType) => {
  return (
    <div className='border border-border rounded-xl p-4 space-y-3'>
      {/* Author of post */}
      <div className='flex items-center space-x-2'>
        <Link href={PATH.PROFILE(postData.author.username)} className='flex items-center space-x-2'>
          <Image
            width={100}
            height={100}
            src={postData.author.avatar}
            alt={postData.author.channelName}
            className='w-6 h-6 rounded-full object-cover'
          />
          <span className='text-xs text-muted-foreground'>{postData.author.channelName}</span>
        </Link>
        <span className='text-xs text-muted-foreground'>
          {convertMomentToVietnamese(moment(postData.createdAt).fromNow())}
        </span>
      </div>
      {/* Content */}
      <Link href={PATH.POST_DETAIL(postData._id)} className='flex space-x-3'>
        <div className='flex-1 text-sm'>
          <span className='line-clamp-5'>{postData.content}</span>
        </div>
        {postData.images.length > 0 && (
          <div className='flex shrink-0'>
            <Image
              width={500}
              height={500}
              src={postData.images[0]}
              alt={postData.images[0]}
              className='w-[116px] h-[116px] object-cover rounded-xl'
            />
          </div>
        )}
      </Link>
      <div className='flex items-center justify-between'>
        <PostReaction postData={postData} setPosts={setPosts} />
        <div className='flex items-center space-x-4'>
          <div className='flex items-center space-x-0.5'>
            <Button size='icon' variant='ghost' className='rounded-full' asChild>
              <Link href={PATH.POST_DETAIL(postData._id)}>
                <MessageSquareText strokeWidth={1.5} size={16} />
              </Link>
            </Button>
            <span className='text-muted-foreground text-sm'>{postData.commentCount}</span>
          </div>
          <PostActions postData={postData} />
        </div>
      </div>
    </div>
  )
}

export default SmallPost
