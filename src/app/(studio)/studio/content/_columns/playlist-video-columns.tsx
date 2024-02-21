import type { ColumnDef } from '@tanstack/react-table'
import moment from 'moment'
import Image from 'next/image'

import DataTableColumnHeader from '@/components/data-table-column-header'
import { Badge } from '@/components/ui/badge'
import { PlaylistVideoItemType } from '@/types/playlist.types'

export const columns: ColumnDef<PlaylistVideoItemType>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Video' />,
    cell: ({ row }) => {
      const playlistVideo = row.original
      return (
        <div className='flex space-x-4'>
          <div className='flex-shrink-0'>
            {/* Thumbnail fallback */}
            {!playlistVideo.thumbnail && (
              <div className='flex justify-center items-center flex-col w-[120px] h-[68px] rounded-[2px] bg-muted'>
                <span className='text-xs text-muted-foreground text-center px-4'>Chưa tải hình thu nhỏ</span>
              </div>
            )}
            {/* Thumbnail */}
            {!!playlistVideo.thumbnail && (
              <Image
                width={200}
                height={200}
                src={playlistVideo.thumbnail}
                alt={playlistVideo.title}
                className='w-[120px] h-[68px] rounded-[2px] object-cover'
              />
            )}
          </div>
          <div className='flex-1 space-y-1'>
            <div className='text-[13px] line-clamp-1'>{playlistVideo.title}</div>
            <div className='text-xs text-muted-foreground line-clamp-1'>
              {!!playlistVideo.description ? playlistVideo.description : 'Chưa có mô tả'}
            </div>
            <Badge className='rounded-sm'>{playlistVideo.author.channelName}</Badge>
          </div>
        </div>
      )
    }
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Ngày đăng' />,
    cell: ({ row }) => {
      const playlistVideo = row.original
      return (
        <div className='text-[13px]'>
          {moment(playlistVideo.createdAt).date()} thg {moment(playlistVideo.createdAt).month() + 1},{' '}
          {moment(playlistVideo.createdAt).year()}
        </div>
      )
    }
  },
  {
    accessorKey: 'addedAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Ngày thêm vào playlist' />,
    cell: ({ row }) => {
      const playlistVideo = row.original
      return (
        <div className='text-[13px]'>
          {moment(playlistVideo.addedAt).date()} thg {moment(playlistVideo.addedAt).month() + 1},{' '}
          {moment(playlistVideo.addedAt).year()}
        </div>
      )
    }
  },
  {
    accessorKey: 'viewCount',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Số lượt xem' />,
    cell: ({ row }) => {
      return <div className='text-[13px]'>{row.original.viewCount}</div>
    }
  }
]
