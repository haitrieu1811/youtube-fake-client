import { Flag, History, ListPlus, MoreVertical } from 'lucide-react'

import { Button } from './ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'

type VideoActionsProps = {
  className?: string
}

const VideoActions = ({ className }: VideoActionsProps) => {
  return (
    <div className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size='icon' variant='ghost' className='w-9 h-9 rounded-full'>
            <MoreVertical size={18} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='bg-background py-2'>
          <DropdownMenuItem className='space-x-4 px-4 py-2.5 hover:cursor-pointer'>
            <History size={18} strokeWidth={1.5} />
            <span>Thêm vào danh sách xem sau</span>
          </DropdownMenuItem>
          <DropdownMenuItem className='space-x-4 px-4 py-2.5 hover:cursor-pointer'>
            <Flag size={18} strokeWidth={1.5} />
            <span>Báo vi phạm</span>
          </DropdownMenuItem>
          <DropdownMenuItem className='space-x-4 px-4 py-2.5 hover:cursor-pointer'>
            <ListPlus size={18} strokeWidth={1.5} />
            <span>Thêm vào playlist</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default VideoActions
