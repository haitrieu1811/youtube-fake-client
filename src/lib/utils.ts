import { AxiosError, HttpStatusCode, isAxiosError } from 'axios'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

// Lỗi 422 (lỗi form)
export const isEntityErrror = <FormError>(err: unknown): err is AxiosError<FormError> => {
  return isAxiosError(err) && err.response?.status === HttpStatusCode.UnprocessableEntity
}
