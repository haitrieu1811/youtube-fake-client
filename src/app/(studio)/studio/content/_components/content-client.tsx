'use client'

import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import videoApis from '@/apis/video.apis'
import DataTable from '@/components/data-table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { columns as videoColumns } from '../_columns/video-columns'

const ContentClient = () => {
  // Query: Lấy danh sách video
  const getVideosQuery = useQuery({
    queryKey: ['getVideosOfMe'],
    queryFn: () => videoApis.getVideosOfMe()
  })

  // Danh sách video
  const videos = useMemo(() => getVideosQuery.data?.data.data.videos || [], [getVideosQuery.data?.data.data.videos])

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
            <DataTable columns={videoColumns} data={videos} searchField='title' />
          </TabsContent>
          <TabsContent value='post'>Change your password here.</TabsContent>
          <TabsContent value='playlist'>Change your password here.</TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default ContentClient
