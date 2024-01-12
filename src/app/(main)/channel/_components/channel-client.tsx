'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import classNames from 'classnames'
import isNull from 'lodash/isNull'
import omitBy from 'lodash/omitBy'
import {
  Camera,
  CheckCircle2,
  ChevronRight,
  Globe,
  Info,
  Loader2,
  PlaySquare,
  TrendingUp,
  UsersRound
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { useContext, useEffect, useMemo, useState } from 'react'

import accountApis from '@/apis/account.apis'
import mediaApis from '@/apis/media.apis'
import videoApis from '@/apis/video.apis'
import InputFile from '@/components/input-file'
import ProfileVideo from '@/components/profile-video'
import SubscribeButton from '@/components/subscribe-button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { toast } from '@/components/ui/use-toast'
import { ACCOUNT_MESSAGES } from '@/constants/messages'
import { AppContext } from '@/providers/app-provider'
import { VideoItemType } from '@/types/video.types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { formatViews } from '@/lib/utils'
import moment from 'moment'
import PATH from '@/constants/path'

type ChannelClientProps = {
  username?: string
}

const ChannelClient = ({ username }: ChannelClientProps) => {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { account } = useContext(AppContext)
  const isMyChannel = account?.username === username || !username
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [myVideos, setMyVideos] = useState<VideoItemType[]>([])
  const [subscribeCount, setSubscribeCount] = useState<number>(0)
  const coverReview = useMemo(() => (coverFile ? URL.createObjectURL(coverFile) : null), [coverFile])
  const avatarReview = useMemo(() => (avatarFile ? URL.createObjectURL(avatarFile) : null), [avatarFile])

  // Query: Thông tin kênh của tôi
  const getMeQuery = useQuery({
    queryKey: ['getMe'],
    queryFn: () => accountApis.getMe(),
    enabled: isMyChannel
  })

  // Query: Thông tin kênh của tôi
  const getChannelByUsernameQuery = useQuery({
    queryKey: ['getChannelByUsername', username],
    queryFn: () => accountApis.getChannelByUsername(username as string),
    enabled: !isMyChannel
  })

  // Thông tin kênh
  const channel = useMemo(() => {
    if (isMyChannel) {
      return getMeQuery.data?.data.data.me
    } else {
      return getChannelByUsernameQuery.data?.data.data.account
    }
  }, [getMeQuery.data?.data.data.me, getChannelByUsernameQuery.data?.data.data.account])

  // Query config
  const queryConfig = omitBy(
    {
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      sortBy: searchParams.get('sortBy'),
      orderBy: searchParams.get('orderBy')
    },
    isNull
  )

  // Query: Danh sách video của tôi
  const getVideosOfMeQuery = useQuery({
    queryKey: ['getVideosOfMe', queryConfig],
    queryFn: () => videoApis.getVideosOfMe(queryConfig)
  })

  // Query: Danh sách video theo username
  const getVideosByUsername = useQuery({
    queryKey: ['getVideosByUsername', queryConfig],
    queryFn: () => videoApis.getVideosByUsername({ params: queryConfig, username: username as string }),
    enabled: !isMyChannel
  })

  // Cập nhật danh sách video
  useEffect(() => {
    if (isMyChannel) {
      if (!getVideosOfMeQuery.data) return
      setMyVideos(getVideosOfMeQuery.data.data.data.videos)
    } else {
      if (!getVideosByUsername.data) return
      setMyVideos(getVideosByUsername.data.data.data.videos)
    }
  }, [getVideosOfMeQuery.data, getVideosByUsername.data])

  // Cập nhật isSubscribed
  useEffect(() => {
    if (isMyChannel) {
      if (!getMeQuery.data) return
      setSubscribeCount(getMeQuery.data.data.data.me.subscribeCount)
    } else {
      if (!getChannelByUsernameQuery.data) return
      setSubscribeCount(getChannelByUsernameQuery.data.data.data.account.subscribeCount)
    }
  }, [getMeQuery.data, getChannelByUsernameQuery.data])

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

  // Thông tin chi tiết kênh
  const channelDetailArr = useMemo(() => {
    if (!channel) return []
    return [
      {
        icon: Globe,
        text: `${process.env.NEXT_PUBLIC_BASE_URL}/@${channel?.username}`
      },
      {
        icon: UsersRound,
        text: `${formatViews(channel.subscribeCount)} người đăng ký`
      },
      {
        icon: PlaySquare,
        text: `${channel.videoCount} video`
      },
      {
        icon: TrendingUp,
        text: `${channel.totalViewCount} lượt xem`
      },
      {
        icon: Info,
        text: `Đã tham gia từ ${moment(channel.createdAt).date()} thg ${
          moment(channel.createdAt).month() + 1
        }, ${moment(channel.createdAt).year()}`
      }
    ]
  }, [channel])

  return (
    <TooltipProvider>
      {channel && (
        <div className='px-24 pb-10'>
          {/* Ảnh bìa */}
          <div
            className={classNames({
              'relative h-[170px] bg-muted bg-center bg-cover mt-2 rounded-lg group': true,
              'cursor-pointer': isMyChannel
            })}
            style={{
              backgroundImage: coverReview ? `url(${coverReview})` : channel.cover ? `url(${channel.cover})` : undefined
            }}
          >
            {isMyChannel && (
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
            )}
            {coverFile && isMyChannel && (
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
          <div className='mt-4 flex space-x-6 pr-[360px]'>
            {/* Ảnh đại diện */}
            <div
              className={classNames({
                'relative group': true,
                'cursor-pointer': isMyChannel
              })}
            >
              <Avatar className='w-[160px] h-[160px]'>
                <AvatarImage src={avatarReview ? avatarReview : channel.avatar} className='object-cover' />
                <AvatarFallback className='text-5xl font-semibold'>{channel.username[0].toUpperCase()} </AvatarFallback>
              </Avatar>
              {isMyChannel && (
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
              )}
              {avatarFile && isMyChannel && (
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
            {/* Thông tin */}
            <div className='flex-1 space-y-3'>
              <div className='flex items-center space-x-4'>
                <h2 className='font-bold text-4xl'>{channel.channelName}</h2>
                {channel.tick && (
                  <Tooltip>
                    <TooltipTrigger>
                      <CheckCircle2 className='fill-blue-500 stroke-white dark:stroke-black' />
                    </TooltipTrigger>
                    <TooltipContent>Đã xác minh</TooltipContent>
                  </Tooltip>
                )}
              </div>
              <div className='flex items-center space-x-3'>
                <div className='text-sm text-muted-foreground'>@{channel.username}</div>
                <span className='w-1 h-1 rounded-full bg-muted-foreground' />
                <div className='text-sm text-muted-foreground'>{subscribeCount} người đăng ký</div>
                <span className='w-1 h-1 rounded-full bg-muted-foreground' />
                <div className='text-sm text-muted-foreground'>{channel.videoCount} video</div>
              </div>
              {/* Bio */}
              <Dialog>
                <DialogTrigger asChild>
                  <div className='flex items-center cursor-pointer space-x-2'>
                    <div className='line-clamp-1 text-sm text-muted-foreground'>
                      {channel.bio || 'Tìm hiểu về kênh này'}
                    </div>
                    <ChevronRight size={20} strokeWidth={1.5} className='flex-shrink-0 stroke-muted-foreground' />
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Giới thiệu</DialogTitle>
                    <DialogDescription>{channel.bio}</DialogDescription>
                  </DialogHeader>
                  <h3 className='font-semibold text-xl tracking-tight'>Chi tiết kênh</h3>
                  <div className='space-y-5'>
                    {channelDetailArr.map((item) => (
                      <div key={item.text} className='flex items-center space-x-5'>
                        <item.icon size={20} strokeWidth={1.5} className='flex-shrink-0' />
                        <span className='text-sm'>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
              {isMyChannel && (
                <div className='space-x-4'>
                  <Button variant='secondary' className='rounded-full' asChild>
                    <Link href={PATH.STUDIO_CUSTOM}>Tùy chỉnh kênh</Link>
                  </Button>
                  <Button variant='secondary' className='rounded-full' asChild>
                    <Link href={PATH.STUDIO_CONTENT}>Quản lý video</Link>
                  </Button>
                </div>
              )}
              {!isMyChannel && (
                <SubscribeButton
                  isSubscribedBefore={channel.isSubscribed}
                  channelId={channel._id}
                  channelName={channel.channelName}
                  onSubscribeSuccess={() => setSubscribeCount((prevState) => (prevState += 1))}
                  onUnsubscribeSuccess={() => setSubscribeCount((prevState) => (prevState -= 1))}
                />
              )}
            </div>
          </div>
          <div className='mt-10'>
            <Tabs defaultValue='home'>
              <TabsList>
                <TabsTrigger value='home'>Trang chủ</TabsTrigger>
                <TabsTrigger value='video'>Video</TabsTrigger>
                <TabsTrigger value='playlist'>Danh sách phát</TabsTrigger>
                <TabsTrigger value='community'>Cộng đồng</TabsTrigger>
              </TabsList>
              <TabsContent value='home'>
                <h2 className='font-semibold text-xl my-6'>Video nổi bật</h2>
                <div className='grid grid-cols-12 gap-5'>
                  {myVideos.map((video) => (
                    <div key={video._id} className='col-span-12 md:col-span-6 lg:col-span-3'>
                      <ProfileVideo videoData={video} />
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value='video'>
                <ToggleGroup type='single' defaultValue='latest' className='justify-normal my-6 gap-3'>
                  <ToggleGroupItem value='latest' aria-label='Toggle latest' asChild>
                    <Link
                      href={{
                        pathname,
                        query: {
                          ...queryConfig,
                          sortBy: 'createdAt',
                          orderBy: 'desc'
                        }
                      }}
                    >
                      Mới nhất
                    </Link>
                  </ToggleGroupItem>
                  <ToggleGroupItem value='popular' aria-label='Toggle popular' asChild>
                    <Link
                      href={{
                        pathname,
                        query: {
                          ...queryConfig,
                          sortBy: 'viewCount',
                          orderBy: 'desc'
                        }
                      }}
                    >
                      Phổ biến
                    </Link>
                  </ToggleGroupItem>
                  <ToggleGroupItem value='oldest' aria-label='Toggle oldest' asChild>
                    <Link
                      href={{
                        pathname,
                        query: {
                          ...queryConfig,
                          sortBy: 'createdAt',
                          orderBy: 'asc'
                        }
                      }}
                    >
                      Cũ nhất
                    </Link>
                  </ToggleGroupItem>
                </ToggleGroup>
                <div className='grid grid-cols-12 gap-5'>
                  {myVideos.map((video) => (
                    <div key={video._id} className='col-span-12 md:col-span-6 lg:col-span-3'>
                      <ProfileVideo videoData={video} />
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value='playlist'>Change your password here.</TabsContent>
              <TabsContent value='community'>Change your password here.</TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </TooltipProvider>
  )
}

export default ChannelClient
