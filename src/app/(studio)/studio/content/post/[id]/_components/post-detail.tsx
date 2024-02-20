'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import postApis from '@/apis/post.apis'
import { Button } from '@/components/ui/button'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { PostAudience } from '@/constants/enum'
import PATH from '@/constants/path'
import { UpdatePostSchema, updatePostSchema } from '@/rules/post.rules'

type StudioPostDetailProps = {
  postId: string
}

const StudioPostDetail = ({ postId }: StudioPostDetailProps) => {
  // Form
  const form = useForm<UpdatePostSchema>({
    resolver: zodResolver(updatePostSchema),
    defaultValues: {
      content: '',
      audience: ''
    }
  })

  // Query: Get post detail
  const getPostDetailQuery = useQuery({
    queryKey: ['getPostDetail', postId],
    queryFn: () => postApis.getPostDetail(postId)
  })

  // Post data
  const post = useMemo(() => getPostDetailQuery.data?.data.data.post, [getPostDetailQuery.data?.data.data.post])

  // Update form
  useEffect(() => {
    if (!post) return
    const { setValue } = form
    setValue('content', post.content)
    setValue('audience', String(post.audience))
  }, [post])

  // Mutation: Update post
  const updatePostMutation = useMutation({
    mutationKey: ['updatePost'],
    mutationFn: postApis.update,
    onSuccess: () => {
      toast.success('Cập nhật bài viết thành công')
      getPostDetailQuery.refetch()
    }
  })

  // Handle submit
  const onSubmit = form.handleSubmit((data) => {
    const { content, audience } = data
    updatePostMutation.mutate({
      postId,
      body: {
        content,
        audience: Number(audience)
      }
    })
  })

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <div className='flex space-x-10'>
          <div className='py-5 space-y-6 w-2/3 flex-shrink-0'>
            {/* Content */}
            <FormField
              control={form.control}
              name='content'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Văn bản</FormLabel>
                  <FormControl>
                    <Textarea rows={10} className='resize-none' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Carousel images */}
            {post && post.images.length > 0 && (
              <div className='space-y-2'>
                <Label>Hình ảnh</Label>
                <div className='w-[376px]'>
                  <Carousel>
                    <CarouselContent>
                      {post?.images.map((image) => (
                        <CarouselItem key={image}>
                          <Image
                            width={1000}
                            height={1000}
                            src={image}
                            alt={image}
                            className='rounded-xl h-[376px] w-[376px] object-cover'
                          />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className='-left-5 w-10 h-10' />
                    <CarouselNext className='-right-5 w-10 h-10' />
                  </Carousel>
                </div>
              </div>
            )}
            {/* Submit button */}
            <Button
              type='submit'
              disabled={updatePostMutation.isPending}
              className='bg-blue-500 hover:bg-blue-600 rounded-sm uppercase'
            >
              {updatePostMutation.isPending && <Loader2 size={16} className='animate-spin mr-2' />}
              Lưu lại
            </Button>
          </div>
          <div className='flex-1 space-y-10'>
            <div className='border border-border rounded-lg p-3'>
              {/* Like and comment count */}
              <div className='flex space-x-10'>
                <div className='space-y-1'>
                  <h4 className='text-sm text-muted-foreground'>Lượt thích</h4>
                  <div className='font-medium'>{post?.likeCount}</div>
                </div>
                <div className='space-y-1'>
                  <h4 className='text-sm text-muted-foreground'>Bình luận</h4>
                  <div className='font-medium'>{post?.commentCount}</div>
                </div>
              </div>
              <Separator className='my-3' />
              {/* Link to detail page */}
              <div className='space-y-1'>
                <h4 className='text-sm text-muted-foreground'>Đường liên kết</h4>
                <Link
                  href={PATH.POST_DETAIL(post?._id || '')}
                  target='_blank'
                  className='text-sm text-blue-600 font-medium inline-block'
                >
                  <span className='line-clamp-1'>
                    {`${process.env.NEXT_PUBLIC_BASE_URL}${PATH.POST_DETAIL(post?._id.slice(0, 10) || '')}...`}
                  </span>
                </Link>
              </div>
            </div>
            {/* Audience */}
            <FormField
              control={form.control}
              name='audience'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chế độ hiển thị</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Chế độ hiển thị' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={String(PostAudience.Everyone)}>Công khai</SelectItem>
                      <SelectItem value={String(PostAudience.Onlyme)}>Chỉ mình tôi</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </form>
    </Form>
  )
}

export default StudioPostDetail
