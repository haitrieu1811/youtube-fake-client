'use client'

import { Bell, Menu, PlusSquare, UserCircle, Youtube } from 'lucide-react'
import Link from 'next/link'
import { useContext } from 'react'

import PATH from '@/constants/path'
import useIsClient from '@/hooks/useIsClient'
import { AppContext } from '@/providers/app-provider'
import AccountDropdown from './account-dropdown'
import CreateContent from './create-content'
import MainHeaderSearch from './main-header-search'
import { Badge } from './ui/badge'
import { Button } from './ui/button'

const MainHeader = () => {
  const { isAuthenticated, account, setIsShowSidebar } = useContext(AppContext)
  const { isClient } = useIsClient()
  return (
    <header className='bg-background border-b border-b-border h-14 flex items-center justify-between px-6 sticky top-0 left-0 right-0 z-[9] transition-all'>
      <div className='flex items-center space-x-4'>
        <Button size='icon' variant='ghost' className='rounded-full' onClick={() => setIsShowSidebar(true)}>
          <Menu className='w-5 h-5' strokeWidth={1.5} />
        </Button>
        {/* Logo */}
        <Link href={PATH.HOME} className='flex items-center space-x-2'>
          <Youtube size={30} strokeWidth={1} />
          <span className='font-bold text-lg'>YouTube</span>
        </Link>
      </div>
      {/* Search */}
      <MainHeaderSearch />
      <div className='flex items-center'>
        {/* Create button */}
        <CreateContent>
          <Button variant='ghost' size='icon' className='rounded-full mr-4 w-10 h-10'>
            <PlusSquare size={20} />
          </Button>
        </CreateContent>
        {/* Notification */}
        <div className='mr-4 relative'>
          <Button variant='ghost' size='icon' className='rounded-full w-10 h-10'>
            <Bell size={20} />
          </Button>
          <Badge className='p-0 h-5 px-0.5 rounded-full flex items-center justify-center absolute top-0 right-0 bg-red-500 hover:bg-red-500 text-white'>
            9+
          </Badge>
        </div>
        {/* Show login button when not logged */}
        {!isAuthenticated && isClient && (
          <Button variant='outline' className='rounded-full hover:bg-blue-300/10 space-x-2' asChild>
            <Link href={PATH.LOGIN}>
              <UserCircle size={18} className='stroke-blue-500' />
              <span className='text-blue-500 font-medium'>Đăng nhập</span>
            </Link>
          </Button>
        )}
        {/* Show account dropdown when logged */}
        {isAuthenticated && account && isClient && <AccountDropdown accountData={account} />}
      </div>
    </header>
  )
}

export default MainHeader
