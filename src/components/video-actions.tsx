import { useMutation } from '@tanstack/react-query'
import { Flag, History, ListPlus, MoreVertical, Share2 } from 'lucide-react'
import toast from 'react-hot-toast'

import bookmarkApis from '@/apis/bookmark.apis'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from './ui/button'

type VideoActionsProps = {
  videoId: string
}

const VideoActions = ({ videoId }: VideoActionsProps) => {
  const bookmarkVideoMutation = useMutation({
    mutationKey: ['bookmarkVideo'],
    mutationFn: bookmarkApis.bookmarkVideo,
    onSuccess: () => {
      toast.success('Đã lưu vào danh sách Xem sau')
    }
  })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size='icon' variant='ghost' className='w-9 h-9 rounded-full'>
          <MoreVertical strokeWidth={1.5} size={18} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='px-0 py-2 w-auto rounded-xl'>
        <Button
          variant='ghost'
          className='flex w-full pr-10 justify-start space-x-3 rounded-none'
          onClick={() => bookmarkVideoMutation.mutate(videoId)}
        >
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
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default VideoActions
