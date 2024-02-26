'use client'

import { Flag, MoreVertical, Pencil, Trash } from 'lucide-react'
import { Fragment, useContext } from 'react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { AppContext } from '@/providers/app-provider'
import { PostItemType } from '@/types/post.types'
import { Button } from './ui/button'

type PostActionsProps = {
  postData: PostItemType
  onUpdate?: () => void
  onDelete?: () => void
}

const PostActions = ({ postData, onUpdate, onDelete }: PostActionsProps) => {
  const { account } = useContext(AppContext)

  // Handle update
  const handleUpdate = () => {
    onUpdate && onUpdate()
  }

  // Handle delete
  const handleDelete = () => {
    onDelete && onDelete()
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size='icon' variant='ghost' className='rounded-full'>
          <MoreVertical strokeWidth={1.5} size={18} />
        </Button>
      </PopoverTrigger>
      <PopoverContent align='start' className='px-0 py-2 w-auto rounded-xl'>
        {account?._id === postData.author._id && (
          <Fragment>
            <Button
              variant='ghost'
              className='flex justify-start space-x-3 rounded-none w-full pr-10'
              onClick={handleUpdate}
            >
              <Pencil strokeWidth={1.5} size={18} />
              <span>Chỉnh sửa</span>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant='ghost' className='flex justify-start space-x-3 rounded-none w-full pr-10'>
                  <Trash strokeWidth={1.5} size={18} />
                  <span>Xóa</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className='max-w-xs'>
                <AlertDialogHeader>
                  <AlertDialogTitle>Xóa bài viết?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Bài viết sẽ được xóa vĩnh viễn và không thể khôi phục.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className='rounded-full'>Hủy</AlertDialogCancel>
                  <AlertDialogAction className='rounded-full' onClick={handleDelete}>
                    Xóa
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </Fragment>
        )}
        {account?._id !== postData.author._id && (
          <Button variant='ghost' className='flex justify-start space-x-3 rounded-none w-full pr-10'>
            <Flag strokeWidth={1.5} size={18} />
            <span>Báo vi phạm</span>
          </Button>
        )}
      </PopoverContent>
    </Popover>
  )
}

export default PostActions
