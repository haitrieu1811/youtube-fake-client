'use client'

import { CheckCircle2, ChevronDown, Flag, MoreVertical, ThumbsDown, ThumbsUp } from 'lucide-react'
import Link from 'next/link'
import classNames from 'classnames'
import { useContext } from 'react'

import { AppContext } from '@/providers/app-provider'
import CommentInput from './comment-input'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'

type CommentItemProps = {
  isRootComment?: boolean
}

const CommentItem = ({ isRootComment = true }: CommentItemProps) => {
  const { account } = useContext(AppContext)

  return (
    <div className='flex items-start space-x-4 group'>
      <Link href={'/'} className='flex-shrink-0'>
        <Avatar
          className={classNames({
            'w-6 h-6': !isRootComment
          })}
        >
          <AvatarImage />
          <AvatarFallback
            className={classNames({
              'text-xs': !isRootComment
            })}
          >
            T
          </AvatarFallback>
        </Avatar>
      </Link>
      <div className='flex-1 space-y-1'>
        <div className='flex items-center space-x-3'>
          <div className='flex items-center space-x-1'>
            <h4 className='text-[13px] font-medium'>@retrositeclothing</h4>
            <CheckCircle2 size={12} className='fill-blue-600 dark:fill-blue-500 stroke-background' />
          </div>
          <div className='text-muted-foreground text-xs'>1 tháng trước</div>
        </div>
        <div className='text-sm'>
          I wanted to take a moment to appreciate this guy . Before i was a B grade student and at that time my main
          problem was i was lazy and just coudn't concentrate but after studying simultaneous with you man i just can't
          stop scoring straight A's . My friends asked me what's my secert so i recommended them your channel . BTW lots
          of love from INDIA .
        </div>
        <div className='flex items-center space-x-3 -ml-2'>
          <div className='space-x-1 flex items-center'>
            <Button variant='ghost' size='icon' className='rounded-full'>
              <ThumbsUp strokeWidth={1.5} size={16} />
            </Button>
            <span className='text-xs text-muted-foreground'>21</span>
          </div>
          <div className='space-x-1 flex items-center'>
            <Button variant='ghost' size='icon' className='rounded-full'>
              <ThumbsDown strokeWidth={1.5} size={16} />
            </Button>
            <span className='text-xs text-muted-foreground'>21</span>
          </div>
          <Button variant='ghost' className='text-xs rounded-full'>
            Phản hồi
          </Button>
        </div>
        {account && <CommentInput accountData={account} />}
        {isRootComment && (
          <Button
            variant='ghost'
            className='rounded-full space-x-2 text-blue-600 hover:text-blue-600 hover:bg-blue-500/10 -ml-3.5'
          >
            <ChevronDown size={16} />
            <span>28 phản hồi</span>
          </Button>
        )}
      </div>
      <Popover>
        <PopoverTrigger className='opacity-0 group-hover:opacity-100' asChild>
          <Button size='icon' variant='ghost' className='flex-shrink-0 rounded-full'>
            <MoreVertical size={18} />
          </Button>
        </PopoverTrigger>
        <PopoverContent align='start' className='p-0 w-auto flex flex-col py-2 rounded-xl'>
          <Button variant='ghost' className='space-x-3 justify-start rounded-none pr-10'>
            <Flag size={18} strokeWidth={1.5} />
            <span>Báo vi phạm</span>
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default CommentItem
