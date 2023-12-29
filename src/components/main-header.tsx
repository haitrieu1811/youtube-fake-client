'use client'

import { LogOut, Settings, UserCircle, Youtube } from 'lucide-react'
import Link from 'next/link'
import { useContext } from 'react'

import PATH from '@/constants/path'
import MainHeaderSearch from './main-header-search'
import { Button } from './ui/button'
import { AppContext } from '@/providers/app-provider'
import useIsClient from '@/hooks/useIsClient'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

const ACCOUNT_LINKS = [
  {
    icon: LogOut,
    text: 'Đăng xuất',
    href: '/'
  },
  {
    icon: Settings,
    text: 'Cài đặt',
    href: '/'
  }
]

const MainHeader = () => {
  const { isAuthenticated, account } = useContext(AppContext)
  const { isClient } = useIsClient()

  return (
    <header className='bg-background border-b border-b-border h-14 flex items-center justify-between px-10'>
      {/* Logo */}
      <Link href={PATH.HOME} className='flex items-center space-x-2'>
        <Youtube size={50} strokeWidth={1} />
        <span className='font-bold text-xl'>YouTube</span>
      </Link>

      {/* Search */}
      <MainHeaderSearch />

      {/* Account */}
      <div>
        {!isAuthenticated && isClient && (
          <Button variant='outline' className='rounded-full hover:bg-blue-300/10 space-x-2' asChild>
            <Link href={PATH.LOGIN}>
              <UserCircle size={18} className='stroke-blue-500' />
              <span className='text-blue-500 font-medium'>Đăng nhập</span>
            </Link>
          </Button>
        )}

        {isAuthenticated && account && isClient && (
          <DropdownMenu>
            <DropdownMenuTrigger className='rounded-full'>
              <Avatar className='w-8 h-8'>
                <AvatarImage src={account.avatar} />
                <AvatarFallback className='text-sm font-semibold'>{account.username[0].toUpperCase()} </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-[300px]'>
              <div className='p-4 flex space-x-4'>
                <Avatar className='w-10 h-10'>
                  <AvatarImage src={account.avatar} />
                  <AvatarFallback className='text-sm font-semibold'>
                    {account.username[0].toUpperCase()}{' '}
                  </AvatarFallback>
                </Avatar>
                <div className='flex-1'>
                  <h2>{account.channelName}</h2>
                  <div>@{account.username}</div>
                  <Link href={'/'} className='text-sm text-blue-600 mt-2 inline-block'>
                    Xem kênh của bạn
                  </Link>
                </div>
              </div>
              <DropdownMenuSeparator />
              {ACCOUNT_LINKS.map((item) => (
                <DropdownMenuItem key={item.text} className='space-x-4 px-4 py-2.5 hover:cursor-pointer' asChild>
                  <Link href={item.href}>
                    <item.icon size={18} strokeWidth={1.5} />
                    <span>{item.text}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  )
}

export default MainHeader
