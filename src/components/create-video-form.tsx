'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { MediaPlayer, MediaProvider } from '@vidstack/react'
import { DefaultVideoLayout, defaultLayoutIcons } from '@vidstack/react/player/layouts/default'
import '@vidstack/react/player/styles/default/layouts/video.css'
import '@vidstack/react/player/styles/default/theme.css'
import { CheckCircle2, Globe2, ImagePlus, Loader2, Lock } from 'lucide-react'
import Image from 'next/image'
import { Fragment, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import mediaApis from '@/apis/media.apis'
import videoApis from '@/apis/video.apis'
import InputFile from '@/components/input-file'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { EncodingStatus, VideoAudience } from '@/constants/enum'
import useVideoCategories from '@/hooks/useVideoCategories'
import useVideoStatus from '@/hooks/useVideoStatus'
import { cn } from '@/lib/utils'
import { CreateVideoSchema, createVideoSchema } from '@/rules/video.rules'
import { Skeleton } from './ui/skeleton'

type UpdateVideoFormProps = {
  videoId: string
}

const CreateVideoForm = ({ videoId }: UpdateVideoFormProps) => {
  const queryClient = useQueryClient()
  const [isUploadSucceed, setIsUploadSucceed] = useState<boolean>(false)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const thumbnailPreview = useMemo(() => (thumbnailFile ? URL.createObjectURL(thumbnailFile) : ''), [thumbnailFile])
  const { videoCategories } = useVideoCategories()

  // Form
  const form = useForm<CreateVideoSchema>({
    defaultValues: {
      title: '',
      description: '',
      category: '',
      audience: ''
    },
    resolver: zodResolver(createVideoSchema)
  })

  // Query: Get video info
  const getVideoDetailQuery = useQuery({
    queryKey: ['getVideoToUpdate'],
    queryFn: () => videoApis.getVideoToUpdate(videoId)
  })

  // Video info
  const videoInfo = useMemo(
    () => getVideoDetailQuery.data?.data.data.video,
    [getVideoDetailQuery.data?.data.data.video]
  )

  // Video status
  const { videoStatus } = useVideoStatus({
    refetchIntervalEnabled: !isUploadSucceed,
    videoIdName: videoInfo?.idName || null
  })

  // Update form
  useEffect(() => {
    if (!videoInfo) return
    const { setValue } = form
    setValue('title', videoInfo.title)
    setValue('description', videoInfo.description)
    setValue('category', videoInfo.category?._id || null)
    setValue('audience', String(videoInfo.audience))
  }, [videoInfo])

  // Update video status when update succeed
  useEffect(() => {
    if (!videoStatus) return
    if (videoStatus.status === EncodingStatus.Succeed) setIsUploadSucceed(true)
  }, [videoStatus])

  // Change thumbnail file
  const handleChangeThumbnailFile = (files?: File[]) => {
    if (!files) return
    setThumbnailFile(files[0])
  }

  // Mutation: Upload image
  const uploadImagesMutation = useMutation({
    mutationKey: ['uploadImages'],
    mutationFn: mediaApis.uploadImage
  })

  // Mutation: Update video
  const updateVideoMutation = useMutation({
    mutationKey: ['updateVideo'],
    mutationFn: videoApis.updateVideo,
    onSuccess: () => {
      getVideoDetailQuery.refetch()
      toast.success('Đã lưu thay đổi')
      thumbnailFile && setThumbnailFile(null)
      queryClient.invalidateQueries({ queryKey: ['getVideosOfMe'] })
    }
  })

  // Cancel thumbnail file
  const handleResetThumbnailFile = () => {
    setThumbnailFile(null)
  }

  // Save thumbnail
  const handleSaveThumbnailImage = async () => {
    if (!thumbnailFile || !videoInfo) return
    const form = new FormData()
    form.append('image', thumbnailFile)
    const res = await uploadImagesMutation.mutateAsync(form)
    const { imageIds } = res.data.data
    updateVideoMutation.mutate({
      body: { thumbnail: imageIds[0] },
      videoId: videoInfo._id
    })
  }

  // Is updating
  const isUpdating = uploadImagesMutation.isPending || updateVideoMutation.isPending

  // Submit form
  const onSubmit = form.handleSubmit(async (data) => {
    if (!videoInfo) return
    updateVideoMutation.mutate({
      body: {
        ...data,
        audience: Number(data.audience),
        category: data.category ? data.category : undefined
      },
      videoId: videoInfo._id
    })
  })

  return (
    <div className='flex space-x-10 py-6'>
      <div className='space-y-4 w-[300px]'>
        <h3 className='font-medium text-sm leading-none'>Hình thu nhỏ</h3>
        <div className='relative'>
          {/* Thumbnail */}
          {videoInfo && !getVideoDetailQuery.isLoading && (thumbnailPreview || videoInfo.thumbnail) && (
            <Image
              width={1000}
              height={1000}
              src={thumbnailPreview ? thumbnailPreview : videoInfo.thumbnail}
              alt={videoInfo.title}
              className='w-full h-[170px] rounded-lg object-cover'
            />
          )}
          {/* Thumbnail fallback */}
          {videoInfo && !getVideoDetailQuery.isLoading && !thumbnailPreview && !videoInfo.thumbnail && (
            <div className='w-full h-[170px] rounded-lg bg-secondary flex justify-center items-center flex-col space-y-2'>
              <ImagePlus strokeWidth={1.5} />
              <span className='text-muted-foreground text-sm'>Chưa tải hình thu nhỏ</span>
            </div>
          )}
          {/* Thumbnail fetching */}
          {getVideoDetailQuery.isLoading && <Skeleton className='w-full h-[170px] rounded-lg' />}
          {/* Thumbnail actions */}
          <div className='absolute bottom-0 left-0 right-0 px-4 py-2 bg-secondary/20 rounded-b-lg flex justify-end space-x-2'>
            {!thumbnailFile && (
              <InputFile onChange={(files) => handleChangeThumbnailFile(files)}>
                <Button size='sm' className='rounded-full' onClick={handleResetThumbnailFile}>
                  Thay đổi
                </Button>
              </InputFile>
            )}
            {thumbnailFile && (
              <Fragment>
                <Button size='sm' variant='outline' className='rounded-full' onClick={handleResetThumbnailFile}>
                  Hủy bỏ
                </Button>
                <Button size='sm' disabled={isUpdating} className='rounded-full' onClick={handleSaveThumbnailImage}>
                  {isUpdating && <Loader2 className='w-3 h-3 mr-2 animate-spin' />}
                  Lưu lại
                </Button>
              </Fragment>
            )}
          </div>
        </div>
        {/* Media player */}
        {videoInfo && videoStatus?.status === EncodingStatus.Succeed && (
          <MediaPlayer src={`http://localhost:4000/static/video-hls/${videoInfo.idName}/master.m3u8`} className='z-0 '>
            <MediaProvider />
            <DefaultVideoLayout thumbnails={videoInfo.thumbnail} icons={defaultLayoutIcons} />
          </MediaPlayer>
        )}
        {/* Encoding video */}
        {!isUploadSucceed && (
          <div className='flex items-center space-x-4'>
            <Loader2 size={18} className='animate-spin stroke-muted-foreground' />
            <span className='text-sm text-muted-foreground'>Video đang được xử lý</span>
          </div>
        )}
        {/* Encoded */}
        {isUploadSucceed && (
          <div className='flex items-center space-x-4'>
            <CheckCircle2 size={20} className='fill-green-500 stroke-white dark:stroke-black' />
            <span className='text-sm text-muted-foreground'>Video đã tải lên</span>
          </div>
        )}
      </div>
      <div className='flex-1'>
        <Form {...form}>
          <form onSubmit={onSubmit} className='space-y-10'>
            {/* Title */}
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiêu đề</FormLabel>
                  <FormControl>
                    <Input type='text' placeholder='Tiêu đề video' {...field} />
                  </FormControl>
                  <FormDescription>Tiêu đề nên phù hợp với nội dung video.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Description */}
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={15}
                      placeholder='Giới thiệu về video của bạn cho người xem.'
                      className='resize-none'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Mô tả nên khái quát được nội dung của video, để người xem có thể hiểu.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Category */}
            <FormField
              control={form.control}
              name='category'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>Danh mục</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant='outline'
                          role='combobox'
                          className={cn(
                            'w-[200px] justify-between font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value
                            ? videoCategories.find((category) => category._id === field.value)?.name
                            : 'Chọn danh mục video'}
                          <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='w-[200px] p-0'>
                      <Command>
                        <CommandInput placeholder='Tìm kiếm danh mục...' className='h-9' />
                        <CommandEmpty>Không tìm thấy danh mục nào.</CommandEmpty>
                        <CommandGroup>
                          {videoCategories.map((category) => (
                            <CommandItem
                              value={category.name}
                              key={category._id}
                              onSelect={() => {
                                form.setValue('category', category._id)
                              }}
                            >
                              {category.name}
                              <CheckIcon
                                className={cn(
                                  'ml-auto h-4 w-4',
                                  category._id === field.value ? 'opacity-100' : 'opacity-0'
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Thêm video của bạn vào một danh mục để người xem dễ dàng tìm thấy hơn.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Audience */}
            <FormField
              control={form.control}
              name='audience'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Người xem</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className='w-[200px] text-muted-foreground'>
                        <SelectValue placeholder='Chọn người xem' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={String(VideoAudience.Everyone)} className='pr-10 cursor-pointer'>
                        <div className='flex items-center space-x-2'>
                          <Globe2 strokeWidth={1.5} size={18} />
                          <span>Tất cả mọi người</span>
                        </div>
                      </SelectItem>
                      <SelectItem value={String(VideoAudience.Onlyme)} className='pr-10 cursor-pointer'>
                        <div className='flex items-center space-x-2'>
                          <Lock strokeWidth={1.5} size={18} />
                          <span>Chỉ mình tôi</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Chọn người có thể xem được video này.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Submit */}
            <Button disabled={isUpdating} className='rounded-sm uppercase bg-blue-500 hover:bg-blue-600'>
              {isUpdating && <Loader2 className='w-4 h-4 mr-3 animate-spin' />}
              Lưu lại
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default CreateVideoForm
