import http from '@/lib/http'
import {
  AddVideoToPlaylistResponse,
  CreatePlaylistReqBody,
  CreatePlaylistResponse,
  GetMyPlaylistsResponse,
  GetPlaylistByIdResponse,
  GetPlaylistsContainingVideoResponse,
  GetVideosFromPlaylistResponse,
  UpdatePlaylistReqBody,
  UpdatePlaylistResponse
} from '@/types/playlist.types'
import { OnlyMessageResponse, PaginationReqQuery } from '@/types/utils.types'

const playlistApis = {
  // Create new playlist
  create(body: CreatePlaylistReqBody) {
    return http.post<CreatePlaylistResponse>('/playlists', body)
  },

  // Get my playlists
  getMyPlaylists(params?: PaginationReqQuery) {
    return http.get<GetMyPlaylistsResponse>('/playlists/me', { params })
  },

  // Get playlists by username
  getPlaylistsByUsername({ params, username }: { params?: PaginationReqQuery; username: string }) {
    return http.get<GetMyPlaylistsResponse>(`/playlists/user/${username}`, { params })
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
  getVideosFromPlaylist({ playlistId, params }: { playlistId: string; params?: PaginationReqQuery }) {
    return http.get<GetVideosFromPlaylistResponse>(`/playlists/${playlistId}/videos`)
  },

  // Delete playlist
  deletePlaylist(playlistId: string) {
    return http.delete<OnlyMessageResponse>(`/playlists/${playlistId}`)
  },

  // Get playlists containing video
  getPlaylistsContainingVideo(videoId: string) {
    return http.get<GetPlaylistsContainingVideoResponse>(`/playlists/containing/video/${videoId}`)
  },

  // Add video to playlist
  addVideoToPlaylist({ playlistId, videoId }: { playlistId: string; videoId: string }) {
    return http.post<AddVideoToPlaylistResponse>(`/playlists/${playlistId}/add-to-playlist/video/${videoId}`)
  },

  // Remove video from playlist
  removeVideoFromPlaylist({ playlistId, videoId }: { playlistId: string; videoId: string }) {
    return http.delete<OnlyMessageResponse>(`/playlists/${playlistId}/remove-from-playlist/video/${videoId}`)
  }
}

export default playlistApis
