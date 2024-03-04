'use client'

import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import overviewImage from '@/assets/images/overview.svg'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import useAccountsSubscribedToMe from '@/hooks/useAccountsSubscribedToMe'
import PATH from '@/constants/path'

export const metadata: Metadata = {
  title: 'Trang tổng quan - YouTube Studio',
  description: 'Trang tổng quan - YouTube Studio'
}

const LIMIT_CHANNELS_SUBSCRIBED_FOR_ME = 3

const StudioClient = () => {
  const { accountsSubscribedToMe, accountsSubscribedToMeCount, getAccountsSubscribedToMeQuery } =
    useAccountsSubscribedToMe()
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
              <Button className='uppercase rounded-sm bg-blue-500 hover:bg-blue-600' asChild>
                <Link href={PATH.UPLOAD_VIDEO}>Tải video lên</Link>
              </Button>
            </div>
          </div>
          {accountsSubscribedToMe.length > 0 && (
            <div className='bg-background border border-border rounded-sm col-span-12 md:col-span-6 lg:col-span-4 px-6 pt-4 pb-6 space-y-[30px] transition-all'>
              <div>
                <h3 className='text-lg font-medium'>Người đăng ký gần đây</h3>
                <div className='text-[13px] text-muted-foreground'>Toàn thời gian</div>
              </div>
              <div className='space-y-[30px]'>
                {accountsSubscribedToMe.slice(0, LIMIT_CHANNELS_SUBSCRIBED_FOR_ME).map((account) => (
                  <Link key={account._id} href={PATH.HOME} className='flex items-center space-x-4 group'>
                    <Avatar className='w-10 h-10'>
                      <AvatarImage src={account.avatar} />
                      <AvatarFallback>{account.channelName[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className='flex-1'>
                      <h4 className='text-[13px] group-hover:text-blue-600'>{account.channelName}</h4>
                      <div className='text-xs text-muted-foreground group-hover:text-blue-600'>
                        {account.subscribeCount} người đăng ký
                      </div>
                    </div>
                  </Link>
                ))}
                {getAccountsSubscribedToMeQuery.isLoading &&
                  Array(LIMIT_CHANNELS_SUBSCRIBED_FOR_ME)
                    .fill(0)
                    .map((_, index) => <Skeleton key={index} className='w-3/4 h-10' />)}
              </div>
              {accountsSubscribedToMeCount < LIMIT_CHANNELS_SUBSCRIBED_FOR_ME && (
                <Link
                  href={PATH.STUDIO_SUBSCRIPTIONS}
                  className='uppercase font-medium text-sm inline-block text-blue-500 hover:text-blue-600'
                >
                  Xem tất cả
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StudioClient
