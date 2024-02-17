'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import { useContext, useEffect, useMemo } from 'react'

import commentApis from '@/apis/comment.apis'
import postApis from '@/apis/post.apis'
import CommentInput from '@/components/comment-input'
import CommentList from '@/components/comment-list'
import PostItem from '@/components/post-item'
import PostItemSkeleton from '@/components/post-item-skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CommentType } from '@/constants/enum'
import useComments from '@/hooks/useComments'
import useIsClient from '@/hooks/useIsClient'
import { AppContext } from '@/providers/app-provider'

type PostDetailClientProps = {
  postId: string
}

const PostDetailClient = ({ postId }: PostDetailClientProps) => {
  const { account } = useContext(AppContext)
  const { isClient } = useIsClient()
  const { comments, setComments, getCommentsQuery, commentCount, setCommentCount, setSortBy } = useComments({
    contentId: postId
  })

  // Query: Get post detail
  const getPostDetailQuery = useQuery({
    queryKey: ['getPostDetail', postId],
    queryFn: () => postApis.getPostDetail(postId)
  })

  // Post data
  const post = useMemo(() => getPostDetailQuery.data?.data.data.post, [getPostDetailQuery.data?.data.data.post])

  // Update comment count
  useEffect(() => {
    if (!post) return
    setCommentCount(post.commentCount)
  }, [post])

  // Mutation: Add a comment
  const createCommentMutation = useMutation({
    mutationKey: ['createComment'],
    mutationFn: commentApis.createComment,
    onSuccess: (data) => {
      const { comment } = data.data.data
      setComments((prevState) => [comment, ...prevState])
      setCommentCount((prevState) => (prevState += 1))
    }
  })

  // Add a comment
  const handleCreateComment = (content: string) => {
    createCommentMutation.mutate({
      contentId: postId,
      type: CommentType.Post,
      content
    })
  }

  return (
    <div className='pl-[120px] pr-[360px] py-5'>
      {/* Post detail */}
      {post && !getPostDetailQuery.isLoading && <PostItem postData={post} isDetailMode />}
      {/* Post skeleton */}
      {getPostDetailQuery.isLoading && <PostItemSkeleton />}
      {/* Comments */}
      <div className='mt-6 space-y-8'>
        <div className='flex items-center space-x-5'>
          <h3 className='text-xl font-bold tracking-tight'>{commentCount} bình luận</h3>
          <Select
            onValueChange={(value) => {
              if (value !== 'createdAt' && value !== 'likeCount') return
              setSortBy(value)
            }}
          >
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Sắp xếp theo' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='likeCount'>Bình luận hàng đầu</SelectItem>
              <SelectItem value='createdAt'>Mới nhất xếp trước</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* Comment input */}
        <div className='flex space-x-4'>
          {isClient && (
            <Avatar className='flex-shrink-0'>
              <AvatarImage src={account?.avatar} alt={account?.channelName} />
              <AvatarFallback>{account?.channelName[0].toUpperCase()}</AvatarFallback>
            </Avatar>
          )}
          <div className='flex-1'>
            <CommentInput
              classNameInput='text-sm py-1'
              onSubmit={(value) => {
                handleCreateComment(value)
              }}
            />
          </div>
        </div>
        {/* Comments list */}
        {comments.length > 0 && (
          <CommentList
            comments={comments}
            setComments={setComments}
            fetchMoreComments={getCommentsQuery.fetchNextPage}
            hasMoreComments={getCommentsQuery.hasNextPage}
            setCommentCount={setCommentCount}
          />
        )}
      </div>
    </div>
  )
}

export default PostDetailClient
