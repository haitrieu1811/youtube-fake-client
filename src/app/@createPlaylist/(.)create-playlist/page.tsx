'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { PlaylistAudience } from '@/constants/enum'
import { CreatePlaylistSchema, createPlaylistSchema } from '@/rules/playlist.rules'

const CreatePlaylist = () => {
  const router = useRouter()

  // Form
  const form = useForm<CreatePlaylistSchema>({
    resolver: zodResolver(createPlaylistSchema),
    defaultValues: {
      name: '',
      description: '',
      audience: String(PlaylistAudience.Everyone)
    }
  })

  // Handle submit
  const onSubmit = form.handleSubmit((data) => {
    console.log('>>> data', data)
  })

  return (
    <Dialog defaultOpen onOpenChange={() => router.back()}>
      <DialogContent className='max-w-[575px]'>
        <DialogHeader>
          <DialogTitle>Tạo danh sách phát mới</DialogTitle>
        </DialogHeader>
        <Separator className='my-2' />
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select a verified email to display' />
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
            {/* Actions */}
            <div className='flex justify-end space-x-3'>
              <Button type='button' variant='ghost' className='uppercase' onClick={() => router.back()}>
                Hủy
              </Button>
              <Button type='submit' className='uppercase bg-blue-500 hover:bg-blue-600'>
                Tạo
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default CreatePlaylist
