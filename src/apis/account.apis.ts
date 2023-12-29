import http from '@/lib/http'
import { LoginReqBody } from '@/types/account.types'
import { AuthResponse } from '@/types/auth.types'

export const URL_LOGIN = '/accounts/login'

const accountApis = {
  // Đăng nhập
  login(body: LoginReqBody) {
    return http.post<AuthResponse>(URL_LOGIN, body)
  }
}

export default accountApis
