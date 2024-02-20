'use client'

import classNames from 'classnames'
import { ArrowUpRightSquare, GanttChartSquare, MessageSquareText, Users, Video, Wand } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useContext } from 'react'

import PATH from '@/constants/path'
import useIsClient from '@/hooks/useIsClient'
import { AppContext } from '@/providers/app-provider'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Skeleton } from './ui/skeleton'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'

export const STUDIO_SIDEBAR_LINKS = [
  {
    icon: GanttChartSquare,
    text: 'Trang tổng quan',
    href: PATH.STUDIO
  },
  {
    icon: Video,
    text: 'Nội dung',
    href: PATH.STUDIO_CONTENT
  },
  {
    icon: MessageSquareText,
    text: 'Bình luận',
    href: PATH.STUDIO_COMMENT
  },
  {
    icon: Users,
    text: 'Người đăng ký',
    href: PATH.STUDIO_SUBSCRIPTIONS
  },
  {
    icon: Wand,
    text: 'Tùy chỉnh',
    href: PATH.STUDIO_CUSTOM
  }
]

const StudioSidebar = () => {
  const pathname = usePathname()
  const { account } = useContext(AppContext)
  const { isClient } = useIsClient()
  const isClientWithAccount = !!(account && isClient)

  return (
    <aside className='w-[256px] sticky top-14 left-0 bottom-0 bg-background max-h-[calc(100vh-56px)] overflow-y-auto'>
      <div className='flex justify-center items-center flex-col p-6 space-y-6'>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className='relative group'>
                {isClientWithAccount && (
                  <Avatar className='w-[112px] h-[112px]'>
                    <AvatarImage src={account.avatar} alt={account.channelName} />
                    <AvatarFallback className='text-4xl'>{account.channelName[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                )}
                {!isClientWithAccount && <Skeleton className='w-[112px] h-[112px] rounded-full' />}
                <Link
                  href={PATH.CHANNEL}
                  className='absolute inset-0 bg-black/50 rounded-full flex justify-center items-center opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto'
                >
                  <ArrowUpRightSquare stroke='#fff' strokeWidth={1} />
                </Link>
              </div>
            </TooltipTrigger>
            <TooltipContent>Xem kênh trên YouTube</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className='space-y-1'>
          <div className='text-[15px] font-medium text-center'>Kênh của bạn</div>
          {isClientWithAccount && (
            <div className='text-xs text-muted-foreground text-center'>{account.channelName}</div>
          )}
          {!isClientWithAccount && <Skeleton className='w-[100px] h-4 rounded-sm' />}
        </div>
      </div>
      <div>
        {STUDIO_SIDEBAR_LINKS.map((link) => {
          const isActive = link.href === pathname
          return (
            <Button
              key={link.href}
              variant='ghost'
              disabled={isActive}
              className={classNames({
                'w-full rounded-none justify-start space-x-6 p-6 text-muted-foreground relative before:absolute before:top-0 before:bottom-0 before:left-0 before:w-1 before:bg-red-600':
                  true,
                'bg-muted hover:before:opacity-100': isActive,
                'before:opacity-0': !isActive
              })}
              asChild
            >
              <Link href={link.href}>
                <link.icon
                  size={20}
                  className={classNames({
                    'stroke-red-500': isActive
                  })}
                />
                <span
                  className={classNames({
                    'text-[13px]': true,
                    'text-red-500 font-semibold': isActive
                  })}
                >
                  {link.text}
                </span>
              </Link>
            </Button>
          )
        })}
      </div>
    </aside>
  )
}

export default StudioSidebar
