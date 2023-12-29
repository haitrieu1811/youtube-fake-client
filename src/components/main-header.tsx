'use client'

import { UserCircle, Youtube } from 'lucide-react'
import Link from 'next/link'

import PATH from '@/constants/path'
import MainHeaderSearch from './main-header-search'
import { Button } from './ui/button'

const MainHeader = () => {
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
        <Button variant='outline' className='rounded-full hover:bg-blue-300/10 space-x-2' asChild>
          <Link href={PATH.LOGIN}>
            <UserCircle size={18} className='stroke-blue-500' />
            <span className='text-blue-500 font-medium'>Đăng nhập</span>
          </Link>
        </Button>
      </div>
    </header>
  )
}

export default MainHeader
