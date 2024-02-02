import http from '@/lib/http'
import { GetSubscribedAccountsResponse } from '@/types/subscription.types'
import { PaginationReqQuery } from '@/types/utils.types'

const subscriptionApis = {
  // Get my subscribed accounts
  getMySubscribedAccounts(params?: PaginationReqQuery) {
    return http.get<GetSubscribedAccountsResponse>('/subscriptions/my-subscribed-accounts', { params })
  },

  // Get accounts subscribed to me
  getAccountsSubscribedToMe(params?: PaginationReqQuery) {
    return http.get<GetSubscribedAccountsResponse>('/subscriptions/accounts-subscribed-to-me', { params })
  }
}

export default subscriptionApis
