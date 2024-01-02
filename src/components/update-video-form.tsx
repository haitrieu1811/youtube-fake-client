'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CheckCircle2, Globe2, ImagePlus, Loader2, Lock } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'

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
import { cn } from '@/lib/utils'
import { CreateVideoSchema, createVideoSchema } from '@/rules/video.rules'

type UpdateVideoFormProps = {
  videoId: string
}

const UpdateVideoForm = ({ videoId }: UpdateVideoFormProps) => {
  const queryClient = useQueryClient()
  const router = useRouter()
  const [isUploadSucceed, setIsUploadSucceed] = useState<boolean>(false)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const thumbnailPreview = useMemo(() => (thumbnailFile ? URL.createObjectURL(thumbnailFile) : ''), [thumbnailFile])

  // Form
  const form = useForm<CreateVideoSchema>({
    defaultValues: {
      title: '',
      description: '',
      category: '',
      audience: '',
      thumbnail: ''
    },
    resolver: zodResolver(createVideoSchema)
  })

  // Query: Lấy thông tin của video
  const getVideoDetailQuery = useQuery({
    queryKey: ['getVideoDetailToUpdate'],
    queryFn: () => videoApis.getVideoDetailToUpdate(videoId)
  })

  // Thông tin video
  const videoInfo = useMemo(
    () => getVideoDetailQuery.data?.data.data.video,
    [getVideoDetailQuery.data?.data.data.video]
  )

  // Cập nhật lại form khi tải lên video thành công
  useEffect(() => {
    if (!videoInfo) return
    form.setValue('title', videoInfo.title)
    form.setValue('description', videoInfo.description)
    form.setValue('category', videoInfo.category?._id || null)
    form.setValue('audience', videoInfo.audience.toString())
    form.setValue('thumbnail', videoInfo.thumbnail)
  }, [videoInfo])

  // Query: Danh sách danh mục video
  const getVideoCategoriesQuery = useQuery({
    queryKey: ['getVideos'],
    queryFn: () => videoApis.getVideoCategories({ limit: '100' })
  })

  // Danh sách danh mục video
  const videoCategories = useMemo(
    () => getVideoCategoriesQuery.data?.data.data.categories || [],
    [getVideoCategoriesQuery.data?.data.data.categories]
  )

  // Query: Lấy trạng thái video (đang upload, upload thành công - lỗi)
  const getVideoStatusQuery = useQuery({
    queryKey: ['getVideoStatus', videoInfo?.idName],
    queryFn: () => mediaApis.getVideoStatus(videoInfo?.idName as string),
    enabled: !!videoInfo,
    refetchInterval: !isUploadSucceed ? 5000 : false
  })

  // Trạng thái video
  const videoStatus = useMemo(
    () => getVideoStatusQuery.data?.data.data.videoStatus,
    [getVideoStatusQuery.data?.data.data.videoStatus]
  )

  // Cập nhật trạng thái thành công khi encode video thành công
  useEffect(() => {
    if (!videoStatus) return
    if (videoStatus.status === EncodingStatus.Succeed) {
      setIsUploadSucceed(true)
    }
  }, [videoStatus])

  // Thay đổi hình thu nhỏ video
  const handleChangeThumbnailFile = (files?: File[]) => {
    if (!files) return
    setThumbnailFile(files[0])
    form.setValue('thumbnail', 'ok')
  }

  // Mutation: Upload ảnh
  const uploadImagesMutation = useMutation({
    mutationKey: ['uploadImages'],
    mutationFn: mediaApis.uploadImage
  })

  // Mutation: Cập nhật video
  const updateVideoMutation = useMutation({
    mutationKey: ['updateVideo'],
    mutationFn: videoApis.updateVideo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getVideosOfMe'] })
      router.back()
    }
  })

  // Hủy bỏ hình thu nhỏ đã chọn
  const handleResetThumbnailFile = () => {
    if (!videoInfo?.thumbnail) {
      setThumbnailFile(null)
      form.setValue('thumbnail', '')
    } else {
      updateVideoMutation.mutate({
        body: {
          thumbnail: null
        },
        videoId: videoInfo._id
      })
    }
  }

  const isUpdating = uploadImagesMutation.isPending || updateVideoMutation.isPending

  // Submit form
  const onSubmit = form.handleSubmit(async (data) => {
    if (!thumbnailFile || !videoInfo) return
    const form = new FormData()
    form.append('image', thumbnailFile)
    try {
      const res = await uploadImagesMutation.mutateAsync(form)
      const { imageIds } = res.data.data
      updateVideoMutation.mutate({
        body: {
          ...data,
          thumbnail: imageIds[0],
          audience: Number(data.audience),
          category: data.category ? data.category : undefined
        },
        videoId: videoInfo._id
      })
    } catch (error) {
      console.log(error)
    }
  })

  return (
    <div className='flex space-x-10 py-6'>
      <div className='space-y-4'>
        <h3 className='font-medium text-sm leading-none'>Hình thu nhỏ</h3>
        {/* Hình thu nhỏ */}
        <div className='relative'>
          {!!thumbnailPreview && (
            <Image
              width={200}
              height={200}
              src={thumbnailPreview ? thumbnailPreview : videoInfo?.thumbnail || ''}
              alt=''
              className='w-[300px] h-[170px] rounded-lg object-cover'
            />
          )}
          {videoInfo?.thumbnail && (
            <Image
              width={200}
              height={200}
              src={videoInfo.thumbnail}
              alt={videoInfo.title}
              className='w-[300px] h-[170px] rounded-lg object-cover'
            />
          )}
          {(!!thumbnailPreview || videoInfo?.thumbnail) && (
            <div className='absolute bottom-0 left-0 right-0 px-4 py-2 bg-black/30 flex justify-end'>
              <Button variant='destructive' size='sm' className='rounded-full' onClick={handleResetThumbnailFile}>
                Hủy bỏ
              </Button>
            </div>
          )}
        </div>
        {/* Input file */}
        {!videoInfo?.thumbnail && (
          <InputFile onChange={(files) => handleChangeThumbnailFile(files)}>
            <div className='w-[300px] h-[170px] border border-dashed flex justify-center items-center flex-col space-y-4 rounded-lg'>
              <ImagePlus strokeWidth={1.5} />
              <span className='text-sm text-muted-foreground'>Tải hình thu nhỏ lên</span>
            </div>
          </InputFile>
        )}
        {/* Lỗi chưa chọn hình thu nhỏ */}
        {!!form.formState.errors.thumbnail?.message && (
          <p className='text-[0.8rem] font-medium text-destructive'>{form.formState.errors.thumbnail.message}</p>
        )}
        {/* Báo video đang được tải lên */}
        {!isUploadSucceed && (
          <div className='flex items-center space-x-4'>
            <Loader2 size={18} className='animate-spin stroke-muted-foreground' />
            <span className='text-sm text-muted-foreground'>Video đang được tải lên</span>
          </div>
        )}
        {/* Báo video đã được tải lên thành công */}
        {isUploadSucceed && (
          <div className='flex items-center space-x-4'>
            <CheckCircle2 size={20} className='fill-green-600 stroke-white dark:stroke-black' />
            <span className='text-sm text-muted-foreground'>Video đã tải lên</span>
          </div>
        )}
      </div>
      <div className='flex-1'>
        <Form {...form}>
          <form onSubmit={onSubmit} className='space-y-10'>
            {/* Tiêu đề */}
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
            {/* Mô tả */}
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea rows={6} placeholder='Mô tả video' className='resize-none' {...field} />
                  </FormControl>
                  <FormDescription>
                    Mô tả nên khái quát được nội dung của video, để người xem có thể hiểu.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Danh mục video */}
            <FormField
              control={form.control}
              name='category'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>Danh mục video</FormLabel>
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
                  <FormDescription>Chọn danh mục phù hợp với video của bạn.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Người xem */}
            <FormField
              control={form.control}
              name='audience'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Người xem</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
            <Button disabled={isUpdating} className='rounded-sm uppercase bg-blue-700 hover:bg-blue-800 text-white'>
              {isUpdating && <Loader2 className='w-4 h-4 mr-3 animate-spin' />}
              Lưu
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default UpdateVideoForm
