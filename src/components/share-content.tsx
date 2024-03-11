'use client'

import { useMutation } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState, type ReactNode } from 'react'
import toast from 'react-hot-toast'

import postApis from '@/apis/post.apis'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { PostAudience } from '@/constants/enum'
import PATH from '@/constants/path'
import { PlaylistVideoItemType } from '@/types/playlist.types'
import { SearchResultItem } from '@/types/search.types'
import { VideoItemType } from '@/types/video.types'
import { WatchHistoryItemType } from '@/types/watchHistory.types'

type ShareContentProps = {
  children: ReactNode
  sharedContentData: VideoItemType | SearchResultItem | WatchHistoryItemType | PlaylistVideoItemType
}

const ShareContent = ({ children, sharedContentData }: ShareContentProps) => {
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false)
  const [content, setContent] = useState<string>('')

  const createPostMutation = useMutation({
    mutationKey: ['createPost'],
    mutationFn: postApis.create,
    onSuccess: () => {
      toast.success('Chia sẻ thành công')
      setIsOpenDialog(false)
      setContent('')
    }
  })

  return (
    <Dialog open={isOpenDialog} onOpenChange={(value) => setIsOpenDialog(value)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='max-w-3xl'>
        <DialogHeader>
          <DialogTitle>Tạo bài đăng</DialogTitle>
          <div className='space-y-4 pt-4'>
            <Input
              type='text'
              placeholder='Đăng bài công khai'
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <div className='flex items-start space-x-2 border border-border rounded-md p-2'>
              <div className='flex-shrink-0'>
                <Link href={PATH.WATCH(sharedContentData.idName)} title={sharedContentData.title}>
                  <Image
                    width={200}
                    height={200}
                    src={sharedContentData.thumbnail}
                    alt={sharedContentData.title}
                    className='w-[210px] h-[118px] rounded-md object-cover'
                  />
                </Link>
              </div>
              <div className='flex-1 space-y-2'>
                <Link href={PATH.WATCH(sharedContentData.idName)} title={sharedContentData.title}>
                  <span className='line-clamp-1'>{sharedContentData.title}</span>
                </Link>
                {!!sharedContentData.description?.trim() && (
                  <div className='line-clamp-2 text-sm text-muted-foreground whitespace-pre-line'>
                    {sharedContentData.description}
                  </div>
                )}
              </div>
            </div>
            <div className='flex justify-end'>
              <Button
                disabled={content.trim().length === 0 || createPostMutation.isPending}
                className='rounded-full'
                onClick={() =>
                  createPostMutation.mutate({
                    audience: PostAudience.Everyone,
                    content,
                    contentId: sharedContentData._id
                  })
                }
              >
                {createPostMutation.isPending && <Loader2 size={16} className='animate-spin mr-3' />}
                Đăng
              </Button>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default ShareContent
