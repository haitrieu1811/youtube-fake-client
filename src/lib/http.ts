import axios, { AxiosInstance } from 'axios'
import Cookies from 'js-cookie'

import { URL_LOGIN, URL_LOGOUT, URL_REGISTER } from '@/apis/account.apis'
import { AccountType } from '@/types/account.types'
import { AuthResponse } from '@/types/auth.types'
import {
  getAccessTokenFromLS,
  getAccountFromLS,
  getRefreshTokenFromLS,
  resetAuthLS,
  setAccessTokenToLS,
  setAccountToLS,
  setRefreshTokenToLS
} from './auth'

class Http {
  instance: AxiosInstance
  private accessToken: string | null = null
  private refreshToken: string | null = null
  private account: AccountType | null = null

  constructor() {
    this.instance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
      timeout: 10000
    })

    this.accessToken = getAccessTokenFromLS()
    this.refreshToken = getRefreshTokenFromLS()
    this.account = getAccountFromLS()

    this.instance.interceptors.request.use(
      (config) => {
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config
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
        if (url && url === URL_LOGOUT) {
          this.accessToken = null
          this.refreshToken = null
          this.account = null
          resetAuthLS()
          Cookies.remove('accessToken')
        }
        return response
      },
      (error) => {
        return Promise.reject(error)
      }
    )
  }
}

const http = new Http().instance
export default http
