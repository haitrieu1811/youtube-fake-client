import { AxiosError, HttpStatusCode, isAxiosError } from 'axios'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

import { ErrorResponse } from '@/types/utils.types'

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

// Lỗi 422 (lỗi form)
export const isEntityErrror = <FormError>(err: unknown): err is AxiosError<FormError> => {
  return isAxiosError(err) && err.response?.status === HttpStatusCode.UnprocessableEntity
}

// Lỗi 401 (liên quan đến token)
export const isUnauthorizedError = <FormError>(err: unknown): err is AxiosError<FormError> => {
  return isAxiosError(err) && err.response?.status === HttpStatusCode.Unauthorized
}

// Lỗi hết hạn token
export const isExpiredTokenError = <FormError>(error: unknown): error is AxiosError<FormError> => {
  return isUnauthorizedError<ErrorResponse<{}>>(error) && error.response?.data.message === 'Jwt expired'
}
