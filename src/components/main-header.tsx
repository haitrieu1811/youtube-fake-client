'use client'

import { ListPlus, Menu, PenSquare, PlaySquare, PlusSquare, UserCircle, Youtube } from 'lucide-react'
import Link from 'next/link'
import { useContext } from 'react'

import PATH from '@/constants/path'
import useIsClient from '@/hooks/useIsClient'
import { AppContext } from '@/providers/app-provider'
import AccountDropdown from './account-dropdown'
import MainHeaderSearch from './main-header-search'
import { Button } from './ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'

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

      {/* Tìm kiếm */}
      <MainHeaderSearch />
      <div className='flex items-center'>
        {/* Nút tạo */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='icon' className='rounded-full mr-5 w-10 h-10'>
              <PlusSquare size={20} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='px-0 py-2'>
            <DropdownMenuItem className='space-x-3 pr-10 pl-5 py-2 cursor-pointer' asChild>
              <Link href={PATH.UPLOAD_VIDEO}>
                <PlaySquare size={20} strokeWidth={1.5} />
                <span>Tải video lên</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className='space-x-3 pr-10 pl-5 py-2 cursor-pointer'>
              <PenSquare size={20} strokeWidth={1.5} />
              <span>Tạo bài viết</span>
            </DropdownMenuItem>
            <DropdownMenuItem className='space-x-3 pr-10 pl-5 py-2 cursor-pointer'>
              <ListPlus size={20} strokeWidth={1.5} />
              <span>Danh sách phát mới</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {/*  Hiển thị nút đăng nhập khi chưa đăng nhập */}
        {!isAuthenticated && isClient && (
          <Button variant='outline' className='rounded-full hover:bg-blue-300/10 space-x-2' asChild>
            <Link href={PATH.LOGIN}>
              <UserCircle size={18} className='stroke-blue-500' />
              <span className='text-blue-500 font-medium'>Đăng nhập</span>
            </Link>
          </Button>
        )}
        {/* Hiển thị account dropdown khi đã đăng nhập */}
        {isAuthenticated && account && isClient && <AccountDropdown accountData={account} />}
      </div>
    </header>
  )
}

export default MainHeader
