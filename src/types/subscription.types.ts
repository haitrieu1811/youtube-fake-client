import { PaginationType, SuccessResponse } from './utils.types'

export type SubscribedAccountType = {
  _id: string
  username: string
  channelName: string
  avatar: string
  tick: boolean
  subscribeCount: number
  createdAt: string
  updatedAt: string
}

// Response: Lấy danh sách kênh đã đăng ký
export type GetSubscribedAccountsResponse = SuccessResponse<{
  accounts: SubscribedAccountType[]
  pagination: PaginationType
}>
