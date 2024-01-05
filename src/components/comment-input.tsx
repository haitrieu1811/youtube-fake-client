import classNames from 'classnames'

import { AccountType } from '@/types/account.types'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'

type CommentInputProps = {
  accountData: AccountType
  isRootComment?: boolean
}

const CommentInput = ({ accountData, isRootComment = false }: CommentInputProps) => {
  return (
    <div className='flex items-start space-x-5'>
      <Avatar
        className={classNames({
          'flex-shrink-0': true,
          'w-6 h-6': !isRootComment
        })}
      >
        <AvatarImage src={accountData.avatar} alt={accountData.channelName} />
        <AvatarFallback>{accountData.channelName[0].toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className='flex-1'>
        <input
          type='text'
          placeholder={isRootComment ? 'Viết bình luận...' : 'Phản hồi...'}
          className={classNames({
            'outline-none w-full placeholder:text-muted-foreground border-b border-b-muted-foreground bg-transparent':
              true,
            'py-1 text-[13px]': !isRootComment,
            'py-2 text-sm': isRootComment
          })}
        />
        <div className='flex justify-end items-center space-x-3 mt-2'>
          <Button variant='ghost' className='rounded-full'>
            Hủy
          </Button>
          <Button disabled className='rounded-full bg-blue-700 hover:bg-blue-800 text-white'>
            {isRootComment ? 'Bình luận' : 'Phản hồi'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CommentInput
