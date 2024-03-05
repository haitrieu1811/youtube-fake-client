import { Metadata } from 'next'

import PlaylistDetail from '@/components/playlist-detail'

export const metadata: Metadata = {
  title: 'Danh sách phát - YouTube',
  description: 'Danh sách phát - YouTube'
}

type PlaylistDetailProps = {
  params: {
    id: string
  }
}

const PlaylistDetailPage = ({ params }: PlaylistDetailProps) => {
  const { id } = params
  return <PlaylistDetail playlistId={id} />
}

export default PlaylistDetailPage
