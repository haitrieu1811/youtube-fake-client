'use client'

import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import { useMemo } from 'react'

import postApis from '@/apis/post.apis'
import { Button } from '@/components/ui/button'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

type StudioPostDetailProps = {
  postId: string
}

const StudioPostDetail = ({ postId }: StudioPostDetailProps) => {
  // Query: Get post detail
  const getPostDetailQuery = useQuery({
    queryKey: ['getPostDetail', postId],
    queryFn: () => postApis.getPostDetail(postId)
  })

  // Post data
  const post = useMemo(() => getPostDetailQuery.data?.data.data.post, [getPostDetailQuery.data?.data.data.post])

  return (
    <div className='flex space-x-10'>
      <div className='py-5 space-y-10 w-2/3'>
        <div className='space-y-2'>
          <Label>Văn bản</Label>
          <Textarea rows={10} value={post?.content} className='resize-none' />
        </div>
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
        <Button className='bg-blue-500 hover:bg-blue-600 rounded-sm uppercase'>Lưu lại</Button>
      </div>
    </div>
  )
}

export default StudioPostDetail
