'use client'

import { useQuery } from '@tanstack/react-query'
import classNames from 'classnames'
import {
  CalendarPlus,
  ChevronDown,
  Clock,
  History,
  Home,
  ListVideo,
  ThumbsUp,
  User,
  UserCircle,
  UsersRound
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Fragment, useContext, useMemo } from 'react'

import subscriptionApis from '@/apis/subscription.apis'
import PATH from '@/constants/path'
import useIsClient from '@/hooks/useIsClient'
import usePlaylists from '@/hooks/usePlaylists'
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
    href: PATH.WATCH_LATER
  }
]

const SUBSCRIBED_ACOUNTS_LIMIT = 7

const MainSidebar = () => {
  const pathname = usePathname()
  const { isAuthenticated } = useContext(AppContext)
  const { isClient } = useIsClient()
  const isClientWithAuthenticated = isAuthenticated && isClient
  const { playlists, getMyPlaylistsQuery } = usePlaylists({})

  // Query: Get my subscribed accounts
  const getMySubscribedAccountsQuery = useQuery({
    queryKey: ['getMySubscribedAccounts'],
    queryFn: () => subscriptionApis.getMySubscribedAccounts(),
    enabled: isAuthenticated
  })

  // My subscribed accounts
  const mySubscribedAccounts = useMemo(
    () => getMySubscribedAccountsQuery.data?.data.data.accounts || [],
    [getMySubscribedAccountsQuery.data?.data.data.accounts]
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
                  <item.icon size={18} strokeWidth={1.5} />
                  <span>{item.text}</span>
                </Link>
              </Button>
            )
          })}
        </div>
        {isClientWithAuthenticated && (
          <Fragment>
            <Separator />
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
                    <item.icon size={18} strokeWidth={1.5} className='flex-shrink-0' />
                    <span className='line-clamp-1'>{item.text}</span>
                  </Link>
                </Button>
              ))}
            </div>
            {mySubscribedAccounts.length > 0 && (
              <Fragment>
                <Separator />
                <div className='space-y-1'>
                  <h2 className='font-semibold px-4 mb-4'>Kênh đăng ký</h2>
                  {mySubscribedAccounts.slice(0, SUBSCRIBED_ACOUNTS_LIMIT).map((account) => (
                    <Button
                      key={account._id}
                      variant='ghost'
                      className='w-full flex justify-start space-x-5 font-normal'
                      asChild
                    >
                      <Link href={PATH.PROFILE(account.username)}>
                        <Avatar className='w-6 h-6'>
                          <AvatarImage src={account.avatar} className='object-cover' />
                          <AvatarFallback className='text-xs'>{account.channelName[0].toUpperCase()} </AvatarFallback>
                        </Avatar>
                        <span>{account.channelName}</span>
                      </Link>
                    </Button>
                  ))}
                  {mySubscribedAccounts.length > SUBSCRIBED_ACOUNTS_LIMIT && (
                    <Button variant='ghost' className='w-full flex justify-start space-x-5 font-normal'>
                      <ChevronDown strokeWidth={1.5} size={18} />
                      <span className='line-clamp-1'>Hiển thị thêm</span>
                    </Button>
                  )}
                </div>
              </Fragment>
            )}
          </Fragment>
        )}
        {playlists.length > 0 && !getMyPlaylistsQuery.isLoading && (
          <Fragment>
            <Separator />
            <div className='space-y-1'>
              <h2 className='font-semibold px-4 mb-4'>Danh sách phát</h2>
              {playlists
                .filter((playlist) => playlist.videoCount > 0)
                .map((playlist) => (
                  <Button
                    key={playlist._id}
                    variant='ghost'
                    disabled={PATH.PLAYLIST_DETAIL(playlist._id) === pathname}
                    className={classNames({
                      'w-full flex justify-start space-x-5 font-normal': true,
                      'bg-accent font-medium': PATH.PLAYLIST_DETAIL(playlist._id) === pathname
                    })}
                    asChild
                  >
                    <Link href={PATH.PLAYLIST_DETAIL(playlist._id)}>
                      <ListVideo size={18} strokeWidth={1.5} className='flex-shrink-0' />
                      <span className='line-clamp-1'>{playlist.name}</span>
                    </Link>
                  </Button>
                ))}
              {getMyPlaylistsQuery.hasNextPage && (
                <Button
                  variant='ghost'
                  className='w-full justify-start'
                  onClick={() => getMyPlaylistsQuery.fetchNextPage()}
                >
                  <ChevronDown size={20} strokeWidth={1.5} className='mr-2' />
                  Hiển thị thêm
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
