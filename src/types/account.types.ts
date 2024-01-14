import { SuccessResponse } from './utils.types'

export type AccountType = {
  _id: string
  email: string
  username: string
  channelName: string
  bio: string
  avatar: string
  cover: string
  tick: boolean
  videoCount: number
  subscriptionCount: number
  createdAt: string
  updatedAt: string
}

export type ProfileType = {
  _id: string
  email: string
  username: string
  channelName: string
  bio: string
  avatar: string
  cover: string
  tick: boolean
  videoCount: number
  subscribeCount: number
  isSubscribed: boolean
  totalViewCount: number
  createdAt: string
  updatedAt: string
}

// Request: Đăng nhập
export type LoginReqBody = {
  email: string
  password: string
}

// Request: Đăng ký
export type RegisterReqBody = {
  email: string
  password: string
  confirmPassword: string
}

// Request: Cập nhật kênh của tôi
export type UpdateMeReqBody = {
  username?: string
  channelName?: string
  bio?: string
  avatar?: string
  cover?: string
}

// Response: Thông tin kênh của tôi
export type GetMeResponse = SuccessResponse<{
  accessToken: string
  refreshToken: string
  me: ProfileType
}>

// Response: Cập nhật kênh của tôi
export type UpdateMeResponse = SuccessResponse<{
  accessToken: string
  refreshToken: string
  account: AccountType
}>

// Response: Lấy thông tin channel
export type GetChannelByUsernameResponse = SuccessResponse<{
  account: ProfileType
}>
