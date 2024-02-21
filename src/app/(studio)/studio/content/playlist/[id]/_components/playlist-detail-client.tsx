'use client'

import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import playlistApis from '@/apis/playlist.apis'
import CreatePlaylistForm from '@/components/create-playlist-form'
import DataTable from '@/components/data-table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { columns as playlistVideoColumns } from '../../../_columns/playlist-video-columns'

type PlaylistDetailClientProps = {
  playlistId: string
}

const PlaylistDetailClient = ({ playlistId }: PlaylistDetailClientProps) => {
  // Query: Get videos from playlist
  const getVideosFromPlaylist = useQuery({
    queryKey: ['getVideosFromPlaylist'],
    queryFn: () => playlistApis.getVideosFromPlaylist(playlistId)
  })

  // Videos in playlist
  const videosInPlaylist = useMemo(
    () => getVideosFromPlaylist.data?.data.data.videos || [],
    [getVideosFromPlaylist.data?.data.data.videos]
  )

  return (
    <div className='p-6'>
      <h1 className='text-[25px] tracking-tight font-medium mb-4'>Thông tin chi tiết về danh sách phát</h1>
      <Tabs defaultValue='detail'>
        <TabsList>
          <TabsTrigger value='detail'>Chi tiết</TabsTrigger>
          <TabsTrigger value='video'>Video trong danh sách phát</TabsTrigger>
        </TabsList>
        <TabsContent value='detail' className='py-6'>
          <div className='w-2/3'>
            <CreatePlaylistForm playlistId={playlistId} />
          </div>
        </TabsContent>
        <TabsContent value='video' className='py-6'>
          <DataTable columns={playlistVideoColumns} data={videosInPlaylist} searchField='title' />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default PlaylistDetailClient
