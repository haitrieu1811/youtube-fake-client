import { getRefreshTokenFromLS } from '@/lib/auth'
import http from '@/lib/http'
import { LoginReqBody } from '@/types/account.types'
import { AuthResponse } from '@/types/auth.types'
import { OnlyMessageResponse } from '@/types/utils.types'

export const URL_LOGIN = '/accounts/login'
export const URL_LOGOUT = '/accounts/logout'

const accountApis = {
  // Đăng nhập
  login(body: LoginReqBody) {
    return http.post<AuthResponse>(URL_LOGIN, body)
  },

  // Đăng xuất
  logout() {
    const refreshToken = getRefreshTokenFromLS()
    return http.post<OnlyMessageResponse>(URL_LOGOUT, { refreshToken })
  }
}

export default accountApis
