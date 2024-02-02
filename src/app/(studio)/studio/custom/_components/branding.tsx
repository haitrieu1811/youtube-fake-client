'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import { Fragment, useContext, useMemo, useState } from 'react'
import toast from 'react-hot-toast'

import accountApis from '@/apis/account.apis'
import mediaApis from '@/apis/media.apis'
import InputFile from '@/components/input-file'
import { Button } from '@/components/ui/button'
import { AppContext } from '@/providers/app-provider'
import { ProfileType } from '@/types/account.types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

type BradingProps = {
  infoMe: ProfileType | undefined
}

const Branding = ({ infoMe }: BradingProps) => {
  const queryClient = useQueryClient()

  const { setAccount } = useContext(AppContext)

  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)

  const avatarPreview = useMemo(() => (avatarFile ? URL.createObjectURL(avatarFile) : null), [avatarFile])
  const coverPreview = useMemo(() => (coverFile ? URL.createObjectURL(coverFile) : null), [coverFile])

  // Mutation: Upload ảnh
  const uploadImagesMutation = useMutation({
    mutationKey: ['uploadImages'],
    mutationFn: mediaApis.uploadImage
  })

  // Mutation: Cập nhật tài khoản
  const updateMeMutation = useMutation({
    mutationKey: ['updateMe'],
    mutationFn: accountApis.updateMe
  })

  const isUpdating = uploadImagesMutation.isPending || updateMeMutation.isPending

  // Thay đổi avatar
  const handleChangeAvatarFile = (files: File[] | undefined) => {
    if (!files) return
    setAvatarFile(files[0])
  }

  // Hủy avatar
  const handleCancelAvatarFile = () => {
    setAvatarFile(null)
  }

  // Thay đổi ảnh bìa
  const handleChangeCoverFile = (files: File[] | undefined) => {
    if (!files) return
    setCoverFile(files[0])
  }

  // Hủy ảnh bìa
  const handleCancelCoverFile = () => {
    setCoverFile(null)
  }

  // Lưu avatar, ảnh bìa
  const handleSaveImage = async ({ file, field }: { file: File; field: 'avatar' | 'cover' }) => {
    try {
      const form = new FormData()
      form.append('image', file)
      const res = await uploadImagesMutation.mutateAsync(form)
      const { imageIds } = res.data.data
      updateMeMutation.mutate(
        { [field]: imageIds[0] },
        {
          onSuccess: (data) => {
            const { account } = data.data.data
            setAccount(account)
            queryClient.invalidateQueries({ queryKey: ['getMe'] })
            field === 'avatar' ? setAvatarFile(null) : setCoverFile(null)
            toast.success(`Cập nhật ảnh ${field === 'avatar' ? 'đại diện' : 'bìa'} thành công`)
          }
        }
      )
    } catch (error) {
      console.log(error)
    }
  }

  // Xóa avatar, ảnh bìa
  const handleDeleteImage = (field: 'avatar' | 'cover') => {
    updateMeMutation.mutate(
      {
        [field]: null
      },
      {
        onSuccess: (data) => {
          const { account } = data.data.data
          setAccount(account)
          queryClient.invalidateQueries({ queryKey: ['getMe'] })
          toast.success(`Xóa ảnh ${field === 'avatar' ? 'đại diện' : 'bìa'} thành công`)
        }
      }
    )
  }

  return (
    <Fragment>
      {/* Ảnh đại diện */}
      <div className='space-y-1'>
        <h4 className='text-[15px] font-medium'>Ảnh</h4>
        <div className='text-[13px] text-muted-foreground'>
          Ảnh hồ sơ sẽ xuất hiện cùng với kênh của bạn trên YouTube tại những vị trí như bên cạnh bình luận và video của
          bạn
        </div>
        {infoMe && (
          <div className='flex items-start space-x-8'>
            <div className='flex-shrink-0 w-[290px] h-[160px] rounded-sm bg-border flex justify-center items-center relative'>
              <Avatar className='w-[140px] h-[140px] object-cover'>
                <AvatarImage src={avatarPreview || infoMe.avatar} alt={infoMe.channelName} />
                <AvatarFallback className='text-4xl'>{infoMe.channelName[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              {avatarFile && (
                <div className='flex justify-end items-center space-x-2 absolute bottom-0 left-0 right-0 bg-muted-foreground/20 p-2'>
                  <Button variant='secondary' className='rounded-full' onClick={handleCancelAvatarFile}>
                    Hủy
                  </Button>
                  <Button
                    disabled={isUpdating}
                    className='rounded-full'
                    onClick={() => handleSaveImage({ file: avatarFile, field: 'avatar' })}
                  >
                    {isUpdating && <Loader2 className='w-3 h-3 mr-2 animate-spin' />}
                    Lưu
                  </Button>
                </div>
              )}
            </div>
            <div className='flex-1'>
              <div className='text-[13px] text-muted-foreground'>
                Bạn nên dùng ảnh có độ phân giải tối thiểu 98 x 98 pixel và có kích thước tối đa 300 KB. Hãy dùng tệp
                PNG hoặc GIF (không dùng ảnh động). Nhớ đảm bảo hình ảnh của bạn tuân thủ Nguyên tắc cộng đồng của
                YouTube
              </div>
              <div className='mt-2 space-x-6 flex items-center'>
                <InputFile onChange={(files) => handleChangeAvatarFile(files)}>
                  <Button
                    variant='ghost'
                    className='uppercase text-blue-600 hover:text-blue-600 hover:bg-transparent p-0'
                  >
                    Thay đổi
                  </Button>
                </InputFile>
                <Button
                  variant='ghost'
                  className='uppercase text-blue-600 hover:text-blue-600 hover:bg-transparent p-0'
                  onClick={() => handleDeleteImage('avatar')}
                >
                  Xóa
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Ảnh bìa */}
      <div className='space-y-1'>
        <h4 className='text-[15px] font-medium'>Hình ảnh biểu ngữ</h4>
        <div className='text-[13px] text-muted-foreground'>Hình ảnh này sẽ xuất hiện ở phần đầu kênh của bạn</div>
        {infoMe && (
          <div className='flex items-start space-x-8'>
            <div className='flex-shrink-0 w-[290px] h-[160px] rounded-sm bg-border flex justify-center items-center relative'>
              {(coverPreview || !!infoMe.cover) && (
                <Image
                  width={140}
                  height={140}
                  src={coverPreview || infoMe.cover}
                  alt={infoMe.channelName}
                  className='w-full h-2/3 object-cover'
                />
              )}
              {/* Fallback cover */}
              {!(coverPreview || infoMe.cover) && <div className='w-full h-2/3 bg-background' />}
              {coverFile && (
                <div className='flex justify-end items-center space-x-2 absolute bottom-0 left-0 right-0 bg-muted-foreground/20 p-2'>
                  <Button variant='secondary' className='rounded-full' onClick={handleCancelCoverFile}>
                    Hủy
                  </Button>
                  <Button
                    disabled={isUpdating}
                    className='rounded-full'
                    onClick={() => handleSaveImage({ file: coverFile, field: 'cover' })}
                  >
                    {isUpdating && <Loader2 className='w-3 h-3 mr-2 animate-spin' />}
                    Lưu
                  </Button>
                </div>
              )}
            </div>
            <div className='flex-1'>
              <div className='text-[13px] text-muted-foreground'>
                Để hình ảnh đạt chất lượng cao nhất trên mọi thiết bị, hãy dùng ảnh có độ phân giải tối thiểu 2048 x
                1152 pixel và có kích thước tối đa 300 KB.
              </div>
              <div className='mt-2 space-x-6 flex items-center'>
                <InputFile onChange={(files) => handleChangeCoverFile(files)}>
                  <Button
                    variant='ghost'
                    className='uppercase text-blue-600 hover:text-blue-600 hover:bg-transparent p-0'
                  >
                    Thay đổi
                  </Button>
                </InputFile>
                <Button
                  variant='ghost'
                  className='uppercase text-blue-600 hover:text-blue-600 hover:bg-transparent p-0'
                  onClick={() => handleDeleteImage('cover')}
                >
                  Xóa
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Fragment>
  )
}

export default Branding
