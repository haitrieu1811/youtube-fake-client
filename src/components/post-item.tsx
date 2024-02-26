import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Globe2, Loader2, Lock, MessageSquareText } from 'lucide-react'
import moment from 'moment'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChangeEvent, Dispatch, Fragment, SetStateAction, useState } from 'react'
import toast from 'react-hot-toast'

import postApis from '@/apis/post.apis'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PostAudience } from '@/constants/enum'
import PATH from '@/constants/path'
import { convertMomentToVietnamese } from '@/lib/utils'
import { PostItemType } from '@/types/post.types'
import PostActions from './post-actions'
import PostReaction from './post-reaction'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'

type PostItemProps = {
  postData: PostItemType
  setPosts?: Dispatch<SetStateAction<PostItemType[]>>
  isDetailMode?: boolean
}

const MAX_LENGTH_OF_CONTENT = 50

const audiencesObj = {
  [PostAudience.Everyone]: {
    icon: <Globe2 size={12} className='text-muted-foreground' />,
    text: 'Mọi người'
  },
  [PostAudience.Onlyme]: {
    icon: <Lock size={12} className='text-muted-foreground' />,
    text: 'Chỉ mình tôi'
  }
}

const PostItem = ({ postData, setPosts, isDetailMode = false }: PostItemProps) => {
  const queryClient = useQueryClient()
  const router = useRouter()
  const [isExpandContent, setIsExpandContent] = useState<boolean>(false)
  const [currentContent, setCurrentContent] = useState<string>('')
  const [currentAudience, setCurrentAudience] = useState<PostAudience>(PostAudience.Everyone)

  // Toggle expand content
  const handleToggleExpandContent = () => {
    setIsExpandContent((prevState) => !prevState)
  }

  // Handle start update
  const handleStartUpdate = () => {
    setCurrentContent(postData.content)
    setCurrentAudience(postData.audience)
  }

  // Handle stop update
  const handleStopUpdate = () => {
    setCurrentContent('')
  }

  // Mutation: Update post
  const updatePostMutation = useMutation({
    mutationKey: ['updatePost'],
    mutationFn: postApis.update,
    onSuccess: () => {
      toast.success('Cập nhật bài viết thành công')
      handleStopUpdate()
      isDetailMode && queryClient.invalidateQueries({ queryKey: ['getPostDetail'] })
      setPosts &&
        setPosts((prevState) =>
          prevState.map((post) => {
            if (post._id === postData._id) {
              return {
                ...post,
                content: currentContent,
                audience: currentAudience
              }
            }
            return post
          })
        )
    }
  })

  // Handle change content
  const handleChangeContent = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentContent(e.target.value)
  }

  // Handle update
  const handleUpdate = () => {
    updatePostMutation.mutate({
      postId: postData._id,
      body: {
        audience: currentAudience,
        content: currentContent
      }
    })
  }

  // Mutation: Delete posts
  const deletePostsMutation = useMutation({
    mutationKey: ['deletePosts'],
    mutationFn: postApis.delete,
    onSuccess: () => {
      toast.success('Xóa bài viết thành công')
      setPosts && setPosts((prevState) => prevState.filter((post) => post._id !== postData._id))
      isDetailMode && router.back()
    }
  })

  // Handle delete posts
  const handleDelete = () => {
    deletePostsMutation.mutate([postData._id])
  }

  return (
    <TooltipProvider>
      <div className='flex space-x-5 border border-border rounded-xl p-5'>
        <div className='flex-shrink-0'>
          {/* Avatar */}
          <Link href={PATH.PROFILE(postData.author.username)}>
            <Avatar>
              <AvatarImage src={postData.author.avatar} alt={postData.author.channelName} />
              <AvatarFallback>{postData.author.channelName[0].toUpperCase()}</AvatarFallback>
            </Avatar>
          </Link>
        </div>
        <div className='flex-1 space-y-2'>
          <div className='flex items-center'>
            <div className='flex items-center space-x-2'>
              {/* Channel name */}
              <Link href={PATH.PROFILE(postData.author.username)} className='text-[13px] font-medium'>
                {postData.author.channelName}
              </Link>
              {/* Created at */}
              <span className='text-xs text-muted-foreground'>
                {convertMomentToVietnamese(moment(postData.createdAt).fromNow())}
              </span>
            </div>
            <div className='ml-3'>
              {/* Audience */}
              {!currentContent.trim() && (
                <Tooltip>
                  <TooltipTrigger>{audiencesObj[postData.audience].icon}</TooltipTrigger>
                  <TooltipContent>{audiencesObj[postData.audience].text}</TooltipContent>
                </Tooltip>
              )}
              {/* Change audience */}
              {!!currentContent.trim() && (
                <Select
                  value={String(currentAudience)}
                  onValueChange={(value) => {
                    setCurrentAudience(Number(value))
                  }}
                >
                  <SelectTrigger className='w-auto space-x-5'>
                    <SelectValue placeholder='Theme' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={String(PostAudience.Everyone)}>Công khai</SelectItem>
                    <SelectItem value={String(PostAudience.Onlyme)}>Chỉ mình tôi</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
          <div className='space-y-2'>
            <div className='space-y-3'>
              {/* Content */}
              {!currentContent.trim() && (
                <div className='whitespace-pre-line text-sm'>
                  {postData.content.split(' ').length <= MAX_LENGTH_OF_CONTENT
                    ? postData.content
                    : !isExpandContent
                    ? postData.content.split(' ').slice(0, MAX_LENGTH_OF_CONTENT).join(' ') + '...'
                    : postData.content}
                </div>
              )}
              {/* Content value for update */}
              {!!currentContent.trim() && (
                <Fragment>
                  <Textarea
                    autoFocus
                    rows={10}
                    value={currentContent}
                    className='resize-none'
                    onChange={handleChangeContent}
                  />
                  <div className='flex items-center justify-end space-x-2'>
                    <Button variant='ghost' className='rounded-full' onClick={handleStopUpdate}>
                      Hủy
                    </Button>
                    <Button
                      disabled={updatePostMutation.isPending}
                      className='rounded-full bg-blue-500 hover:bg-blue-500'
                      onClick={handleUpdate}
                    >
                      {updatePostMutation.isPending && (
                        <Loader2 strokeWidth={1.5} size={16} className='animate-spin mr-2' />
                      )}
                      Cập nhật
                    </Button>
                  </div>
                </Fragment>
              )}
              {/* See more/less content */}
              {postData.content.split(' ').length > MAX_LENGTH_OF_CONTENT && !currentContent.trim() && (
                <Button variant='link' className='p-0 h-auto text-blue-500' onClick={handleToggleExpandContent}>
                  {!isExpandContent ? 'Đọc thêm' : 'Ẩn bớt'}
                </Button>
              )}
            </div>
            {/* Carousel images */}
            {postData.images.length > 0 && !currentContent.trim() && (
              <Carousel className='w-[638px]'>
                <CarouselContent>
                  {postData.images.map((image) => (
                    <CarouselItem key={image}>
                      <Image
                        width={1000}
                        height={1000}
                        src={image}
                        alt={image}
                        className='rounded-xl h-[638px] w-[638px] object-cover'
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className='-left-5 w-10 h-10' />
                <CarouselNext className='-right-5 w-10 h-10' />
              </Carousel>
            )}
            {!currentContent.trim() && (
              <div className='flex items-center space-x-6'>
                {/* Likes and dislikes */}
                <div className='-ml-2.5'>
                  <PostReaction postData={postData} isDetailMode={isDetailMode} setPosts={setPosts} />
                </div>
                {/* Comments */}
                {!isDetailMode && (
                  <div className='flex items-center space-x-0.5'>
                    <Button size='icon' variant='ghost' className='rounded-full' asChild>
                      <Link href={PATH.POST_DETAIL(postData._id)}>
                        <MessageSquareText strokeWidth={1.5} size={16} />
                      </Link>
                    </Button>
                    <span className='text-muted-foreground text-sm'>{postData.commentCount}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        {/* Actions */}
        <PostActions postData={postData} onUpdate={handleStartUpdate} onDelete={handleDelete} />
      </div>
    </TooltipProvider>
  )
}

export default PostItem
