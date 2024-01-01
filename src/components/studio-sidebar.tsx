'use client'

import { ArrowUpRightSquare, GanttChartSquare, MessageSquareText, Video, Wand } from 'lucide-react'
import Link from 'next/link'
import { Fragment, useContext } from 'react'
import { usePathname } from 'next/navigation'
import classNames from 'classnames'

import PATH from '@/constants/path'
import { AppContext } from '@/providers/app-provider'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'

const LINKS = [
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
    icon: Wand,
    text: 'Tùy chỉnh',
    href: PATH.STUDIO_CUSTOM
  }
]

const StudioSidebar = () => {
  const pathname = usePathname()
  const { account } = useContext(AppContext)

  return (
    <Fragment>
      {account && (
        <aside className='w-[256px] sticky top-14 left-0 right-0'>
          <div className='flex justify-center items-center flex-col p-6 space-y-6 border-b'>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className='relative group'>
                    <Avatar className='w-[112px] h-[112px]'>
                      <AvatarImage src={account.avatar} alt={account.channelName} />
                      <AvatarFallback>{account.channelName[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
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
              <div className='text-[15px] font-medium'>Kênh của bạn</div>
              <div className='text-xs text-muted-foreground'>{account.channelName}</div>
            </div>
          </div>
          <div>
            {LINKS.map((link) => {
              const isActive = link.href === pathname
              return (
                <Button
                  asChild
                  variant='ghost'
                  disabled={isActive}
                  className={classNames({
                    'w-full rounded-none justify-start space-x-6 p-6': true,
                    'bg-muted': isActive
                  })}
                >
                  <Link key={link.href} href={link.href}>
                    <link.icon
                      size={20}
                      className={classNames({
                        'stroke-red-600': isActive
                      })}
                    />
                    <span
                      className={classNames({
                        'text-[15px]': true,
                        'text-red-600': isActive
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
      )}
    </Fragment>
  )
}

export default StudioSidebar
