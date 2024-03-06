import moment from 'moment'
import Image from 'next/image'
import Link from 'next/link'

import PATH from '@/constants/path'
import { convertMomentToVietnamese, formatViews } from '@/lib/utils'
import { VideoItemType } from '@/types/video.types'
import VideoActions from './video-actions'

type ProfileVideoProps = {
  videoData: VideoItemType
}

const ProfileVideo = ({ videoData }: ProfileVideoProps) => {
  return (
    <div>
      <Link href={PATH.WATCH(videoData.idName)}>
        <Image
          width={400}
          height={400}
          src={videoData.thumbnail}
          alt={videoData.title}
          className='h-[160px] rounded-lg object-cover'
        />
      </Link>
      <div className='flex py-2 group'>
        <div className='flex-1'>
          <Link href={PATH.WATCH(videoData.idName)}>
            <h3 className='line-clamp-2 font-medium'>{videoData.title}</h3>
          </Link>
          <div className='flex items-center space-x-2 text-xs text-muted-foreground'>
            <span>{formatViews(videoData.viewCount)} lượt xem</span>
            <span className='w-1 h-1 rounded-full bg-muted-foreground' />
            <span>{convertMomentToVietnamese(moment(videoData.createdAt).fromNow())}</span>
          </div>
        </div>
        <VideoActions videoId={videoData._id} />
      </div>
    </div>
  )
}

export default ProfileVideo
