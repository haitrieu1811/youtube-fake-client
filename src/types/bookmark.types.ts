import { PlaylistVideoItemType } from './playlist.types'
import { PaginationType, SuccessResponse } from './utils.types'

export type OriginalBookmarkVideo = {
  _id: string
  videoId: string
  accountId: string
  createdAt: string
  updatedAt: string
}

export type BookmarkVideoResponse = SuccessResponse<{
  bookmark: OriginalBookmarkVideo
}>

export type GetBookmarkVideostResponse = SuccessResponse<{
  videos: PlaylistVideoItemType[]
  pagination: PaginationType
}>
