'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import PATH from '@/constants/path'
import { SubscribedChannelType } from '@/types/subscription.types'
import { ColumnDef } from '@tanstack/react-table'
import moment from 'moment'

import Link from 'next/link'

export const columns: ColumnDef<SubscribedChannelType>[] = [
  {
    accessorKey: 'channelName',
    header: 'Kênh',
    cell: ({ row }) => {
      const avatar = row.getValue('avatar') as string
      const channelName = row.getValue('channelName') as string
      return (
        <Link href={PATH.HOME} className='flex items-center space-x-4'>
          <Avatar className='w-9 h-9'>
            <AvatarImage src={avatar} />
            <AvatarFallback>{channelName[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className='text-[13px] font-medium'>{channelName}</span>
        </Link>
      )
    }
  },
  {
    accessorKey: 'createdAt',
    header: 'Ngày đăng ký',
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
    header: 'Số người đăng ký',
    cell: ({ row }) => {
      const subscribeCount = row.getValue('subscribeCount') as number
      return <div className='text-[13px] text-muted-foreground'>{subscribeCount} người đăng ký</div>
    }
  },
  {
    accessorKey: 'actions',
    header: 'Hành động'
  }
]
