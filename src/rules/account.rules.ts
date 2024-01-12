import * as z from 'zod'

import { ACCOUNT_MESSAGES } from '@/constants/messages'

const accountSchema = z.object({
  email: z.string().min(1, ACCOUNT_MESSAGES.EMAIL_IS_REQUIRED).email(ACCOUNT_MESSAGES.EMAIL_IS_INVALID),
  password: z
    .string()
    .min(6, ACCOUNT_MESSAGES.PASSWORD_LENGTH_IS_INVALID)
    .max(32, ACCOUNT_MESSAGES.PASSWORD_LENGTH_IS_INVALID),
  channelName: z
    .string()
    .min(6, ACCOUNT_MESSAGES.CHANNEL_NAME_LENGTH_IS_INVALID)
    .max(32, ACCOUNT_MESSAGES.CHANNEL_NAME_LENGTH_IS_INVALID),
  username: z
    .string()
    .min(6, ACCOUNT_MESSAGES.USERNAME_LENGTH_IS_INVALID)
    .max(32, ACCOUNT_MESSAGES.USERNAME_LENGTH_IS_INVALID),
  bio: z.string().min(1, ACCOUNT_MESSAGES.BIO_LENGTH_IS_INVALID).max(1000, ACCOUNT_MESSAGES.BIO_LENGTH_IS_INVALID)
})

export const loginSchema = accountSchema.pick({
  email: true,
  password: true
})

export const registerSchema = accountSchema
  .pick({
    email: true,
    password: true
  })
  .extend({
    confirmPassword: z.string().min(1, ACCOUNT_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED)
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: ACCOUNT_MESSAGES.CONFIRM_PASSWORD_NOT_MATCH,
    path: ['confirmPassword']
  })

export const updateMeSchema = accountSchema.pick({
  channelName: true,
  username: true,
  bio: true
})

export type LoginSchema = z.infer<typeof loginSchema>
export type RegisterSchema = z.infer<typeof registerSchema>
export type UpdateMeSchema = z.infer<typeof updateMeSchema>
