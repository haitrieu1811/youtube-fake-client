import { ColumnDef } from '@tanstack/react-table'
import { File, Globe2, Lock, Pencil, Trash, Youtube } from 'lucide-react'
import moment from 'moment'
import Image from 'next/image'
import { Fragment } from 'react'

import DataTableColumnHeader from '@/components/data-table-column-header'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { VideoAudience } from '@/constants/enum'
import { VideoItemType } from '@/types/video.types'
import Link from 'next/link'
import PATH from '@/constants/path'

export const columns: ColumnDef<VideoItemType>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <div className='ml-4'>
        <DataTableColumnHeader column={column} title='Video' />
      </div>
    ),
    cell: ({ row }) => {
      const video = row.original
      return (
        <TooltipProvider>
          <div className='flex ml-4 group'>
            <div className='flex-shrink-0 relative'>
              {!video.thumbnail && (
                <div className='flex justify-center items-center flex-col w-[120px] h-[68px] rounded-[2px] bg-muted'>
                  <span className='text-xs text-muted-foreground text-center px-4'>Chưa tải hình thu nhỏ</span>
                </div>
              )}
              {!!video.thumbnail && (
                <Image
                  width={200}
                  height={200}
                  src={video.thumbnail}
                  alt={video.title}
                  className='w-[120px] h-[68px] rounded-[2px] object-cover'
                />
              )}
              {video.isDraft && (
                <div className='absolute inset-0 w-[120px] h-[68px] rounded-[2px] bg-white/60 dark:bg-black/60' />
              )}
            </div>
            <div className='flex-1 ml-4 flex flex-col'>
              <div className='text-[13px]'>{video.title}</div>
              <div className='flex-1 relative'>
                <div className='text-xs text-muted-foreground opacity-100 group-hover:opacity-0 pointer-events-auto group-hover:pointer-events-none'>
                  Thêm nội dung mô tả
                </div>
                <div className='absolute inset-0 flex items-center space-x-1 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto'>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size='icon' variant='ghost' className='rounded-full' asChild>
                        <Link href={`${PATH.STUDIO_CONTENT_VIDEO}/${video._id}`}>
                          <Pencil size={16} strokeWidth={1.5} />
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Chi tiết</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size='icon' variant='ghost' className='rounded-full'>
                        <Youtube size={16} strokeWidth={1.5} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Xem trên YouTube</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size='icon' variant='ghost' className='rounded-full'>
                        <Trash size={16} strokeWidth={1.5} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Xóa vĩnh viễn</TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
        </TooltipProvider>
      )
    }
  },
  {
    accessorKey: 'audience',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Chế độ hiển thị' />,
    cell: ({ row }) => {
      const video = row.original
      return (
        <Fragment>
          {video.isDraft && (
            <div className='flex items-center space-x-2'>
              <File strokeWidth={1.5} size={18} />
              <span className='text-[13px]'>Bản nháp</span>
            </div>
          )}
          {!video.isDraft && video.audience === VideoAudience.Everyone && (
            <div className='flex items-center space-x-2'>
              <Globe2 strokeWidth={1.5} size={18} className='stroke-green-600' />
              <span className='text-[13px]'>Công khai</span>
            </div>
          )}
          {!video.isDraft && video.audience === VideoAudience.Onlyme && (
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
    accessorKey: 'createdAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Ngày' />,
    cell: ({ row }) => {
      const video = row.original
      return (
        <div>
          <div className='text-[13px]'>
            {moment(video.createdAt).date()} thg {moment(video.createdAt).month() + 1}, {moment(video.createdAt).year()}
          </div>
          <div className='text-xs text-muted-foreground'>{video.isDraft ? 'Ngày tải lên' : 'Ngày xuất bản'}</div>
        </div>
      )
    }
  },
  {
    accessorKey: 'viewCount',
    header: ({ column }) => (
      <div className='flex justify-end'>
        <DataTableColumnHeader column={column} title='Số lượt xem' />
      </div>
    ),
    cell: ({ row }) => <div className='text-right text-[13px]'>{row.original.viewCount}</div>
  },
  {
    accessorKey: 'commentCount',
    header: ({ column }) => (
      <div className='flex justify-end'>
        <DataTableColumnHeader column={column} title='Số bình luận' />
      </div>
    ),
    cell: ({ row }) => <div className='text-right text-[13px]'>{row.original.commentCount}</div>
  },
  {
    accessorKey: 'likeCount',
    header: ({ column }) => (
      <div className='flex justify-end'>
        <DataTableColumnHeader column={column} title='Lượt like' />
      </div>
    ),
    cell: ({ row }) => <div className='text-right text-[13px]'>{row.original.likeCount}</div>
  },
  {
    accessorKey: 'dislikeCount',
    header: ({ column }) => (
      <div className='flex justify-end'>
        <DataTableColumnHeader column={column} title='Lượt dislike' />
      </div>
    ),
    cell: ({ row }) => <div className='text-right text-[13px]'>{row.original.dislikeCount}</div>
  }
]
