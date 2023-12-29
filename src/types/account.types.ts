export type AccountType = {
  _id: string
  email: string
  username: string
  channelName: string
  bio: string
  avatar: string
  cover: null
  tick: boolean
  createdAt: string
  updatedAt: string
}

// Request: Đăng nhập
export type LoginReqBody = {
  email: string
  password: string
}
