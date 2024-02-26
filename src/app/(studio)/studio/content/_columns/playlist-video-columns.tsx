import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'
import { ListX, Youtube } from 'lucide-react'
import moment from 'moment'
import Image from 'next/image'
import Link from 'next/link'
import toast from 'react-hot-toast'

import playlistApis from '@/apis/playlist.apis'
import DataTableColumnHeader from '@/components/data-table-column-header'
import { Button } from '@/components/ui/button'
import PATH from '@/constants/path'
import { PlaylistVideoItemType } from '@/types/playlist.types'

export const columns: ColumnDef<PlaylistVideoItemType>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Video' />,
    cell: ({ row }) => {
      const playlistVideo = row.original
      const queryClient = useQueryClient()

      // Mutation: Remove video from playlist
      const removeVideoFromPlaylistMutation = useMutation({
        mutationKey: ['removeVideoFromPLaylist'],
        mutationFn: playlistApis.removeVideoFromPlaylist,
        onSuccess: () => {
          toast.success('Đã xoá xong video khỏi danh sách phát này.')
          queryClient.invalidateQueries({ queryKey: ['getVideosFromPlaylist'] })
        }
      })

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
            <div className='block group-hover:hidden space-y-1'>
              <div className='text-xs text-muted-foreground line-clamp-1'>
                {!!playlistVideo.description ? playlistVideo.description : 'Chưa có mô tả'}
              </div>
              <div className='p-1 font-semibold rounded bg-muted inline-block text-xs'>
                {playlistVideo.author.channelName}
              </div>
            </div>
            {/* Actions */}
            <div className='hidden group-hover:flex items-center'>
              <Button size='icon' variant='ghost' className='rounded-full' asChild>
                <Link href={PATH.WATCH(playlistVideo.idName)} target='_blank'>
                  <Youtube size={18} strokeWidth={1.5} />
                </Link>
              </Button>
              <Button
                size='icon'
                variant='ghost'
                className='rounded-full ml-1'
                onClick={() =>
                  removeVideoFromPlaylistMutation.mutate({
                    playlistId: playlistVideo.playlistId,
                    videoId: playlistVideo._id
                  })
                }
              >
                <ListX size={18} strokeWidth={1.5} />
              </Button>
            </div>
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
