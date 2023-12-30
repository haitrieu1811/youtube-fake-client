import http from '@/lib/http'
import { GetSubscribedChannelsResponse } from '@/types/subscription.types'
import { PaginationReqQuery } from '@/types/utils.types'

const subscriptionApis = {
  // Danh sách kênh đã đăng ký
  getSubcribedChannels(params?: PaginationReqQuery) {
    return http.get<GetSubscribedChannelsResponse>('/subscriptions/me', { params })
  }
}

export default subscriptionApis
