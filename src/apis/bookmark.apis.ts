import http from '@/lib/http'
import { BookmarkVideoResponse, GetBookmarkVideostResponse } from '@/types/bookmark.types'
import { OnlyMessageResponse, PaginationReqQuery } from '@/types/utils.types'

const bookmarkApis = {
  bookmarkVideo(videoId: string) {
    return http.post<BookmarkVideoResponse>(`/bookmarks/video/${videoId}`)
  },

  getBookmarkVideos(params?: PaginationReqQuery) {
    return http.get<GetBookmarkVideostResponse>('/bookmarks/videos', { params })
  },

  unbookmarkVideo(bookmarkId: string) {
    return http.delete<OnlyMessageResponse>(`/bookmarks/${bookmarkId}`)
  }
}

export default bookmarkApis
