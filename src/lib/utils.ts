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

// Chuyển đổi moment lib từ tiếng Anh sang tiếng Việt
export const convertMomentToVietnamese = (timeString: string): string => {
  return timeString
    .replace('a few seconds ago', 'vài giây trước')
    .replace('seconds ago', 'giây trước')
    .replace('a minute ago', '1 phút trước')
    .replace('minutes ago', 'phút trước')
    .replace('an hour ago', '1 giờ trước')
    .replace('hours ago', 'giờ trước')
    .replace('a day ago', '1 ngày trước')
    .replace('days ago', 'ngày trước')
    .replace('a month ago', '1 tháng trước')
    .replace('months ago', 'tháng trước')
    .replace('a year ago', '1 năm trước')
    .replace('years ago', 'năm trước')
}

// Định dạng lượt xem
export const formatViews = (viewCount: number): string => {
  if (viewCount < 1000) {
    return viewCount.toString()
  } else if (viewCount < 1000000) {
    const thousands = Math.floor(viewCount / 1000)
    return `${thousands} N`
  } else if (viewCount < 1000000000) {
    const millions = (viewCount / 1000000).toFixed(1)
    return `${millions} Tr`
  } else {
    const billions = (viewCount / 1000000000).toFixed(1)
    return `${billions} T`
  }
}

// Sinh một số nguyên ngẫu nhiên từ 0 đến n
export const getRandomInt = (n: number) => {
  return Math.floor(Math.random() * (n + 1))
}
