import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import playlistApis from '@/apis/playlist.apis'

const usePlaylists = () => {
  const getMyPlaylistsQuery = useQuery({
    queryKey: ['getMyPlaylists'],
    queryFn: () => playlistApis.getMyPlaylists()
  })

  const playlists = useMemo(
    () => getMyPlaylistsQuery.data?.data.data.playlists || [],
    [getMyPlaylistsQuery.data?.data.data.playlists]
  )

  return {
    getMyPlaylistsQuery,
    playlists
  }
}

export default usePlaylists
