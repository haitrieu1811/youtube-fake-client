'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CopyPlus, Eye, Image as ImageIcon, Loader2, Trash, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { ChangeEvent, Fragment, useContext, useMemo, useState } from 'react'
import toast from 'react-hot-toast'

import mediaApis from '@/apis/media.apis'
import postApis from '@/apis/post.apis'
import InputFile from '@/components/input-file'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { PostAudience } from '@/constants/enum'
import { ChannelClientContext } from './channel-client'

const MAX_IMAGES_PER_POST = 5

const CreatePost = () => {
  const queryClient = useQueryClient()
  const { channelData } = useContext(ChannelClientContext)
  const [isImageMode, setIsImageMode] = useState<boolean>(false)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [content, setContent] = useState<string>('')
  const [audience, setAudience] = useState<PostAudience>(PostAudience.Everyone)

  // Mutation: Upload image
  const uploadImagesMutation = useMutation({
    mutationKey: ['uploadImages'],
    mutationFn: mediaApis.uploadImage
  })

  // Preview images
  const previewImages = useMemo(() => imageFiles.map((file) => URL.createObjectURL(file)), [imageFiles])

  // Handle toggle image mode
  const handleToggleImageMode = () => {
    setIsImageMode((prevState) => !prevState)
  }

  // Handle change images
  const handleChangeImage = (files?: File[]) => {
    if (!files) return
    setImageFiles((prevState) => {
      const addedImages = files.slice(0, MAX_IMAGES_PER_POST - prevState.length)
      return [...prevState, ...addedImages]
    })
  }

  // Handle remove all images
  const handleRemoveAllImages = () => {
    setImageFiles([])
  }

  // Handle remove image
  const handleRemoveImage = (previewUrl: string) => {
    const foundIndex = previewImages.findIndex((item) => item === previewUrl)
    setImageFiles((prevState) => prevState.filter((_, index) => index !== foundIndex))
  }

  // Handle change content
  const handleChangeContent = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
  }

  // Handle change audience of post
  const handleChangeAudience = (value: string) => {
    setAudience(Number(value))
  }

  // Handle cancel create post
  const handleCancel = () => {
    setContent('')
    setImageFiles([])
    setIsImageMode(false)
  }

  // Mutation: Create a new post
  const createPostMutation = useMutation({
    mutationKey: ['createPost'],
    mutationFn: postApis.create,
    onSuccess: () => {
      handleCancel()
      toast.success('Đã tạo bài đăng')
      queryClient.invalidateQueries({ queryKey: ['getMyPosts'] })
    }
  })

  // Is creating new post
  const isCreating = uploadImagesMutation.isPending || createPostMutation.isPending

  // Submit
  const handleSubmit = async () => {
    let images: string[] = []
    if (imageFiles.length > 0) {
      const form = new FormData()
      imageFiles.forEach((file) => {
        form.append('image', file)
      })
      const res = await uploadImagesMutation.mutateAsync(form)
      const { imageIds } = res.data.data
      images = imageIds
    }
    createPostMutation.mutate({
      content,
      audience,
      images: images.length > 0 ? images : undefined
    })
  }

  return (
    <div className='w-3/4 border border-border rounded-xl p-4 mt-6 space-y-3'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-3 flex-shrink-0'>
          <Avatar className='w-8 h-8'>
            <AvatarImage src={channelData?.avatar} alt={channelData?.channelName} />
            <AvatarFallback>{channelData?.channelName[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className='font-medium text-sm'>{channelData?.channelName}</span>
        </div>
        <div className='flex items-center space-x-2'>
          <span className='text-muted-foreground text-sm whitespace-nowrap'>Trạng thái hiển thị:</span>
          <Select defaultValue={String(audience)} onValueChange={(value) => handleChangeAudience(value)}>
            <SelectTrigger className='w-[130px]'>
              <SelectValue placeholder='Trạng thái hiển thị' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={String(PostAudience.Everyone)}>Công khai</SelectItem>
              <SelectItem value={String(PostAudience.Onlyme)}>Chỉ mình tôi</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {!isImageMode && (
        <Fragment>
          <Textarea
            rows={5}
            value={content}
            onChange={handleChangeContent}
            placeholder='Bật mí về video tiếp theo của bạn'
            className='resize-none'
          />
          <div className='flex items-center space-x-2'>
            <Button variant='ghost' className='space-x-2 rounded-full' onClick={handleToggleImageMode}>
              <ImageIcon strokeWidth={1.5} size={18} />
              <span>Hình ảnh</span>
            </Button>
          </div>
        </Fragment>
      )}
      {isImageMode && (
        <div className='relative flex items-center justify-center flex-col border border-border rounded-lg pt-10 pb-5'>
          <Button
            size='icon'
            variant='ghost'
            className='rounded-full absolute top-3 right-3'
            onClick={handleToggleImageMode}
          >
            <X strokeWidth={1.5} />
          </Button>
          {imageFiles.length === 0 && (
            <Fragment>
              <div className='w-10 h-10 rounded-full flex items-center justify-center bg-blue-500'>
                <ImageIcon strokeWidth={1.5} size={18} stroke='#fff' />
              </div>
              <div className='text-center mt-4'>
                <div>Kéo vào tối đa 5 bức ảnh hoặc</div>
                <InputFile multiple onChange={(files) => handleChangeImage(files)}>
                  <div className='text-blue-500 font-medium cursor-pointer'>chọn ảnh trong máy tính của bạn</div>
                </InputFile>
              </div>
              <div className='text-xs text-muted-foreground text-center mt-10'>
                <div>Vui lòng tải ảnh có tỷ lệ trong khoảng từ 2:5 đến 5:2 lên.</div>
                <div>Chỉ chọn hình ảnh hoặc ảnh GIF mà bạn có quyền sử dụng</div>
              </div>
            </Fragment>
          )}
          {imageFiles.length > 0 && (
            <div className='space-y-4 px-6 mt-5'>
              <div className='grid grid-cols-10 gap-6'>
                {/* Images of post */}
                {previewImages.map((image) => (
                  <div key={image} className='col-span-2 relative rounded-lg overflow-hidden group'>
                    <Image width={200} height={200} src={image} alt={image} className='w-full h-[100px] object-cover' />
                    <div className='absolute left-0 right-0 bottom-0 bg-black/50 p-2 flex items-center justify-end space-x-1 opacity-0 group-hover:opacity-100'>
                      <Button size='icon' variant='secondary' className='rounded-full' asChild>
                        <Link href={image} target='_blank'>
                          <Eye strokeWidth={1.5} size={18} />
                        </Link>
                      </Button>
                      <Button
                        size='icon'
                        variant='destructive'
                        className='rounded-full'
                        onClick={() => handleRemoveImage(image)}
                      >
                        <Trash strokeWidth={1.5} size={18} />
                      </Button>
                    </div>
                  </div>
                ))}
                {/* Show add image button when image files less than limit */}
                {imageFiles.length < MAX_IMAGES_PER_POST && (
                  <InputFile multiple className='col-span-2' onChange={(files) => handleChangeImage(files)}>
                    <div className='h-[100px] rounded-lg bg-muted flex justify-center items-center flex-col space-y-3 cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-900'>
                      <CopyPlus strokeWidth={1.5} />
                      <span className='text-muted-foreground text-sm'>Thêm ảnh</span>
                    </div>
                  </InputFile>
                )}
              </div>
              {/* Remove all images */}
              <div className='flex justify-end items-center'>
                <Button variant='ghost' className='rounded-full space-x-3' onClick={handleRemoveAllImages}>
                  <Trash strokeWidth={1.5} size={16} />
                  <span>Xóa tất cả ảnh</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
      {/* Action buttons */}
      <div className='flex items-center justify-end space-x-3'>
        {(content.trim().length > 0 || imageFiles.length > 0) && (
          <Button variant='ghost' className='rounded-full' onClick={handleCancel}>
            Hủy
          </Button>
        )}
        <Button
          disabled={content.trim().length === 0 || isCreating}
          className='rounded-full bg-blue-500 hover:bg-blue-600'
          onClick={handleSubmit}
        >
          {isCreating && <Loader2 strokeWidth={1.5} size={16} className='animate-spin mr-2' />}
          <span>Đăng</span>
        </Button>
      </div>
    </div>
  )
}

export default CreatePost
