'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import { useMutation, useQuery } from '@tanstack/react-query'
import { ArrowUpFromLine, CheckCircle2, ImagePlus, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'

import mediaApis from '@/apis/media.apis'
import videoApis from '@/apis/video.apis'
import InputFile from '@/components/input-file'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { EncodingStatus, VideoAudience } from '@/constants/enum'
import { cn } from '@/lib/utils'
import { CreateVideoSchema, createVideoSchema } from '@/rules/video.rules'
import { VideoCreatedType } from '@/types/video.types'

const UploadVideo = () => {
  const router = useRouter()
  const [createdVideo, setCreatedVideo] = useState<VideoCreatedType | null>(null)
  const [isUploadSucceed, setIsUploadSucceed] = useState<boolean>(false)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)

  const thumbnailPreview = useMemo(() => (thumbnailFile ? URL.createObjectURL(thumbnailFile) : ''), [thumbnailFile])

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

  // Cập nhật lại form khi tải lên video thành công
  useEffect(() => {
    if (!createdVideo) return
    form.setValue('title', createdVideo.title)
    form.setValue('description', createdVideo.description)
    form.setValue('category', createdVideo.category)
    form.setValue('audience', createdVideo.audience.toString())
  }, [createdVideo])

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
      setCreatedVideo(newVideo)
    }
  })

  // Query: Lấy trạng thái video (đang upload, upload thành công - lỗi)
  const getVideoStatusQuery = useQuery({
    queryKey: ['getVideoStatus', createdVideo?.idName],
    queryFn: () => mediaApis.getVideoStatus((createdVideo as VideoCreatedType).idName),
    enabled: !!createdVideo,
    refetchInterval: !isUploadSucceed ? 5000 : false
  })

  // Trạng thái video
  const videoStatus = useMemo(
    () => getVideoStatusQuery.data?.data.data.videoStatus,
    [getVideoStatusQuery.data?.data.data.videoStatus]
  )

  useEffect(() => {
    if (!videoStatus) return
    if (videoStatus.status === EncodingStatus.Succeed) {
      setIsUploadSucceed(true)
    }
  }, [videoStatus])

  // Chọn video để tải lên
  const handleChangeVideoFile = async (files?: File[]) => {
    if (!files) return
    const form = new FormData()
    form.append('video', files[0])
    try {
      const res = await uploadVideoHLS.mutateAsync(form)
      const { videoIdName } = res.data.data
      createVideoMutation.mutate({
        category: videoCategories[0]._id,
        idName: videoIdName,
        thumbnail: videoCategories[0]._id,
        title: 'New my video',
        audience: VideoAudience.Onlyme
      })
    } catch (error) {
      console.log(error)
    }
  }

  // Thay đổi hình thu nhỏ video
  const handleChangeThumbnailFile = (files?: File[]) => {
    if (!files) return
    setThumbnailFile(files[0])
    form.setValue('thumbnail', 'ok')
  }

  // Hủy bỏ hình thu nhỏ đã chọn
  const handleResetThumbnailFile = () => {
    setThumbnailFile(null)
    form.setValue('thumbnail', '')
  }

  // Submit form
  const onSubmit = form.handleSubmit((data) => {
    console.log('>>> data', data)
  })

  return (
    <Dialog defaultOpen onOpenChange={() => router.back()}>
      <DialogContent className='max-w-[960px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='font-medium'>{!createdVideo ? 'Tải video lên' : 'Chi tiết'}</DialogTitle>
        </DialogHeader>
        {!createdVideo && (
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
        {createdVideo && (
          <div className='flex space-x-10 py-6'>
            <div className='space-y-4'>
              <h3 className='font-medium text-sm leading-none'>Hình thu nhỏ</h3>
              {/* Hình thu nhỏ */}
              {!!thumbnailPreview && (
                <div className='relative'>
                  <Image
                    width={200}
                    height={200}
                    src={thumbnailPreview}
                    alt=''
                    className='w-[300px] h-[170px] rounded-lg object-cover'
                  />
                  <div className='absolute bottom-0 left-0 right-0 px-4 py-2 bg-black/30 flex justify-end'>
                    <Button variant='destructive' size='sm' className='rounded-full' onClick={handleResetThumbnailFile}>
                      Hủy bỏ
                    </Button>
                  </div>
                </div>
              )}
              {/* Input file */}
              <InputFile onChange={(files) => handleChangeThumbnailFile(files)}>
                <div className='w-[300px] h-[170px] border border-dashed flex justify-center items-center flex-col space-y-4 rounded-lg'>
                  <ImagePlus strokeWidth={1.5} />
                  <span className='text-sm text-muted-foreground'>Tải hình thu nhỏ lên</span>
                </div>
              </InputFile>
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
                            <SelectItem value={String(VideoAudience.Everyone)} className='pr-10 pl-5 cursor-pointer'>
                              Tất cả mọi người
                            </SelectItem>
                            <SelectItem value={String(VideoAudience.Onlyme)} className='pr-10 pl-5 cursor-pointer'>
                              Chỉ mình tôi
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>Chọn người có thể xem được video này.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button className='rounded-sm uppercase bg-blue-700 hover:bg-blue-800 text-white'>
                    {false && <Loader2 className='w-4 h-4 mr-3 animate-spin' />}
                    Lưu
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default UploadVideo
