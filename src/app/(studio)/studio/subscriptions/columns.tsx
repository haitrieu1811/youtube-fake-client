'use client'

import { ColumnDef } from '@tanstack/react-table'
import moment from 'moment'
import Link from 'next/link'

import DataTableColumnHeader from '@/components/data-table-column-header'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Checkbox } from '@/components/ui/checkbox'
import { SubscribedChannelType } from '@/types/subscription.types'

export const columns: ColumnDef<SubscribedChannelType>[] = [
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
    accessorKey: 'channelName',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Kênh' />,
    cell: ({ row }) => {
      const channel = row.original
      return (
        <Link href={`/@${channel.username}`} target='b' className='flex items-center space-x-4 group'>
          <Avatar className='w-9 h-9'>
            <AvatarImage src={channel.avatar} />
            <AvatarFallback>{channel.channelName[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className='text-[13px] font-medium group-hover:text-blue-700'>{channel.channelName}</span>
        </Link>
      )
    }
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Ngày đăng ký' />,
    cell: ({ row }) => {
      const createdAt = row.getValue('createdAt') as Date
      return (
        <div className='text-muted-foreground text-[13px]'>
          {moment(createdAt).date()} thg {moment(createdAt).month()}, {moment(createdAt).year()}
        </div>
      )
    }
  },
  {
    accessorKey: 'subscribeCount',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Số người đăng ký' />,
    cell: ({ row }) => {
      const channel = row.original
      return <div className='text-[13px] text-muted-foreground'>{channel.subscribeCount} người đăng ký</div>
    }
  },
  {
    accessorKey: 'actions',
    header: 'Hành động',
    cell: () => {
      return <button className='p-0 uppercase text-blue-600 bg-transparent font-medium'>Đăng ký</button>
    }
  }
]
