import type { Metadata } from 'next'

import PlaylistDetailClient from './_components/playlist-detail-client'

export const metadata: Metadata = {
  title: 'Thông tin chi tiết về danh sách phát - YouYube Studio',
  description: 'Thông tin chi tiết về danh sách phát - YouYube Studio'
}

type PlaylistDetailProps = {
  params: {
    id: string
  }
}

const PlaylistDetail = ({ params }: PlaylistDetailProps) => {
  return <PlaylistDetailClient playlistId={params.id} />
}

export default PlaylistDetail
