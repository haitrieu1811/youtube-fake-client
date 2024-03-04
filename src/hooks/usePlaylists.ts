import { useInfiniteQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import playlistApis from '@/apis/playlist.apis'
import { PlaylistItemType } from '@/types/playlist.types'

type UsePlaylistsProps = {
  username?: string
}

const usePlaylists = ({ username }: UsePlaylistsProps) => {
  const [playlists, setPlaylists] = useState<PlaylistItemType[]>([])

  const getMyPlaylistsQuery = useInfiniteQuery({
    queryKey: ['getMyPlaylists'],
    queryFn: ({ pageParam }) => playlistApis.getMyPlaylists({ page: String(pageParam), limit: '10' }),
    enabled: !username,
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.data.data.pagination.page < lastPage.data.data.pagination.totalPages
        ? lastPage.data.data.pagination.page + 1
        : undefined
  })

  const getPlaylistsByUsernameQuery = useInfiniteQuery({
    queryKey: ['getPlaylistsByUsername', username],
    queryFn: ({ pageParam }) =>
      playlistApis.getPlaylistsByUsername({
        username: username as string,
        params: { page: String(pageParam), limit: '10' }
      }),
    enabled: !!username,
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.data.data.pagination.page < lastPage.data.data.pagination.totalPages
        ? lastPage.data.data.pagination.page + 1
        : undefined
  })

  useEffect(() => {
    let responsePlaylists: PlaylistItemType[] = []
    if (!username) {
      if (!getMyPlaylistsQuery.data) return
      responsePlaylists = getMyPlaylistsQuery.data.pages.map((page) => page.data.data.playlists).flat()
    } else {
      if (!getPlaylistsByUsernameQuery.data) return
      responsePlaylists = getPlaylistsByUsernameQuery.data.pages.map((page) => page.data.data.playlists).flat()
    }
    setPlaylists(responsePlaylists)
  }, [getMyPlaylistsQuery.data, getPlaylistsByUsernameQuery.data])

  return {
    getMyPlaylistsQuery,
    playlists
  }
}

export default usePlaylists
