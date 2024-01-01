'use client'

import { useQuery } from '@tanstack/react-query'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { useMemo } from 'react'

import subscriptionApis from '@/apis/subscription.apis'
import overviewImage from '@/assets/images/overview.svg'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import PATH from '@/constants/path'
import { Skeleton } from '@/components/ui/skeleton'

export const metadata: Metadata = {
  title: 'Tùy chỉnh kênh - YouTube',
  description: 'Tùy chỉnh kênh - YouTube'
}

const LIMIT_CHANNELS_SUBSCRIBED_FOR_ME = 3

const StudioClient = () => {
  // Query: Lấy danh sách kênh đã đăng ký cho tôi
  const getChannelsSubscribedForMeQuery = useQuery({
    queryKey: ['getChannelsSubscribedForMe'],
    queryFn: () => subscriptionApis.getSubcribedChannelsForMe()
  })

  // Danh sách kênh đã đăng ký cho tôi
  const channelsSubscribedForMe = useMemo(
    () => getChannelsSubscribedForMeQuery.data?.data.data.channels || [],
    [getChannelsSubscribedForMeQuery.data?.data.data.channels]
  )

  // Số kênh đã đăng ký cho tôi
  const channelsSubscribedForMeCount = useMemo(
    () => getChannelsSubscribedForMeQuery.data?.data.data.pagination.totalRows || 0,
    [getChannelsSubscribedForMeQuery.data?.data.data.pagination.totalRows]
  )

  return (
    <div className='bg-muted'>
      <div className='p-6'>
        <h1 className='font-medium text-[25px] mb-6 tracking-tight'>Trang tổng quan của kênh</h1>
        <div className='grid grid-cols-12 gap-6 items-start'>
          <div className='bg-background border border-border rounded-sm col-span-12 md:col-span-6 lg:col-span-4 h-[520px] p-[10px] transition-all'>
            <div className='h-full flex justify-center items-center flex-col space-y-4 border border-border border-dashed rounded-sm'>
              <Image width={150} height={150} src={overviewImage} alt='' />
              <div className='text-center text-[13px] text-muted-foreground px-10'>
                <div>Bạn có muốn xem các chỉ số cho video gần đây của mình không?</div>
                <div>Hãy đăng tải và xuất bản một video để bắt đầu.</div>
              </div>
              <Button className='rounded-[2px] uppercase text-white bg-blue-700 hover:bg-blue-800' asChild>
                <Link href={PATH.UPLOAD_VIDEO}>Tải video lên</Link>
              </Button>
            </div>
          </div>

          <div className='bg-background border border-border rounded-sm col-span-12 md:col-span-6 lg:col-span-4 px-6 pt-4 pb-6 space-y-[30px] transition-all'>
            <div>
              <h3 className='text-lg font-medium'>Người đăng ký gần đây</h3>
              <div className='text-[13px] text-muted-foreground'>Toàn thời gian</div>
            </div>
            <div className='space-y-[30px]'>
              {channelsSubscribedForMe.slice(0, LIMIT_CHANNELS_SUBSCRIBED_FOR_ME).map((channel) => (
                <Link key={channel._id} href={PATH.HOME} className='flex items-center space-x-4 group'>
                  <Avatar className='w-10 h-10'>
                    <AvatarImage src={channel.avatar} />
                    <AvatarFallback>{channel.channelName[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className='flex-1'>
                    <h4 className='text-[13px] group-hover:text-blue-600'>{channel.channelName}</h4>
                    <div className='text-xs text-muted-foreground group-hover:text-blue-600'>
                      {channel.subscribeCount} người đăng ký
                    </div>
                  </div>
                </Link>
              ))}
              {getChannelsSubscribedForMeQuery.isLoading &&
                Array(LIMIT_CHANNELS_SUBSCRIBED_FOR_ME)
                  .fill(0)
                  .map((_, index) => <Skeleton key={index} className='w-3/4 h-10' />)}
            </div>
            {channelsSubscribedForMeCount < LIMIT_CHANNELS_SUBSCRIBED_FOR_ME && (
              <Link
                href={PATH.STUDIO_SUBSCRIPTIONS}
                className='uppercase font-medium text-blue-600 text-sm inline-block'
              >
                Xem tất cả
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudioClient
