'use client'

import { useQuery } from '@tanstack/react-query'
import classNames from 'classnames'
import { CalendarPlus, ChevronDown, Clock, History, Home, ThumbsUp, User, UserCircle, UsersRound } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Fragment, useContext, useMemo } from 'react'

import subscriptionApis from '@/apis/subscription.apis'
import PATH from '@/constants/path'
import useIsClient from '@/hooks/useIsClient'
import { AppContext } from '@/providers/app-provider'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Separator } from './ui/separator'

const MAIN_LINKS = [
  {
    icon: Home,
    text: 'Trang chủ',
    href: PATH.HOME
  },
  {
    icon: UsersRound,
    text: 'Cộng đồng',
    href: PATH.COMMUNITY
  },
  {
    icon: CalendarPlus,
    text: 'Kênh đăng ký',
    href: PATH.SUBSCRIPTIONS
  }
]

const ME_LINKS = [
  {
    icon: User,
    text: 'Kênh của bạn',
    href: PATH.CHANNEL
  },
  {
    icon: History,
    text: 'Video đã xem',
    href: PATH.HISTORY
  },
  {
    icon: ThumbsUp,
    text: 'Video đã thích',
    href: PATH.LIKED
  },
  {
    icon: Clock,
    text: 'Xem sau',
    href: PATH.SUBSCRIPTIONS
  }
]

const SUBSCRIBED_CHANNELS_LIMIT = 7

const MainSidebar = () => {
  const pathname = usePathname()
  const { isAuthenticated } = useContext(AppContext)
  const { isClient } = useIsClient()
  const isClientWithAuthenticated = isAuthenticated && isClient

  // Query: Lấy danh sách kênh đã đăng ký
  const getSubscribedChannelsQuery = useQuery({
    queryKey: ['getSubscribedChannels'],
    queryFn: () => subscriptionApis.getSubcribedChannels(),
    enabled: isAuthenticated
  })

  // Danh sách kênh đã đăng ký
  const subscribedChannels = useMemo(
    () => getSubscribedChannelsQuery.data?.data.data.channels || [],
    [getSubscribedChannelsQuery.data?.data.data.channels]
  )

  return (
    <aside className='w-full transition-all'>
      <div className='px-4 space-y-4'>
        <div className='space-y-1'>
          {MAIN_LINKS.map((item) => {
            const isActive = item.href === pathname
            return (
              <Button
                key={item.text}
                variant='ghost'
                disabled={isActive}
                className={classNames({
                  'w-full flex justify-start space-x-5 font-normal': true,
                  'bg-accent font-medium': isActive
                })}
                asChild
              >
                <Link href={item.href}>
                  <item.icon size={16} strokeWidth={1.5} />
                  <span>{item.text}</span>
                </Link>
              </Button>
            )
          })}
        </div>
        <Separator />
        {isClientWithAuthenticated && (
          <Fragment>
            <div className='space-y-1'>
              <h2 className='font-semibold px-4 mb-4'>Bạn</h2>
              {ME_LINKS.map((item) => (
                <Button
                  key={item.text}
                  variant='ghost'
                  disabled={item.href === pathname}
                  className={classNames({
                    'w-full flex justify-start space-x-5 font-normal': true,
                    'bg-accent font-medium': item.href === pathname
                  })}
                  asChild
                >
                  <Link href={item.href}>
                    <item.icon size={16} strokeWidth={1.5} />
                    <span>{item.text}</span>
                  </Link>
                </Button>
              ))}
            </div>
            <Separator />
            <div className='space-y-1'>
              <h2 className='font-semibold px-4 mb-4'>Kênh đăng ký</h2>
              {subscribedChannels.slice(0, SUBSCRIBED_CHANNELS_LIMIT).map((channel) => (
                <Button
                  key={channel._id}
                  variant='ghost'
                  className='w-full flex justify-start space-x-5 font-normal'
                  asChild
                >
                  <Link href={PATH.PROFILE(channel.username)}>
                    <Avatar className='w-6 h-6'>
                      <AvatarImage src={channel.avatar} className='object-cover' />
                      <AvatarFallback className='text-xs'>{channel.channelName[0].toUpperCase()} </AvatarFallback>
                    </Avatar>
                    <span>{channel.channelName}</span>
                  </Link>
                </Button>
              ))}
              {subscribedChannels.length > SUBSCRIBED_CHANNELS_LIMIT && (
                <Button variant='ghost' className='w-full flex justify-start space-x-5 font-normal'>
                  <ChevronDown strokeWidth={1.5} size={18} />
                  <span className='line-clamp-1'>Hiển thị thêm</span>
                </Button>
              )}
            </div>
          </Fragment>
        )}
        {!isAuthenticated && isClient && (
          <div className='px-4 space-y-4'>
            <div className='text-sm'>Hãy đăng nhập để thích video, bình luận và đăng ký kênh.</div>
            <Button variant='outline' className='rounded-full hover:bg-blue-300/10 space-x-2' asChild>
              <Link href={PATH.LOGIN}>
                <UserCircle size={18} className='stroke-blue-500' />
                <span className='text-blue-500 font-medium'>Đăng nhập</span>
              </Link>
            </Button>
          </div>
        )}
      </div>
    </aside>
  )
}

export default MainSidebar
