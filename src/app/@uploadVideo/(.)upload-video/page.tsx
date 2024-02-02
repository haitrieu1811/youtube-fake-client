'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowBigUpDash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'

import mediaApis from '@/apis/media.apis'
import videoApis from '@/apis/video.apis'
import InputFile from '@/components/input-file'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import UpdateVideoForm from '@/components/update-video-form'

const UploadVideo = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [createdVideoId, setCreatedVideoId] = useState<string | null>(null)

  // Mutation: Upload video HLS
  const uploadVideoHLS = useMutation({
    mutationKey: ['uploadVideoHLS'],
    mutationFn: mediaApis.uploadVideoHLS,
    onError: () => {
      toast.error('Định dạng tệp không hợp lệ')
    }
  })

  // Mutation: Create new video after upload video HLS succeed
  const createVideoMutation = useMutation({
    mutationKey: ['createVideo'],
    mutationFn: videoApis.createVideo,
    onSuccess: (data) => {
      const { video } = data.data.data
      setCreatedVideoId(video._id)
      queryClient.invalidateQueries({ queryKey: ['getVideosOfMe'] })
    }
  })

  // Choose video to upload
  const handleChangeVideoFile = async (files?: File[]) => {
    if (!files) return
    const form = new FormData()
    form.append('video', files[0])
    const res = await uploadVideoHLS.mutateAsync(form)
    const { videoIdName } = res.data.data
    createVideoMutation.mutate({
      idName: videoIdName,
      title: videoIdName
    })
  }

  return (
    <Dialog defaultOpen onOpenChange={() => router.back()}>
      <DialogContent className='max-w-[960px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='font-medium'>{createdVideoId ? 'Chi tiết video' : 'Tải video lên'}</DialogTitle>
        </DialogHeader>
        {/* Upload video */}
        {!createdVideoId && (
          <div className='flex items-center flex-col space-y-8 py-14'>
            <InputFile maxFileSize={50 * 1024 * 1024} accept='.mp4' onChange={(files) => handleChangeVideoFile(files)}>
              <div className='w-[136px] h-[136px] bg-muted rounded-full flex justify-center items-center'>
                <ArrowBigUpDash size={50} />
              </div>
            </InputFile>
            <div className='space-y-2 text-center'>
              <h4 className='text-[15px] font-medium'>Kéo và thả tệp video để tải lên</h4>
              <div className='text-[13px] text-muted-foreground'>
                Các video của bạn sẽ ở chế độ riêng tư cho đến khi bạn xuất bản.
              </div>
            </div>
            <InputFile maxFileSize={50 * 1024 * 1024} accept='.mp4' onChange={(files) => handleChangeVideoFile(files)}>
              <Button className='uppercase'>Chọn tệp</Button>
            </InputFile>
          </div>
        )}
        {/* Update video form */}
        {createdVideoId && <UpdateVideoForm videoId={createdVideoId} />}
      </DialogContent>
    </Dialog>
  )
}

export default UploadVideo
