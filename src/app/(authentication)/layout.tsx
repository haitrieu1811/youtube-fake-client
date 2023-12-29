'use client'

import { Youtube } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

import { buttonVariants } from '@/components/ui/button'
import PATH from '@/constants/path'
import { cn } from '@/lib/utils'

const AuthenticationLayout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname()

  return (
    <div className='container relative hidden h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <Link
        href={pathname === PATH.LOGIN ? PATH.REGISTER : PATH.LOGIN}
        className={cn(buttonVariants({ variant: 'ghost' }), 'absolute right-4 top-4 md:right-8 md:top-8')}
      >
        {pathname === PATH.LOGIN ? 'Đăng ký' : 'Đăng nhập'}
      </Link>
      <div className='relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r'>
        <div className='absolute inset-0 bg-zinc-900' />
        <Link href={PATH.HOME} className='relative z-20 flex items-center text-lg font-medium space-x-2'>
          <Youtube size={24} />
          <span>YouTube</span>
        </Link>
      </div>
      <div className='lg:p-8'>{children}</div>
    </div>
  )
}

export default AuthenticationLayout
