import { useMutation, useQueryClient } from '@tanstack/react-query'
import { type ColumnDef } from '@tanstack/react-table'
import { Globe2, ListVideo, Lock, Pencil, Trash, VideoOff } from 'lucide-react'
import moment from 'moment'
import Image from 'next/image'
import Link from 'next/link'
import { Fragment } from 'react'
import toast from 'react-hot-toast'

import playlistApis from '@/apis/playlist.apis'
import DataTableColumnHeader from '@/components/data-table-column-header'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { PlaylistAudience } from '@/constants/enum'
import PATH from '@/constants/path'
import { PlaylistItemType } from '@/types/playlist.types'

export const columns: ColumnDef<PlaylistItemType>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Danh sách phát' />,
    cell: ({ row }) => {
      const queryClient = useQueryClient()
      const playlist = row.original

      // Mutation: Delete playlist
      const deletePlaylistMutation = useMutation({
        mutationKey: ['deletePlaylist'],
        mutationFn: playlistApis.deletePlaylist,
        onSuccess: () => {
          toast.success(`Đã xóa ${playlist.name}`)
          queryClient.invalidateQueries({ queryKey: ['getMyPlaylists'] })
        }
      })

      return (
        <div className='flex items-start space-x-4'>
          <div className='flex-shrink-0 relative'>
            {/* Thumbnail */}
            {!!playlist.thumbnail && (
              <Image
                width={200}
                height={200}
                src={playlist.thumbnail}
                alt={playlist.name}
                className='w-[120px] h-[68px] rounded-[2px] object-cover'
              />
            )}
            {/* Fallback thumbnail */}
            {!playlist.thumbnail && (
              <div className='w-[120px] h-[68px] rounded-[2px] flex items-center justify-center bg-muted'>
                <VideoOff strokeWidth={1.5} />
              </div>
            )}
            {/* Video count */}
            <div className='absolute top-0 bottom-0 right-0 bg-black/80 flex flex-col justify-center items-center px-4 space-y-1'>
              <span className='font-medium text-white text-xs'>{playlist.videoCount}</span>
              <ListVideo size={18} strokeWidth={1.5} className='stroke-white' />
            </div>
          </div>
          <div>
            <div className='text-[13px]'>{playlist.name}</div>
            <div className='text-muted-foreground text-xs mt-0.5 block group-hover:hidden'>
              {!!playlist.description ? playlist.description : 'Thêm nội dung mô tả'}
            </div>
            {/* Actions */}
            <div className='hidden group-hover:flex items-center mt-1.5'>
              <Button size='icon' variant='ghost' className='rounded-full' asChild>
                <Link href={PATH.STUDIO_CONTENT_PLAYLIST(playlist._id)}>
                  <Pencil size={18} strokeWidth={1.5} />
                </Link>
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size='icon' variant='ghost' className='rounded-full ml-1'>
                    <Trash size={18} strokeWidth={1.5} />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Xoá "{playlist.name}"?</AlertDialogTitle>
                    <AlertDialogDescription className='space-y-2'>
                      <div>
                        Bạn có chắc chắn muốn xoá <span className='font-semibold'>"{playlist.name}"</span> không?
                      </div>
                      <div>
                        Lưu ý: Thao tác xoá danh sách phát có hiệu lực vĩnh viễn và không huỷ được sau khi thực hiện.
                        Các video trong danh sách phát này sẽ không bị xoá.
                      </div>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className='rounded-full'>Hủy</AlertDialogCancel>
                    <AlertDialogAction
                      className='rounded-full'
                      onClick={() => deletePlaylistMutation.mutate(playlist._id)}
                    >
                      Xóa
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      )
    }
  },
  {
    accessorKey: 'audience',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Chế độ hiển thị' />,
    cell: ({ row }) => {
      const playlist = row.original
      return (
        <Fragment>
          {playlist.audience === PlaylistAudience.Everyone && (
            <div className='flex items-center space-x-2'>
              <Globe2 strokeWidth={1.5} size={18} className='stroke-green-600' />
              <span className='text-[13px]'>Công khai</span>
            </div>
          )}
          {playlist.audience === PlaylistAudience.Onlyme && (
            <div className='flex items-center space-x-2'>
              <Lock strokeWidth={1.5} size={18} />
              <span className='text-[13px]'>Riêng tư</span>
            </div>
          )}
        </Fragment>
      )
    }
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Lần cập nhật gần nhất' />,
    cell: ({ row }) => {
      const playlist = row.original
      return (
        <div className='text-[13px]'>
          {moment(playlist.createdAt).date()} thg {moment(playlist.createdAt).month() + 1},{' '}
          {moment(playlist.createdAt).year()}
        </div>
      )
    }
  },
  {
    accessorKey: 'videoCount',
    header: ({ column }) => (
      <div className='flex justify-end'>
        <DataTableColumnHeader column={column} title='Số lượng video' />
      </div>
    ),
    cell: ({ row }) => {
      return <div className='text-[13px] text-right'>{row.original.videoCount}</div>
    }
  }
]
