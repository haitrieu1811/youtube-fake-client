'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowUpFromLine } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import mediaApis from '@/apis/media.apis'
import videoApis from '@/apis/video.apis'
import InputFile from '@/components/input-file'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import UpdateVideoForm from '@/components/update-video-form'
import { VideoAudience } from '@/constants/enum'

const UploadVideo = () => {
  const queryClient = useQueryClient()
  const router = useRouter()
  const [createdVideoId, setCreatedVideoId] = useState<string | null>(null)

  // Mutation: Upload video HLS
  const uploadVideoHLS = useMutation({
    mutationKey: ['uploadVideoHLS'],
    mutationFn: mediaApis.uploadVideoHLS
  })

  // Mutation: Tạo video mới
  const createVideoMutation = useMutation({
    mutationKey: ['createVideo'],
    mutationFn: videoApis.createVideo,
    onSuccess: (data) => {
      const { newVideo } = data.data.data
      setCreatedVideoId(newVideo._id)
      queryClient.invalidateQueries({ queryKey: ['getVideosOfMe'] })
    }
  })

  // Chọn video để tải lên
  const handleChangeVideoFile = async (files?: File[]) => {
    if (!files) return
    const form = new FormData()
    form.append('video', files[0])
    try {
      const res = await uploadVideoHLS.mutateAsync(form)
      const { videoIdName } = res.data.data
      createVideoMutation.mutate({
        idName: videoIdName,
        title: videoIdName,
        audience: VideoAudience.Onlyme,
        isDraft: true
      })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Dialog defaultOpen onOpenChange={() => router.back()}>
      <DialogContent className='max-w-[960px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='font-medium'>{!createdVideoId ? 'Tải video lên' : 'Chi tiết'}</DialogTitle>
        </DialogHeader>
        {!createdVideoId && (
          <div className='flex items-center flex-col space-y-8 py-14'>
            <div className='w-[136px] h-[136px] bg-muted rounded-full flex justify-center items-center'>
              <ArrowUpFromLine size={50} />
            </div>
            <div className='space-y-2 text-center'>
              <h4 className='text-[15px] font-medium'>Kéo và thả tệp video để tải lên</h4>
              <div className='text-[13px] text-muted-foreground'>
                Các video của bạn sẽ ở chế độ riêng tư cho đến khi bạn xuất bản.
              </div>
            </div>
            <InputFile maxFileSize={50 * 1024 * 1024} onChange={(files) => handleChangeVideoFile(files)}>
              <Button className='rounded-sm uppercase bg-blue-700 hover:bg-blue-800 text-white'>Chọn tệp</Button>
            </InputFile>
          </div>
        )}
        {createdVideoId && <UpdateVideoForm videoId={createdVideoId} />}
      </DialogContent>
    </Dialog>
  )
}

export default UploadVideo
