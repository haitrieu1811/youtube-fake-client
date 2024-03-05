import { ListVideo, Lock, Play } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { PlaylistAudience } from '@/constants/enum'
import PATH from '@/constants/path'
import { PlaylistItemType } from '@/types/playlist.types'

type PlaylistItemProps = {
  playlistData: PlaylistItemType
}

const PlaylistItem = ({ playlistData }: PlaylistItemProps) => {
  return (
    <div className='group'>
      <div className='relative rounded-lg overflow-hidden'>
        <Link
          href={{
            pathname: PATH.WATCH(playlistData.firstVideoIdName),
            query: { list: playlistData._id }
          }}
        >
          <Image
            width={200}
            height={200}
            src={playlistData.thumbnail}
            alt={playlistData.name}
            className='w-full h-[118px] object-cover'
          />
        </Link>
        <div className='absolute bottom-2 right-2 flex items-center bg-black/50 p-1 rounded-sm pointer-events-none'>
          <ListVideo strokeWidth={1.5} className='w-4 h-4 mr-2 stroke-white' />
          <span className='text-muted-foreground text-xs text-white'>{playlistData.videoCount} video</span>
        </div>
        <div className='hidden group-hover:flex justify-center items-center absolute inset-0 bg-black/70 space-x-2 pointer-events-none'>
          <Play strokeWidth={1.5} size={18} className='fill-white stroke-white' />
          <span className='uppercase text-sm font-medium text-white'>Phát tất cả</span>
        </div>
      </div>
      <div className='space-y-1 mt-2'>
        <Link href={PATH.HOME} className='font-medium text-sm block line-clamp-1'>
          {playlistData.name}
        </Link>
        {playlistData.audience === PlaylistAudience.Onlyme && (
          <div className='inline-flex items-center space-x-2 bg-muted rounded-sm p-1'>
            <Lock size={14} strokeWidth={1.5} />
            <span className='text-xs'>Riêng tư</span>
          </div>
        )}
        <Link href={PATH.PLAYLIST_DETAIL(playlistData._id)} className='text-muted-foreground text-xs block'>
          Xem toàn bộ danh sách
        </Link>
      </div>
    </div>
  )
}

export default PlaylistItem
