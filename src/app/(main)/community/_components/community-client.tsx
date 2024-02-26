'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

import postApis from '@/apis/post.apis'
import SmallPost from '@/components/small-post'
import SmallPostSkeleton from '@/components/small-post-skeleton'
import { PostItemType } from '@/types/post.types'

const CommunityClient = () => {
  const [suggestedPosts, setSuggestedPosts] = useState<PostItemType[]>([])

  // Query: Get suggested posts
  const getSuggestedPostsQuery = useInfiniteQuery({
    queryKey: ['getSuggestedPosts'],
    queryFn: ({ pageParam }) => postApis.getSuggestedPosts({ page: String(pageParam) }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.data.data.pagination.page < lastPage.data.data.pagination.totalPages
        ? lastPage.data.data.pagination.page + 1
        : undefined
  })

  // Update suggestedPosts
  useEffect(() => {
    if (!getSuggestedPostsQuery.data) return
    const responsePosts = getSuggestedPostsQuery.data.pages.map((page) => page.data.data.posts).flat()
    setSuggestedPosts(responsePosts)
  }, [getSuggestedPostsQuery.data])

  return (
    <div className='py-6 pl-6 pr-10'>
      {/* Posts list */}
      {suggestedPosts.length > 0 && !getSuggestedPostsQuery.isLoading && (
        <InfiniteScroll
          dataLength={suggestedPosts.length}
          next={getSuggestedPostsQuery.fetchNextPage}
          hasMore={getSuggestedPostsQuery.hasNextPage}
          loader={<SmallPostSkeleton />}
          className='grid grid-cols-12 gap-3'
        >
          {suggestedPosts.map((post) => (
            <div key={post._id} className='col-span-12 md:col-span-6 lg:col-span-4'>
              <SmallPost postData={post} setPosts={setSuggestedPosts} />
            </div>
          ))}
        </InfiniteScroll>
      )}
      {/* Posts skeleton */}
      {getSuggestedPostsQuery.isLoading && (
        <div className='grid grid-cols-12 gap-3'>
          {Array(12)
            .fill(0)
            .map((_, index) => (
              <div key={index} className='col-span-12 md:col-span-6 lg:col-span-4'>
                <SmallPostSkeleton />
              </div>
            ))}
        </div>
      )}
    </div>
  )
}

export default CommunityClient
