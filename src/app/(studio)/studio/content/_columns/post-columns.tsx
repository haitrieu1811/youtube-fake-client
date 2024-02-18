import { ColumnDef } from '@tanstack/react-table'
import { Globe2, Lock, Pencil, Trash } from 'lucide-react'
import moment from 'moment'
import Image from 'next/image'
import Link from 'next/link'
import { Fragment } from 'react'

import DataTableColumnHeader from '@/components/data-table-column-header'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { PostAudience } from '@/constants/enum'
import PATH from '@/constants/path'
import { PostItemType } from '@/types/post.types'

export const columns: ColumnDef<PostItemType>[] = [
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
    accessorKey: 'content',
    maxSize: 400,
    header: ({ column }) => (
      <div className='ml-4'>
        <DataTableColumnHeader column={column} title='Bài đăng' />
      </div>
    ),
    cell: ({ row }) => {
      const post = row.original
      return (
        <div className='flex items-start space-x-4 group'>
          <Image
            width={200}
            height={200}
            src={post.images[0]}
            alt={post.content}
            className='w-[120px] h-[68px] rounded-[2px] object-cover flex-shrink-0'
          />
          <div className='space-y-1'>
            <span className='line-clamp-1'>{post.content}</span>
            <div className='flex items-center space-x-1 opacity-0 group-hover:opacity-100'>
              <Button variant='ghost' size='icon' className='rounded-full' asChild>
                <Link href={PATH.STUDIO_CONTENT_POST(post._id)}>
                  <Pencil size={16} strokeWidth={1.5} className='text-muted-foreground' />
                </Link>
              </Button>
              <Button variant='ghost' size='icon' className='rounded-full'>
                <Trash size={16} strokeWidth={1.5} className='text-muted-foreground' />
              </Button>
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
      const video = row.original
      return (
        <Fragment>
          {video.audience === PostAudience.Everyone && (
            <div className='flex items-center space-x-2'>
              <Globe2 strokeWidth={1.5} size={18} className='stroke-green-600' />
              <span className='text-[13px]'>Công khai</span>
            </div>
          )}
          {video.audience === PostAudience.Onlyme && (
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
          <div className='text-xs text-muted-foreground'>Đã đăng</div>
        </div>
      )
    }
  },
  {
    accessorKey: 'commentCount',
    header: ({ column }) => (
      <div className='flex justify-end'>
        <DataTableColumnHeader column={column} title='Bình luận' />
      </div>
    ),
    cell: ({ row }) => <div className='text-right text-[13px]'>{row.original.commentCount}</div>
  },
  {
    accessorKey: 'likeCount',
    header: ({ column }) => (
      <div className='flex justify-end'>
        <DataTableColumnHeader column={column} title='Lượt thích' />
      </div>
    ),
    cell: ({ row }) => <div className='text-right text-[13px]'>{row.original.likeCount}</div>
  }
]
