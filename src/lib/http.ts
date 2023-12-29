import axios, { AxiosInstance } from 'axios'

import { URL_LOGIN } from '@/apis/account.apis'
import { AccountType } from '@/types/account.types'
import { AuthResponse } from '@/types/auth.types'
import {
  getAccessTokenFromLS,
  getAccountFromLS,
  getRefreshTokenFromLS,
  setAccessTokenToLS,
  setAccountToLS,
  setRefreshTokenToLS
} from './localStorage'

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
        if (url && url === URL_LOGIN) {
          const { accessToken, refreshToken, account } = (response.data as AuthResponse).data
          this.accessToken = accessToken
          this.refreshToken = refreshToken
          this.account = account
          setAccessTokenToLS(accessToken)
          setRefreshTokenToLS(refreshToken)
          setAccountToLS(account)
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
