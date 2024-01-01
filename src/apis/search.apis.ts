import http from '@/lib/http'
import type { SearchReqQuery, SearchResponse } from '@/types/search.types'

const searchApis = {
  // Tìm kiếm
  search(params: SearchReqQuery) {
    return http.get<SearchResponse>('/search', { params })
  },

  // Tìm kiếm trong channel của mình
  searchInMyChannel(params: SearchReqQuery) {
    return http.get<SearchResponse>('/search/me', { params })
  }
}

export default searchApis
