import { PaginationReqQuery, PaginationType, SuccessResponse } from './utils.types'

export type SearchReqQuery = PaginationReqQuery & {
  searchQuery: string
}

export type SearchResultItem = {
  _id: string
  idName: string
  thumbnail: string
  title: string
  author: {
    _id: string
    email: string
    username: string
    channelName: string
    avatar: string
    tick: boolean
    createdAt: string
    updatedAt: string
  }
  viewCount: number
  createdAt: string
  updatedAt: string
}

// Response: Tìm kiếm
export type SearchResponse = SuccessResponse<{
  videos: SearchResultItem[]
  pagination: PaginationType
}>
