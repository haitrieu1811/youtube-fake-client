'use client'

import { Menu, Youtube } from 'lucide-react'
import Link from 'next/link'
import { Fragment, useContext } from 'react'

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import PATH from '@/constants/path'
import useIsClient from '@/hooks/useIsClient'
import MainSidebar from './main-sidebar'
import { Button } from './ui/button'
import { AppContext } from '@/providers/app-provider'

const MainOverlaySidebar = () => {
  const { isClient } = useIsClient()
  const { isShowSidebar, setIsShowSidebar } = useContext(AppContext)

  return (
    <Fragment>
      {isClient && (
        <Sheet open={isShowSidebar} onOpenChange={() => setIsShowSidebar(false)}>
          <SheetContent side='left' className='p-0 w-64'>
            <div className='flex items-center space-x-4 px-6 py-3'>
              <Button size='icon' variant='ghost' className='rounded-full' onClick={() => setIsShowSidebar(false)}>
                <Menu className='w-5 h-5' strokeWidth={1.5} />
              </Button>
              {/* Logo */}
              <Link href={PATH.HOME} className='flex items-center space-x-2'>
                <Youtube size={30} strokeWidth={1} />
                <span className='font-bold text-lg'>YouTube</span>
              </Link>
            </div>
            <MainSidebar />
          </SheetContent>
        </Sheet>
      )}
    </Fragment>
  )
}

export default MainOverlaySidebar
