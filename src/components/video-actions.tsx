import { Flag, History, ListPlus, MoreVertical, Share2 } from 'lucide-react'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from './ui/button'

const VideoActions = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size='icon' variant='ghost' className='w-9 h-9 rounded-full'>
          <MoreVertical strokeWidth={1.5} size={18} />
        </Button>
      </PopoverTrigger>
      <PopoverContent align='end' className='px-0 py-2 w-auto rounded-xl'>
        <Button variant='ghost' className='flex w-full pr-10 justify-start space-x-3 rounded-none'>
          <History size={18} strokeWidth={1.5} />
          <span>Lưu vào danh sách xem sau</span>
        </Button>
        <Button variant='ghost' className='flex w-full pr-10 justify-start space-x-3 rounded-none'>
          <Flag size={18} strokeWidth={1.5} />
          <span>Báo vi phạm</span>
        </Button>
        <Button variant='ghost' className='flex w-full pr-10 justify-start space-x-3 rounded-none'>
          <ListPlus size={18} strokeWidth={1.5} />
          <span>Thêm vào playlist</span>
        </Button>
        <Button variant='ghost' className='flex w-full pr-10 justify-start space-x-3 rounded-none'>
          <Share2 size={18} strokeWidth={1.5} />
          <span>Chia sẻ</span>
        </Button>
      </PopoverContent>
    </Popover>
  )
}

export default VideoActions
