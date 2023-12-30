'use client'

import { useQuery } from '@tanstack/react-query'
import { Camera } from 'lucide-react'
import { useMemo } from 'react'

import accountApis from '@/apis/account.apis'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'

const ChannelPage = () => {
  // Query: Get me
  const getMeQuery = useQuery({
    queryKey: ['getMe'],
    queryFn: () => accountApis.getMe()
  })

  // Me
  const me = useMemo(() => getMeQuery.data?.data.data.me, [getMeQuery.data?.data.data.me])

  return (
    <TooltipProvider>
      {me && (
        <div className='px-24'>
          <div
            className='relative h-[170px] bg-muted bg-center bg-cover mt-2 rounded-lg group cursor-pointer'
            style={{
              backgroundImage: me.cover ? `url(${me.cover})` : undefined
            }}
          >
            <Tooltip>
              <TooltipTrigger className='absolute top-2 right-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto'>
                <Button variant='ghost' className='rounded-full'>
                  <Camera strokeWidth={1.5} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Cập nhật ảnh bìa</TooltipContent>
            </Tooltip>
            {false && (
              <div className='flex justify-end items-center space-x-2 absolute bottom-0 left-0 right-0 bg-muted-foreground/20 px-4 py-2'>
                <Button variant='secondary' className='rounded-full'>
                  Hủy
                </Button>
                <Button className='rounded-full'>Lưu lại</Button>
              </div>
            )}
          </div>

          <div className='mt-4 flex space-x-6'>
            <div className='relative group hover:cursor-pointer'>
              <Avatar className='w-[160px] h-[160px]'>
                <AvatarImage src={me.avatar} className='object-cover' />
                <AvatarFallback className='text-sm font-semibold'>{me.username[0].toUpperCase()} </AvatarFallback>
              </Avatar>
              <Tooltip>
                <TooltipTrigger className='absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto'>
                  <Button className='w-[50px] h-[50px] rounded-full bg-black/50 hover:bg-black/50'>
                    <Camera strokeWidth={1.5} className='flex-shrink-0' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Chỉnh sửa ảnh hồ sơ</TooltipContent>
              </Tooltip>
              {false && (
                <div className='flex justify-center items-center space-x-2 absolute bottom-0 left-0 right-0 bg-muted-foreground/20 px-4 py-2'>
                  <Button variant='secondary' size='sm' className='rounded-full'>
                    Hủy
                  </Button>
                  <Button size='sm' className='rounded-full'>
                    Lưu lại
                  </Button>
                </div>
              )}
            </div>
            <div className='flex-1 space-y-4'>
              <h2 className='font-bold text-4xl'>{me.channelName}</h2>
              <div className='flex items-center space-x-3'>
                <div className='text-sm text-muted-foreground'>@{me.username}</div>
                <span className='w-1 h-1 rounded-full bg-muted-foreground' />
                <div className='text-sm text-muted-foreground'>{me.subscriptionCount} người đăng ký</div>
                <span className='w-1 h-1 rounded-full bg-muted-foreground' />
                <div className='text-sm text-muted-foreground'>{me.videoCount} video</div>
              </div>
              <div className='space-x-4'>
                <Button variant='secondary' className='rounded-full'>
                  Tùy chỉnh kênh
                </Button>
                <Button variant='secondary' className='rounded-full'>
                  Quản lý video
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </TooltipProvider>
  )
}

export default ChannelPage
