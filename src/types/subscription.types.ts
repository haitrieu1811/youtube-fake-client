import { PaginationType, SuccessResponse } from './utils.types'

export type SubscribedChannelType = {
  _id: string
  username: string
  channelName: string
  avatar: string
  tick: boolean
  createdAt: string
  updatedAt: string
}

// Response: Lấy danh sách kênh đã đăng ký
export type GetSubscribedChannelsResponse = SuccessResponse<{
  channels: SubscribedChannelType[]
  pagination: PaginationType
}>
