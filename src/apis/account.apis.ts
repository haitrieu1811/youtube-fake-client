import { getRefreshTokenFromLS } from '@/lib/auth'
import http from '@/lib/http'
import {
  GetMeResponse,
  LoginReqBody,
  RegisterReqBody,
  UpdateMeResponse,
  UpdateMeReqBody,
  GetChannelByUsernameResponse
} from '@/types/account.types'
import { AuthResponse } from '@/types/auth.types'
import { OnlyMessageResponse } from '@/types/utils.types'

export const URL_LOGIN = '/accounts/login'
export const URL_LOGOUT = '/accounts/logout'
export const URL_REGISTER = '/accounts/register'
export const URL_REFRESH_TOKEN = '/accounts/refresh-token'

const accountApis = {
  // Đăng nhập
  login(body: LoginReqBody) {
    return http.post<AuthResponse>(URL_LOGIN, body)
  },

  // Đăng ký
  register(body: RegisterReqBody) {
    return http.post<AuthResponse>(URL_REGISTER, body)
  },

  // Đăng xuất
  logout() {
    const refreshToken = getRefreshTokenFromLS()
    return http.post<OnlyMessageResponse>(URL_LOGOUT, { refreshToken })
  },

  // Thông tin kênh của tôi
  getMe() {
    return http.get<GetMeResponse>('/accounts/me')
  },

  // Cập nhật kênh của tôi
  updateMe(body: UpdateMeReqBody) {
    return http.patch<UpdateMeResponse>('/accounts/me', body)
  },

  // Lấy thông tin channel theo username
  getChannelByUsername(username: string) {
    return http.get<GetChannelByUsernameResponse>(`/accounts/profile/${username}`)
  }
}

export default accountApis
