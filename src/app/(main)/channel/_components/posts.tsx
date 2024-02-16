'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import { useContext, useEffect, useState } from 'react'

import postApis from '@/apis/post.apis'
import PostItem from '@/components/post-item'
import { PostItemType } from '@/types/post.types'
import { ChannelClientContext } from './channel-client'
import CreatePost from './create-post'

const ChannelPosts = () => {
  const { isMyChannel, username } = useContext(ChannelClientContext)
  const [posts, setPosts] = useState<PostItemType[]>([])

  // Query: Get posts by account id
  const getPostsByAccountIdQuery = useInfiniteQuery({
    queryKey: ['getPostsByUsername'],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      postApis.getPostsByUsername({ username: username as string, params: { page: String(pageParam), limit: '10' } }),
    getNextPageParam: (lastPage) =>
      lastPage.data.data.pagination.page < lastPage.data.data.pagination.totalPages
        ? lastPage.data.data.pagination.page + 1
        : undefined,
    enabled: Boolean(!isMyChannel && username)
  })

  // Query: Get my posts
  const getMyPostsQuery = useInfiniteQuery({
    queryKey: ['getMyPosts'],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => postApis.getMyPosts({ page: String(pageParam), limit: '10' }),
    getNextPageParam: (lastPage) =>
      lastPage.data.data.pagination.page < lastPage.data.data.pagination.totalPages
        ? lastPage.data.data.pagination.page + 1
        : undefined,
    enabled: isMyChannel
  })

  // Set posts array
  useEffect(() => {
    let fetchedPosts: PostItemType[] = []
    if (isMyChannel) {
      if (getMyPostsQuery.data) fetchedPosts = getMyPostsQuery.data.pages.map((page) => page.data.data.posts).flat()
    } else {
      if (getPostsByAccountIdQuery.data)
        fetchedPosts = getPostsByAccountIdQuery.data.pages.map((page) => page.data.data.posts).flat()
    }
    setPosts(fetchedPosts)
  }, [getPostsByAccountIdQuery.data, getMyPostsQuery.data])

  return (
    <div>
      {/* Create a new post */}
      {isMyChannel && <CreatePost />}
      {/* Posts */}
      <div className='space-y-5 mt-5 w-3/4'>
        {posts.map((post) => (
          <PostItem key={post._id} postData={post} />
        ))}
      </div>
    </div>
  )
}

export default ChannelPosts
