'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'

import postApis from '@/apis/post.apis'
import videoApis from '@/apis/video.apis'
import DataTable from '@/components/data-table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import usePlaylists from '@/hooks/usePlaylists'
import { columns as playlistColumns } from '../_columns/playlist-columns'
import { columns as postColumns } from '../_columns/post-columns'
import { columns as videoColumns } from '../_columns/video-columns'

const ContentClient = () => {
  const queryClient = useQueryClient()
  const { playlists } = usePlaylists()

  // Query: Get videos
  const getVideosQuery = useQuery({
    queryKey: ['getVideosOfMe'],
    queryFn: () => videoApis.getVideosOfMe()
  })

  // Videos
  const videos = useMemo(() => getVideosQuery.data?.data.data.videos || [], [getVideosQuery.data?.data.data.videos])

  // Query: Get posts
  const getMyPostsQuery = useQuery({
    queryKey: ['getMyPosts'],
    queryFn: () => postApis.getMyPosts()
  })

  // posts
  const posts = useMemo(() => getMyPostsQuery.data?.data.data.posts || [], [getMyPostsQuery.data?.data.data.posts])

  // Mutation: Delete videos
  const deleteVideosMutation = useMutation({
    mutationKey: ['deleteVideos'],
    mutationFn: videoApis.deleteVideos,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getVideosOfMe'] })
    }
  })

  // Mutation: Delete posts
  const deletePostsMutation = useMutation({
    mutationKey: ['deletePosts'],
    mutationFn: postApis.delete,
    onSuccess: () => {
      toast.success('Xóa bài viết thành công')
      queryClient.invalidateQueries({ queryKey: ['getMyPosts'] })
    }
  })

  return (
    <div className='p-6'>
      <h1 className='text-[25px] tracking-tight font-medium mb-10'>Nội dung của kênh</h1>
      <div>
        <Tabs defaultValue='video'>
          <TabsList>
            <TabsTrigger value='video'>Video</TabsTrigger>
            <TabsTrigger value='post'>Bài đăng</TabsTrigger>
            <TabsTrigger value='playlist'>Danh sách phát</TabsTrigger>
          </TabsList>
          <TabsContent value='video' className='py-6'>
            <DataTable
              columns={videoColumns}
              data={videos}
              searchField='title'
              onDeleteMany={(checkedIds) => deleteVideosMutation.mutate(checkedIds)}
            />
          </TabsContent>
          <TabsContent value='post' className='py-6'>
            <DataTable
              columns={postColumns}
              data={posts}
              searchField='content'
              onDeleteMany={(checkedIds) => deletePostsMutation.mutate(checkedIds)}
            />
          </TabsContent>
          <TabsContent value='playlist' className='py-6'>
            <DataTable columns={playlistColumns} data={playlists} searchField='name' />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default ContentClient
