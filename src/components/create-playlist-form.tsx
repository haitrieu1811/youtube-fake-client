'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import playlistApis from '@/apis/playlist.apis'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PlaylistAudience } from '@/constants/enum'
import { CreatePlaylistSchema, createPlaylistSchema } from '@/rules/playlist.rules'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'

type CreatePlaylistFormProps = {
  playlistId?: string
}

const CreatePlaylistForm = ({ playlistId }: CreatePlaylistFormProps) => {
  const router = useRouter()
  const queryClient = useQueryClient()

  // Form
  const form = useForm<CreatePlaylistSchema>({
    resolver: zodResolver(createPlaylistSchema),
    defaultValues: {
      name: '',
      description: '',
      audience: String(PlaylistAudience.Everyone)
    }
  })

  // Query: Get playlist by id
  const getPlaylistByIdQuery = useQuery({
    queryKey: ['getPlaylistById', playlistId],
    queryFn: () => playlistApis.getPlaylistById(playlistId as string),
    enabled: !!playlistId
  })

  // Playlist
  const playlist = useMemo(
    () => getPlaylistByIdQuery.data?.data.data.playlist,
    [getPlaylistByIdQuery.data?.data.data.playlist]
  )

  // Update form if have playlist data
  useEffect(() => {
    if (!playlist) return
    const { setValue } = form
    const { name, description, audience } = playlist
    setValue('name', name)
    setValue('description', description)
    setValue('audience', String(audience))
  }, [playlist])

  // Mutation: Create new playlist
  const createPlaylistMutation = useMutation({
    mutationKey: ['createPlaylist'],
    mutationFn: playlistApis.create,
    onSuccess: () => {
      router.back()
      toast.success('Đã tạo danh sách phát')
      queryClient.invalidateQueries({ queryKey: ['getMyPlaylists'] })
    }
  })

  // Mutation: Update a playlist
  const updatePlaylistMutation = useMutation({
    mutationKey: ['updatePlaylist'],
    mutationFn: playlistApis.update,
    onSuccess: () => {
      getPlaylistByIdQuery.refetch()
      toast.success('Đã lưu nội dung thay đổi')
    }
  })

  // Is pending
  const isPending = createPlaylistMutation.isPending || updatePlaylistMutation.isPending

  // Handle submit
  const onSubmit = form.handleSubmit((data) => {
    const body = {
      ...data,
      audience: Number(data.audience)
    }
    if (!playlistId) createPlaylistMutation.mutate(body)
    else updatePlaylistMutation.mutate({ body, playlistId })
  })

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className='space-y-8'>
        {/* Name */}
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tiêu đề (bắt buộc)</FormLabel>
              <FormControl>
                <Input placeholder='Thêm tiêu đề' {...field} />
              </FormControl>
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
                <Textarea rows={5} placeholder='Thêm nội dung mô tả' className='resize-none' {...field} />
              </FormControl>
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
              <FormLabel>Chế độ hiển thị</FormLabel>
              <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Chế độ hiển thị' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={String(PlaylistAudience.Everyone)}>Mọi người</SelectItem>
                  <SelectItem value={String(PlaylistAudience.Onlyme)}>Chỉ mình tôi</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Submit */}
        <Button type='submit' disabled={isPending} className='uppercase bg-blue-500 hover:bg-blue-600'>
          {isPending && <Loader2 size={16} className='animate-spin mr-2' />}
          {!playlistId ? 'Tạo' : 'Lưu'}
        </Button>
      </form>
    </Form>
  )
}

export default CreatePlaylistForm
