import { AccountType } from './account.types'
import { SuccessResponse } from './utils.types'

export type AuthResponse = SuccessResponse<{
  accessToken: string
  refreshToken: string
  account: AccountType
}>
