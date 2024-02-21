'use client'

import { useRouter } from 'next/navigation'

import CreatePlaylistForm from '@/components/create-playlist-form'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'

const CreatePlaylist = () => {
  const router = useRouter()
  return (
    <Dialog defaultOpen onOpenChange={() => router.back()}>
      <DialogContent className='max-w-[575px]'>
        <DialogHeader>
          <DialogTitle>Tạo danh sách phát mới</DialogTitle>
        </DialogHeader>
        <Separator className='my-2' />
        <CreatePlaylistForm />
      </DialogContent>
    </Dialog>
  )
}

export default CreatePlaylist
