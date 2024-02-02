'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import classNames from 'classnames'

import { STUDIO_SIDEBAR_LINKS } from './studio-sidebar'

const StudioMenuMobile = () => {
  const pathname = usePathname()

  return (
    <div className='border-t border-t-border bg-background flex'>
      {STUDIO_SIDEBAR_LINKS.map((item) => {
        const isActive = item.href === pathname
        return (
          <Link
            key={item.href}
            href={item.href}
            className='flex-auto flex justify-center items-center flex-col space-y-1 py-2'
          >
            <item.icon
              strokeWidth={1.5}
              size={20}
              className={classNames({
                'stroke-red-500': isActive
              })}
            />
            <span
              className={classNames({
                'text-xs text-center line-clamp-1': true,
                'text-muted-foreground': !isActive,
                'text-red-500': isActive
              })}
            >
              {item.text}
            </span>
          </Link>
        )
      })}
    </div>
  )
}

export default StudioMenuMobile
