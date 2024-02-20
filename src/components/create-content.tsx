import { ListPlus, PenSquare, PlaySquare } from 'lucide-react'
import Link from 'next/link'
import { ReactNode } from 'react'

import PATH from '@/constants/path'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'

const CreateContent = ({ children }: { children: ReactNode }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='px-0 py-2'>
        <DropdownMenuItem className='space-x-3 pr-10 pl-5 py-2 cursor-pointer' asChild>
          <Link href={PATH.UPLOAD_VIDEO}>
            <PlaySquare size={20} strokeWidth={1.5} />
            <span>Tải video lên</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className='space-x-3 pr-10 pl-5 py-2 cursor-pointer' asChild>
          <Link
            href={{
              pathname: PATH.CHANNEL,
              query: { tab: 'community' }
            }}
          >
            <PenSquare size={20} strokeWidth={1.5} />
            <span>Tạo bài đăng</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className='space-x-3 pr-10 pl-5 py-2 cursor-pointer'>
          <ListPlus size={20} strokeWidth={1.5} />
          <span>Danh sách phát mới</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default CreateContent
