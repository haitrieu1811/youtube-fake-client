'use client'

import { useMutation } from '@tanstack/react-query'
import { LogOut, Settings, UserCircle, Youtube } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useContext } from 'react'

import accountApis from '@/apis/account.apis'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import PATH from '@/constants/path'
import useIsClient from '@/hooks/useIsClient'
import { AppContext } from '@/providers/app-provider'
import MainHeaderSearch from './main-header-search'
import ModeToggle from './mode-toggle'
import { Button } from './ui/button'

const ACCOUNT_LINKS = [
  {
    icon: Settings,
    text: 'Cài đặt',
    href: '/'
  }
]

const MainHeader = () => {
  const { isAuthenticated, account, setIsAuthenticated, setAccount } = useContext(AppContext)
  const { isClient } = useIsClient()
  const router = useRouter()

  // Mutation: Đăng xuất
  const logoutMutation = useMutation({
    mutationKey: ['logout'],
    mutationFn: accountApis.logout,
    onSuccess: () => {
      setIsAuthenticated(false)
      setAccount(null)
      router.push(PATH.LOGIN)
      router.refresh()
    }
  })

  // Đăng xuất
  const handleLogout = () => {
    logoutMutation.mutate()
  }

  return (
    <header className='bg-background border-b border-b-border h-14 flex items-center justify-between px-10 sticky top-0 left-0 right-0 z-[999]'>
      {/* Logo */}
      <Link href={PATH.HOME} className='flex items-center space-x-2'>
        <Youtube size={30} strokeWidth={1} />
        <span className='font-bold text-lg'>YouTube</span>
      </Link>

      {/* Search */}
      <MainHeaderSearch />

      <div className='flex items-center space-x-6'>
        <ModeToggle />

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
            <DropdownMenuTrigger className='outline-none'>
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
                  <h2 className='font-medium text-accent-foreground'>{account.channelName}</h2>
                  <div className='text-muted-foreground text-sm'>@{account.username}</div>
                  <Link href={PATH.CHANNEL} className='text-sm text-blue-600 mt-2 inline-block'>
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
              <DropdownMenuItem className='space-x-4 px-4 py-2.5 hover:cursor-pointer' onClick={handleLogout}>
                <LogOut size={18} strokeWidth={1.5} />
                <span>Đăng xuất</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  )
}

export default MainHeader
