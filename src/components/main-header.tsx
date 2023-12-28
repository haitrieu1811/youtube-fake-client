'use client'

import Tippy from '@tippyjs/react/headless'
import { Loader2, Search, X, Youtube } from 'lucide-react'
import Link from 'next/link'
import { ChangeEvent, useRef, useState } from 'react'

import PATH from '@/constants/path'
import SearchItem from './search-item'
import { Button } from './ui/button'

const MainHeader = () => {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [isLoading] = useState<boolean>(false)

  const searchBoxRef = useRef<HTMLInputElement>(null)

  const handleChangeSearchQuery = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleClearSearchQuery = () => {
    setSearchQuery('')
    searchBoxRef.current?.focus()
  }

  return (
    <header className='bg-background border-b border-b-border h-14 flex items-center justify-between px-10'>
      {/* Logo */}
      <Link href={PATH.HOME} className='flex items-center space-x-2'>
        <Youtube size={50} strokeWidth={1} />
        <span className='font-bold text-xl'>YouTube</span>
      </Link>

      {/* Search */}
      <div className='flex relative'>
        <Tippy
          visible
          interactive
          placement='bottom-end'
          offset={[0, 5]}
          render={() => (
            <div className='w-[550px] py-4 bg-white rounded-lg border border-border'>
              {Array(10)
                .fill(0)
                .map((_, index) => (
                  <SearchItem key={index} />
                ))}
            </div>
          )}
        >
          <input
            ref={searchBoxRef}
            type='text'
            placeholder='Tìm kiếm'
            value={searchQuery}
            onChange={handleChangeSearchQuery}
            className='flex-1 border border-border rounded-l-full outline-none w-[550px] px-5 focus:border-blue-500'
          />
        </Tippy>
        {searchQuery && !isLoading && (
          <Button
            size='icon'
            variant='ghost'
            className='rounded-full absolute top-1/2 -translate-y-1/2 right-[60px]'
            onClick={handleClearSearchQuery}
          >
            <X size={18} />
          </Button>
        )}
        {isLoading && (
          <div className='absolute top-1/2 -translate-y-1/2 right-[60px] '>
            <Loader2 size={18} strokeWidth={1.5} className='animate-spin' />
          </div>
        )}
        <Button variant='secondary' className='rounded-r-full border border-border border-l-0 w-[50px]'>
          <Search size={18} />
        </Button>
      </div>

      {/* Account */}
      <div></div>
    </header>
  )
}

export default MainHeader
