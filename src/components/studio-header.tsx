'use client'

import { ListPlus, PenSquare, PlaySquare, PlusSquare, Youtube } from 'lucide-react'
import Link from 'next/link'
import { useContext } from 'react'

import PATH from '@/constants/path'
import { AppContext } from '@/providers/app-provider'
import { AccountType } from '@/types/account.types'
import AccountDropdown from './account-dropdown'
import StudioHeaderSearch from './studio-header-search'
import { Button } from './ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'

const StudioHeader = () => {
  const { account } = useContext(AppContext)

  return (
    <header className='bg-background border-b border-b-border h-14 flex items-center justify-between px-10 sticky top-0 left-0 right-0 z-10'>
      {/* Logo */}
      <Link href={PATH.STUDIO} className='flex items-center space-x-2'>
        <Youtube size={30} strokeWidth={1} />
        <span className='font-bold text-2xl'>Studio</span>
      </Link>

      {/* Search */}
      <StudioHeaderSearch />

      <div className='flex items-center'>
        {/* Nút tạo */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='mr-5 space-x-3 rounded-sm'>
              <PlusSquare size={20} className='stroke-red-500' />
              <span className='uppercase'>Tạo</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='px-0 py-2 dark:bg-zinc-900'>
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
        {/* Hiển thị account dropdown khi đã đăng nhập */}
        <AccountDropdown accountData={account as AccountType} />
      </div>
    </header>
  )
}

export default StudioHeader
