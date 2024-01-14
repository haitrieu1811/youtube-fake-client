import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import Cookies from 'js-cookie'

import { URL_LOGIN, URL_LOGOUT, URL_REFRESH_TOKEN, URL_REGISTER, URL_UPDATE_ME } from '@/apis/account.apis'
import { AccountType } from '@/types/account.types'
import { AuthResponse, RefreshTokenResponse } from '@/types/auth.types'
import {
  getAccessTokenFromLS,
  getAccountFromLS,
  getRefreshTokenFromLS,
  resetAuthLS,
  setAccessTokenToLS,
  setAccountToLS,
  setRefreshTokenToLS
} from './auth'
import { isExpiredTokenError, isUnauthorizedError } from './utils'
import { ErrorResponse } from '@/types/utils.types'

class Http {
  instance: AxiosInstance
  private accessToken: string | null = null
  private refreshToken: string | null = null
  private account: AccountType | null = null
  private refreshTokenRequest: Promise<string> | null

  constructor() {
    this.accessToken = getAccessTokenFromLS()
    this.refreshToken = getRefreshTokenFromLS()
    this.account = getAccountFromLS()
    this.refreshTokenRequest = null

    this.instance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken) {
          config.headers.Authorization = `Bearer ${this.accessToken}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    this.instance.interceptors.response.use(
      (response) => {
        const { url, method } = response.config
        // Xử lý khi đăng nhập, đăng ký
        if (url && [URL_LOGIN, URL_REGISTER].includes(url)) {
          const { accessToken, refreshToken, account } = (response.data as AuthResponse).data
          this.accessToken = accessToken
          this.refreshToken = refreshToken
          this.account = account
          setAccessTokenToLS(accessToken)
          setRefreshTokenToLS(refreshToken)
          setAccountToLS(account)
          Cookies.set('accessToken', accessToken)
        }
        // Xử lý khi cập nhật tài khoản
        if (url && method && url === URL_UPDATE_ME && method === 'patch') {
          const { accessToken, account } = (response.data as AuthResponse).data
          this.accessToken = accessToken
          this.account = account
          setAccessTokenToLS(accessToken)
          setAccountToLS(account)
        }
        // Xử lý khi đăng xuất
        if (url && url === URL_LOGOUT) {
          this.accessToken = null
          this.refreshToken = null
          this.account = null
          resetAuthLS()
          Cookies.remove('accessToken')
        }
        return response
      },
      async (error) => {
        // Xử lý lỗi 401 (Sai, thiếu hoặc hết hạn access token)
        if (isUnauthorizedError<ErrorResponse<{ name: string; message: string }>>(error)) {
          const config = error.response?.config || ({ headers: {} } as InternalAxiosRequestConfig)
          const { url } = config
          // Xử lý khi hết hạn token
          if (isExpiredTokenError(error) && url !== URL_REFRESH_TOKEN) {
            this.refreshTokenRequest = this.refreshTokenRequest
              ? this.refreshTokenRequest
              : this.handleRefreshToken().finally(() => {
                  setTimeout(() => {
                    this.refreshTokenRequest = null
                  }, 10000)
                })
            return this.refreshTokenRequest.then((access_token) => {
              config.headers.Authorization = `Bearer ${access_token}`
              // Tiếp tục request cũ nếu bị lỗi
              return this.instance({
                ...config,
                headers: {
                  ...config.headers,
                  Authorization: `Bearer ${access_token}`
                }
              })
            })
          }
          resetAuthLS()
          this.accessToken = ''
          this.refreshToken = ''
          this.account = null
        }
        return Promise.reject(error)
      }
    )
  }

  // Xử lý refresh token
  private handleRefreshToken = async () => {
    return this.instance
      .post<RefreshTokenResponse>(URL_REFRESH_TOKEN, { refreshToken: this.refreshToken })
      .then((res) => {
        const { accessToken, refreshToken } = res.data.data
        setAccessTokenToLS(accessToken)
        setRefreshTokenToLS(refreshToken)
        this.accessToken = accessToken
        this.refreshToken = refreshToken
        return accessToken
      })
      .catch((error) => {
        resetAuthLS()
        this.accessToken = ''
        this.refreshToken = ''
        throw error
      })
  }
}

const http = new Http().instance
export default http
