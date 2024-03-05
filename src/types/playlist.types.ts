import { PlaylistAudience } from '@/constants/enum'
import { PaginationType, SuccessResponse } from './utils.types'

// Original playlist
export type OriginalPlaylist = {
  _id: string
  name: string
  description: string
  audience: PlaylistAudience
  createdAt: string
  updatedAt: string
}

// Playlist item type
export type PlaylistItemType = {
  _id: string
  firstVideoIdName: string
  name: string
  thumbnail: string
  description: string
  audience: PlaylistAudience
  videoCount: number
  createdAt: string
  updatedAt: string
}

// Playlist video type
export type PlaylistVideoItemType = {
  _id: string
  playlistId: string
  author: {
    _id: string
    username: string
    channelName: string
    avatar: string
    tick: boolean
    createdAt: string
    updatedAt: string
  }
  title: string
  idName: string
  thumbnail: string
  description: string
  viewCount: number
  addedAt: string
  createdAt: string
  updatedAt: string
}

// Request: Create new playlist
export type CreatePlaylistReqBody = {
  name: string
  description?: string
  audience?: PlaylistAudience
}

// Request: Create new playlist
export type UpdatePlaylistReqBody = {
  name?: string
  description?: string
  audience?: PlaylistAudience
}

// Response: Create new playlist
export type CreatePlaylistResponse = SuccessResponse<{
  playlist: OriginalPlaylist
}>

// Response: Get my playlists
export type GetMyPlaylistsResponse = SuccessResponse<{
  playlists: PlaylistItemType[]
  pagination: PaginationType
}>

// Response: Get playlist by id
export type GetPlaylistByIdResponse = SuccessResponse<{
  playlist: OriginalPlaylist
}>

// Response: Update a playlist
export type UpdatePlaylistResponse = SuccessResponse<{
  playlist: OriginalPlaylist
}>

// Response: Get videos from playlist
export type GetVideosFromPlaylistResponse = SuccessResponse<{
  playlistName: string
  videos: PlaylistVideoItemType[]
  pagination: PaginationType
}>
