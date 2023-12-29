'use client'

import { AccountType } from '@/types/account.types'

export const setAccessTokenToLS = (accessToken: string) => {
  if (typeof window === 'undefined') return
  return localStorage.setItem('accessToken', accessToken)
}

export const getAccessTokenFromLS = () => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('accessToken')
}

export const removeAccessTokenFromLS = () => {
  if (typeof window === 'undefined') return
  return localStorage.removeItem('accessToken')
}

export const setRefreshTokenToLS = (refreshToken: string) => {
  if (typeof window === 'undefined') return
  return localStorage.setItem('refreshToken', refreshToken)
}

export const getRefreshTokenFromLS = () => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('refreshToken')
}

export const removeRefreshTokenFromLS = () => {
  if (typeof window === 'undefined') return
  return localStorage.removeItem('refreshToken')
}

export const setAccountToLS = (account: AccountType) => {
  if (typeof window === 'undefined') return
  return localStorage.setItem('account', JSON.stringify(account))
}

export const getAccountFromLS = (): AccountType | null => {
  if (typeof window === 'undefined') return null
  const account = localStorage.getItem('account')
  if (account) return JSON.parse(account)
  return null
}

export const removeAccountFromLS = () => {
  if (typeof window === 'undefined') return
  return localStorage.removeItem('account')
}

export const resetAuthLS = () => {
  removeAccessTokenFromLS()
  removeRefreshTokenFromLS()
  removeAccountFromLS()
}
