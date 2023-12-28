'use client'

import { Youtube } from 'lucide-react'
import Link from 'next/link'

import PATH from '@/constants/path'
import MainHeaderSearch from './main-header-search'

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
      <div></div>
    </header>
  )
}

export default MainHeader
