'use client'

import { PlusSquare, Youtube } from 'lucide-react'
import Link from 'next/link'
import { useContext } from 'react'

import PATH from '@/constants/path'
import useIsClient from '@/hooks/useIsClient'
import { AppContext } from '@/providers/app-provider'
import AccountDropdown from './account-dropdown'
import CreateContent from './create-content'
import StudioHeaderSearch from './studio-header-search'
import { Button } from './ui/button'
import { Skeleton } from './ui/skeleton'

const StudioHeader = () => {
  const { account } = useContext(AppContext)
  const { isClient } = useIsClient()
  const isClientWithAccount = !!(account && isClient)

  return (
    <header className='bg-background border-b border-b-border h-14 flex items-center justify-between px-10 sticky top-0 left-0 right-0 z-10 transition-all'>
      {/* Logo */}
      <Link href={PATH.STUDIO} className='flex items-center space-x-2'>
        <Youtube size={30} strokeWidth={1} />
        <span className='font-bold text-2xl'>Studio</span>
      </Link>
      {/* Search */}
      <StudioHeaderSearch />
      <div className='flex items-center'>
        {/* Create button */}
        <CreateContent>
          <Button variant='outline' className='mr-5 space-x-3 rounded-sm'>
            <PlusSquare size={20} className='stroke-red-500 dark:stroke-red-400' />
            <span className='uppercase'>Tạo</span>
          </Button>
        </CreateContent>
        {/* Hiển thị account dropdown khi đã đăng nhập */}
        {isClientWithAccount && <AccountDropdown accountData={account} />}
        {!isClientWithAccount && <Skeleton className='w-8 h-8 rounded-full' />}
      </div>
    </header>
  )
}

export default StudioHeader
