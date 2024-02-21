import http from '@/lib/http'
import {
  CreatePlaylistReqBody,
  CreatePlaylistResponse,
  GetMyPlaylistsResponse,
  GetPlaylistByIdResponse,
  GetVideosFromPlaylistResponse,
  UpdatePlaylistReqBody,
  UpdatePlaylistResponse
} from '@/types/playlist.types'
import { PaginationReqQuery } from '@/types/utils.types'

const playlistApis = {
  // Create new playlist
  create(body: CreatePlaylistReqBody) {
    return http.post<CreatePlaylistResponse>('/playlists', body)
  },

  // Get my playlists
  getMyPlaylists(params?: PaginationReqQuery) {
    return http.get<GetMyPlaylistsResponse>('/playlists/me', { params })
  },

  // Get playlist by id
  getPlaylistById(playlistId: string) {
    return http.get<GetPlaylistByIdResponse>(`/playlists/${playlistId}`)
  },

  // Update a playlist
  update({ body, playlistId }: { body: UpdatePlaylistReqBody; playlistId: string }) {
    return http.patch<UpdatePlaylistResponse>(`/playlists/${playlistId}`, body)
  },

  // Get videos from playlist
  getVideosFromPlaylist(playlistId: string) {
    return http.get<GetVideosFromPlaylistResponse>(`/playlists/${playlistId}/videos`)
  }
}

export default playlistApis
