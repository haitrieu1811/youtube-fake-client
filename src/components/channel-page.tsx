'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import { Camera, CheckCircle2, Loader2 } from 'lucide-react'
import { useMemo, useState } from 'react'

import accountApis from '@/apis/account.apis'
import mediaApis from '@/apis/media.apis'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ACCOUNT_MESSAGES } from '@/constants/messages'
import InputFile from './input-file'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { toast } from './ui/use-toast'

const ChannelPage = () => {
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const coverReview = useMemo(() => (coverFile ? URL.createObjectURL(coverFile) : null), [coverFile])
  const avatarReview = useMemo(() => (avatarFile ? URL.createObjectURL(avatarFile) : null), [avatarFile])

  // Query: Thông tin kênh của tôi
  const getMeQuery = useQuery({
    queryKey: ['getMe'],
    queryFn: () => accountApis.getMe()
  })

  // Thông tin kênh của tôi
  const me = useMemo(() => getMeQuery.data?.data.data.me, [getMeQuery.data?.data.data.me])

  // Mutation: Upload ảnh
  const uploadImagesMutation = useMutation({
    mutationKey: ['uploadImages'],
    mutationFn: mediaApis.uploadImage
  })

  // Mutation: Cập nhật kênh
  const updateMeMutation = useMutation({
    mutationKey: ['updateChannel'],
    mutationFn: accountApis.updateMe
  })

  const isUpdating = uploadImagesMutation.isPending || updateMeMutation.isPending

  // Thay đổi file ảnh bìa
  const handleChangeCoverFile = (files?: File[]) => {
    if (!files) return
    setCoverFile(files[0])
  }

  // Thay đổi file ảnh đại diện
  const handleChangeAvatarFile = (files?: File[]) => {
    if (!files) return
    setAvatarFile(files[0])
  }

  // Hủy cập nhật ảnh bìa
  const handleCancelUpdateCoverImage = () => {
    setCoverFile(null)
  }

  // Hủy cập nhật ảnh đại diện
  const handleCancelUpdateAvatarImage = () => {
    setAvatarFile(null)
  }

  // Xử lử cập nhật ảnh bìa
  const handleSaveCoverImage = async () => {
    if (!coverFile) return
    const formData = new FormData()
    formData.append('image', coverFile)
    const res = await uploadImagesMutation.mutateAsync(formData)
    if (!res) return
    const { imageIds } = res.data.data
    updateMeMutation.mutate(
      { cover: imageIds[0] },
      {
        onSuccess: () => {
          toast({
            title: ACCOUNT_MESSAGES.UPDATE_COVER_SUCCEED
          })
          getMeQuery.refetch()
          setCoverFile(null)
        }
      }
    )
  }

  // Xử lử cập nhật ảnh bìa
  const handleSaveAvatarImage = async () => {
    if (!avatarFile) return
    const formData = new FormData()
    formData.append('image', avatarFile)
    const res = await uploadImagesMutation.mutateAsync(formData)
    if (!res) return
    const { imageIds } = res.data.data
    updateMeMutation.mutate(
      { avatar: imageIds[0] },
      {
        onSuccess: () => {
          toast({
            title: ACCOUNT_MESSAGES.UPDATE_AVATAR_SUCCEED
          })
          getMeQuery.refetch()
          setAvatarFile(null)
        }
      }
    )
  }

  return (
    <TooltipProvider>
      {me && (
        <div className='px-24'>
          <div
            className='relative h-[170px] bg-muted bg-center bg-cover mt-2 rounded-lg group cursor-pointer'
            style={{
              backgroundImage: coverReview ? `url(${coverReview})` : me.cover ? `url(${me.cover})` : undefined
            }}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <InputFile onChange={(files) => handleChangeCoverFile(files)}>
                  <Button
                    variant='ghost'
                    className='absolute top-2 right-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto rounded-full w-[50px] h-[50px] bg-black/50 hover:bg-black/50'
                  >
                    <Camera strokeWidth={1.5} className='flex-shrink-0 stroke-white' />
                  </Button>
                </InputFile>
              </TooltipTrigger>
              <TooltipContent>Cập nhật ảnh bìa</TooltipContent>
            </Tooltip>
            {coverFile && (
              <div className='flex justify-end items-center space-x-2 absolute bottom-0 left-0 right-0 bg-muted-foreground/20 px-4 py-2'>
                <Button variant='secondary' className='rounded-full' onClick={handleCancelUpdateCoverImage}>
                  Hủy
                </Button>
                <Button className='rounded-full' disabled={isUpdating} onClick={handleSaveCoverImage}>
                  {isUpdating && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
                  Lưu lại
                </Button>
              </div>
            )}
          </div>

          <div className='mt-4 flex space-x-6'>
            <div className='relative group hover:cursor-pointer'>
              <Avatar className='w-[160px] h-[160px]'>
                <AvatarImage src={avatarReview ? avatarReview : me.avatar} className='object-cover' />
                <AvatarFallback className='text-5xl font-semibold'>{me.username[0].toUpperCase()} </AvatarFallback>
              </Avatar>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InputFile onChange={(files) => handleChangeAvatarFile(files)}>
                    <Button className='absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto w-[50px] h-[50px] rounded-full bg-black/50 hover:bg-black/50'>
                      <Camera strokeWidth={1.5} className='flex-shrink-0 stroke-white' />
                    </Button>
                  </InputFile>
                </TooltipTrigger>
                <TooltipContent>Chỉnh sửa ảnh hồ sơ</TooltipContent>
              </Tooltip>
              {avatarFile && (
                <div className='flex justify-center items-center space-x-2 absolute bottom-0 left-0 right-0 bg-muted-foreground/20 px-4 py-2 rounded-lg'>
                  <Button
                    variant='secondary'
                    size='sm'
                    className='rounded-full'
                    onClick={handleCancelUpdateAvatarImage}
                  >
                    Hủy
                  </Button>
                  <Button
                    size='sm'
                    disabled={isUpdating}
                    className='rounded-full space-x-2'
                    onClick={handleSaveAvatarImage}
                  >
                    {isUpdating && <Loader2 className='w-3 h-3 mr-3 animate-spin' />}
                    Lưu lại
                  </Button>
                </div>
              )}
            </div>
            <div className='flex-1 space-y-4'>
              <div className='flex items-center space-x-4'>
                <h2 className='font-bold text-4xl'>{me.channelName}</h2>
                <Tooltip>
                  <TooltipTrigger>
                    <CheckCircle2 className='fill-blue-500 stroke-white dark:stroke-black' />
                  </TooltipTrigger>
                  <TooltipContent>Đã xác minh</TooltipContent>
                </Tooltip>
              </div>
              <div className='flex items-center space-x-3'>
                <div className='text-sm text-muted-foreground'>@{me.username}</div>
                <span className='w-1 h-1 rounded-full bg-muted-foreground' />
                <div className='text-sm text-muted-foreground'>{me.subscriptionCount} người đăng ký</div>
                <span className='w-1 h-1 rounded-full bg-muted-foreground' />
                <div className='text-sm text-muted-foreground'>{me.videoCount} video</div>
              </div>
              <div className='space-x-4'>
                <Button variant='secondary' className='rounded-full'>
                  Tùy chỉnh kênh
                </Button>
                <Button variant='secondary' className='rounded-full'>
                  Quản lý video
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </TooltipProvider>
  )
}

export default ChannelPage
