import { zodResolver } from '@hookform/resolvers/zod'
import { CheckedState } from '@radix-ui/react-checkbox'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Flag, Globe2, History, ListPlus, Loader2, Lock, MoreVertical, Plus, Share2 } from 'lucide-react'
import { ReactNode, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import InfiniteScroll from 'react-infinite-scroll-component'

import bookmarkApis from '@/apis/bookmark.apis'
import playlistApis from '@/apis/playlist.apis'
import ShareContent from '@/components/share-content'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PlaylistAudience } from '@/constants/enum'
import usePlaylists from '@/hooks/usePlaylists'
import { CreatePlaylistSchema, createPlaylistSchema } from '@/rules/playlist.rules'
import { PlaylistVideoItemType } from '@/types/playlist.types'
import { SearchResultItem } from '@/types/search.types'
import { VideoItemType } from '@/types/video.types'
import { WatchHistoryItemType } from '@/types/watchHistory.types'
import { Button } from './ui/button'
import { Input } from './ui/input'

type VideoActionsProps = {
  videoData: VideoItemType | SearchResultItem | WatchHistoryItemType | PlaylistVideoItemType
  extendedActions?: ReactNode
}

const VideoActions = ({ videoData, extendedActions }: VideoActionsProps) => {
  const { playlists, getMyPlaylistsQuery } = usePlaylists({})

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState<boolean>(false)

  const getPlaylistsContainingVideoQuery = useQuery({
    queryKey: ['getPlaylistsContainingVideo', videoData._id],
    queryFn: () => playlistApis.getPlaylistsContainingVideo(videoData._id),
    enabled: isOpen
  })

  const playlistsContainingVideo = useMemo(
    () => getPlaylistsContainingVideoQuery.data?.data.data.playlists || [],
    [getPlaylistsContainingVideoQuery.data?.data.data.playlists]
  )

  const createPlaylistForm = useForm<CreatePlaylistSchema>({
    resolver: zodResolver(createPlaylistSchema),
    defaultValues: {
      name: '',
      description: '',
      audience: String(PlaylistAudience.Everyone)
    }
  })

  const bookmarkVideoMutation = useMutation({
    mutationKey: ['bookmarkVideo'],
    mutationFn: bookmarkApis.bookmarkVideo,
    onSuccess: () => {
      toast.success('Đã lưu vào danh sách Xem sau')
    }
  })

  const addVideoToPlaylistMutation = useMutation({
    mutationKey: ['addVideoToPlaylist'],
    mutationFn: playlistApis.addVideoToPlaylist
  })

  const removeVideoFromPlaylistMutation = useMutation({
    mutationKey: ['removeVideoFromPlaylist'],
    mutationFn: playlistApis.removeVideoFromPlaylist
  })

  const handleAddAndRemoveVideoInPlaylist = ({
    checked,
    playlistId
  }: {
    checked: CheckedState
    playlistId: string
  }) => {
    if (checked) {
      addVideoToPlaylistMutation.mutate(
        { videoId: videoData._id, playlistId },
        {
          onSuccess: (data) => {
            const { playlistId } = data.data.data.playlistVideo
            const playlistName = playlists.find((playlist) => playlist._id === playlistId)?.name
            toast.success(`Đã thêm vào ${playlistName}`)
            getPlaylistsContainingVideoQuery.refetch()
          }
        }
      )
    } else {
      removeVideoFromPlaylistMutation.mutate(
        { videoId: videoData._id, playlistId },
        {
          onSuccess: () => {
            const playlistName = playlists.find((playlist) => playlist._id === playlistId)?.name
            toast.success(`Đã xóa khỏi ${playlistName}`)
            getPlaylistsContainingVideoQuery.refetch()
          }
        }
      )
    }
  }

  const createPlaylistMutation = useMutation({
    mutationKey: ['createPlaylist'],
    mutationFn: playlistApis.create
  })

  const handleCreatePlaylist = createPlaylistForm.handleSubmit((data) => {
    const { name, description, audience } = data
    createPlaylistMutation.mutate(
      {
        name,
        description,
        audience: Number(audience)
      },
      {
        onSuccess: (data) => {
          addVideoToPlaylistMutation.mutate(
            {
              videoId: videoData._id,
              playlistId: data.data.data.playlist._id
            },
            {
              onSuccess: () => {
                setIsOpen(false)
                createPlaylistForm.reset()
                setIsCreatingPlaylist(false)
                getMyPlaylistsQuery.refetch()
                toast.success(`Đã thêm vào ${name}`)
                getPlaylistsContainingVideoQuery.refetch()
              }
            }
          )
        }
      }
    )
  })

  return (
    <DropdownMenu open={isOpen} onOpenChange={(value) => setIsOpen(value)}>
      <DropdownMenuTrigger asChild>
        <Button size='icon' variant='ghost' className='w-9 h-9 rounded-full'>
          <MoreVertical strokeWidth={1.5} size={18} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='px-0 py-2 w-auto rounded-xl'>
        <Button
          variant='ghost'
          className='flex w-full pr-10 justify-start space-x-3 rounded-none'
          onClick={() => bookmarkVideoMutation.mutate(videoData._id)}
        >
          <History size={18} strokeWidth={1.5} />
          <span>Lưu vào danh sách xem sau</span>
        </Button>
        <Button variant='ghost' className='flex w-full pr-10 justify-start space-x-3 rounded-none'>
          <Flag size={18} strokeWidth={1.5} />
          <span>Báo vi phạm</span>
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant='ghost' className='flex w-full pr-10 justify-start space-x-3 rounded-none'>
              <ListPlus size={18} strokeWidth={1.5} />
              <span>Thêm vào playlist</span>
            </Button>
          </DialogTrigger>
          <DialogContent className='max-w-md pb-2'>
            <DialogHeader>
              <DialogTitle>Lưu video vào...</DialogTitle>
            </DialogHeader>
            {playlists.length > 0 && (
              <div id='playlists' className='max-h-[330px] overflow-y-auto'>
                <InfiniteScroll
                  dataLength={playlists.length}
                  next={getMyPlaylistsQuery.fetchNextPage}
                  hasMore={getMyPlaylistsQuery.hasNextPage}
                  loader={
                    <div className='flex justify-center items-center py-2'>
                      <Loader2 className='animate-spin' />
                    </div>
                  }
                  className='space-y-5 pt-5 pr-2'
                  scrollableTarget='playlists'
                >
                  {playlists.map((playlist) => (
                    <div key={playlist._id} className='flex items-center justify-between space-x-5'>
                      <Checkbox
                        defaultChecked={playlistsContainingVideo.includes(playlist._id)}
                        id={playlist._id}
                        value={playlist._id}
                        onCheckedChange={(value) =>
                          handleAddAndRemoveVideoInPlaylist({ checked: value, playlistId: playlist._id })
                        }
                      />
                      <label htmlFor={playlist._id} className='flex-1 text-sm line-clamp-1 cursor-pointer'>
                        {playlist.name}
                      </label>
                      {playlist.audience === PlaylistAudience.Everyone && <Globe2 size={16} />}
                      {playlist.audience === PlaylistAudience.Onlyme && <Lock size={16} />}
                    </div>
                  ))}
                </InfiniteScroll>
              </div>
            )}
            <div className='flex justify-center mt-4'>
              {isCreatingPlaylist && (
                <Form {...createPlaylistForm}>
                  <form onSubmit={handleCreatePlaylist} className='w-full space-y-4 mb-3'>
                    <FormField
                      control={createPlaylistForm.control}
                      name='name'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tên</FormLabel>
                          <FormControl>
                            <Input type='text' placeholder='Nhập tên danh sách phát' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={createPlaylistForm.control}
                      name='audience'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quyền riêng tư</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder='Riêng tư' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value={String(PlaylistAudience.Everyone)}>Mọi người</SelectItem>
                              <SelectItem value={String(PlaylistAudience.Onlyme)}>Chỉ mình tôi</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    <div className='flex justify-end space-x-2'>
                      <Button
                        type='button'
                        variant='ghost'
                        className='rounded-full'
                        onClick={() => setIsCreatingPlaylist(false)}
                      >
                        Hủy
                      </Button>
                      <Button
                        type='submit'
                        disabled={createPlaylistMutation.isPending || addVideoToPlaylistMutation.isPending}
                        className='rounded-full'
                      >
                        {(createPlaylistMutation.isPending || addVideoToPlaylistMutation.isPending) && (
                          <Loader2 size={16} className='animate-spin mr-3' />
                        )}
                        Tạo
                      </Button>
                    </div>
                  </form>
                </Form>
              )}
              {!isCreatingPlaylist && (
                <Button variant='ghost' className='rounded-full' onClick={() => setIsCreatingPlaylist(true)}>
                  <Plus size={18} strokeWidth={1.5} className='mr-3' /> Tạo danh sách phát mới
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
        <ShareContent sharedContentData={videoData}>
          <Button variant='ghost' className='flex w-full pr-10 justify-start space-x-3 rounded-none'>
            <Share2 size={18} strokeWidth={1.5} />
            <span>Chia sẻ</span>
          </Button>
        </ShareContent>
        {extendedActions}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default VideoActions
