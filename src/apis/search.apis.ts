import http from '@/lib/http'
import type { SearchReqQuery, SearchResponse } from '@/types/search.types'

const searchApis = {
  // Tìm kiếm
  search(params: SearchReqQuery) {
    return http.get<SearchResponse>('/search', { params })
  }
}

export default searchApis
