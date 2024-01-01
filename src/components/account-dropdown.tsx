'use client'

import { useMutation } from '@tanstack/react-query'
import Tippy from '@tippyjs/react/headless'
import { ArrowLeft, Check, ChevronRight, LogOut, MonitorPlay, Moon, Settings } from 'lucide-react'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Fragment, useContext, useMemo, useState } from 'react'

import accountApis from '@/apis/account.apis'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import PATH from '@/constants/path'
import { AppContext } from '@/providers/app-provider'
import { AccountType } from '@/types/account.types'
import { Button } from './ui/button'
import { Separator } from './ui/separator'

type AccountDropdownProps = {
  accountData: AccountType
}

const modes = [
  {
    value: 'system',
    text: 'Dùng giao diện của thiết bị'
  },
  {
    value: 'dark',
    text: 'Giao diện tối'
  },
  {
    value: 'light',
    text: 'Giao diện sáng'
  }
]

const modeToVietnamese = {
  system: 'Giao diện thiết bị',
  dark: 'Tối',
  light: 'Sáng'
}

const AccountDropdown = ({ accountData }: AccountDropdownProps) => {
  const router = useRouter()
  const { setTheme, theme } = useTheme()
  const [isParentMenu, setIsParentMenu] = useState<boolean>(true)
  const { setIsAuthenticated, setAccount } = useContext(AppContext)

  // Mutation: Đăng xuất
  const logoutMutation = useMutation({
    mutationKey: ['logout'],
    mutationFn: accountApis.logout,
    onSuccess: () => {
      setIsAuthenticated(false)
      setAccount(null)
      router.push(PATH.LOGIN)
      router.refresh()
    }
  })

  // Xử lý đăng xuất
  const handleLogout = () => {
    logoutMutation.mutate()
  }

  // Vào menu con
  const nextToChildrenMenu = () => {
    setIsParentMenu(false)
  }

  // Trờ về menu cha
  const backtoParentMenu = () => {
    setIsParentMenu(true)
  }

  const accountMenus = useMemo(
    () => [
      {
        icon: Moon,
        text: `Giao diện: ${modeToVietnamese[theme as 'system' | 'dark' | 'light']}`,
        isHasChildrenMenu: true,
        onClick: nextToChildrenMenu
      },
      {
        icon: MonitorPlay,
        text: 'YouTube Studio',
        onClick: () => router.push(PATH.STUDIO)
      },
      {
        icon: Settings,
        text: 'Cài đặt'
      },
      {
        icon: LogOut,
        text: 'Đăng xuất',
        onClick: handleLogout
      }
    ],
    [theme]
  )

  return (
    <Tippy
      interactive
      trigger='click'
      placement='bottom-end'
      offset={[0, 10]}
      onHidden={backtoParentMenu}
      render={() => (
        <div className='w-[300px] bg-white dark:bg-zinc-900 rounded-lg shadow-lg border border-border'>
          {/* Menu cha */}
          {isParentMenu && (
            <Fragment>
              <div className='p-4 flex space-x-4'>
                <Avatar className='w-10 h-10'>
                  <AvatarImage src={accountData.avatar} />
                  <AvatarFallback className='text-sm font-semibold'>
                    {accountData.username[0].toUpperCase()}{' '}
                  </AvatarFallback>
                </Avatar>
                <div className='flex-1'>
                  <h2 className='font-medium text-accent-foreground'>{accountData.channelName}</h2>
                  <div className='text-muted-foreground text-sm'>@{accountData.username}</div>
                  <Link href={PATH.CHANNEL} className='text-sm text-blue-600 mt-2 inline-block'>
                    Xem kênh của bạn
                  </Link>
                </div>
              </div>
              <Separator />
              <div className='py-2'>
                {accountMenus.map((item) => (
                  <Button
                    key={item.text}
                    variant='ghost'
                    className='flex justify-between items-center rounded-none w-full px-4 py-2.5 font-normal'
                    onClick={item.onClick}
                  >
                    <div className='space-x-4 flex items-center'>
                      <item.icon size={18} strokeWidth={1.5} />
                      <span>{item.text}</span>
                    </div>
                    {item.isHasChildrenMenu && <ChevronRight size={20} strokeWidth={1.5} />}
                  </Button>
                ))}
              </div>
            </Fragment>
          )}
          {/* Cài đặt giao diện */}
          {!isParentMenu && (
            <Fragment>
              <div className='flex items-center space-x-4 p-2 border-b border-b-border'>
                <Button variant='ghost' size='icon' className='rounded-full' onClick={backtoParentMenu}>
                  <ArrowLeft strokeWidth={1.5} />
                </Button>
                <h3>Giao diện</h3>
              </div>
              <div className='text-xs pl-5 pr-10 py-3 text-muted-foreground'>
                Tùy chọn cài đặt chỉ áp dụng cho trình duyệt này
              </div>
              <div className='pb-2'>
                {modes.map((mode) => (
                  <Button
                    key={mode.value}
                    variant='ghost'
                    className='flex justify-start items-center rounded-none w-full pl-0 pr-4 py-4 font-normal'
                    onClick={() => setTheme(mode.value)}
                  >
                    <span className='w-[50px] flex justify-center items-center'>
                      {mode.value === theme && <Check size={18} strokeWidth={1.5} />}
                    </span>
                    {mode.text}
                  </Button>
                ))}
              </div>
            </Fragment>
          )}
        </div>
      )}
    >
      <Avatar className='w-8 h-8 cursor-pointer'>
        <AvatarImage src={accountData.avatar} />
        <AvatarFallback className='text-sm font-semibold'>{accountData.username[0].toUpperCase()} </AvatarFallback>
      </Avatar>
    </Tippy>
  )
}

export default AccountDropdown
