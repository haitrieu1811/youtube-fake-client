import { getRefreshTokenFromLS } from '@/lib/auth'
import http from '@/lib/http'
import { LoginReqBody, RegisterReqBody } from '@/types/account.types'
import { AuthResponse } from '@/types/auth.types'
import { OnlyMessageResponse } from '@/types/utils.types'

export const URL_LOGIN = '/accounts/login'
export const URL_LOGOUT = '/accounts/logout'
export const URL_REGISTER = '/accounts/register'

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
  }
}

export default accountApis
