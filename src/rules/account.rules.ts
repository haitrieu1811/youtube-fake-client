import * as z from 'zod'

import { ACCOUNT_MESSAGES } from '@/constants/messages'

const accountSchema = z.object({
  email: z.string().min(1, ACCOUNT_MESSAGES.EMAIL_IS_REQUIRED).email(ACCOUNT_MESSAGES.EMAIL_IS_INVALID),
  password: z
    .string()
    .min(6, ACCOUNT_MESSAGES.PASSWORD_LENGTH_IS_INVALID)
    .max(32, ACCOUNT_MESSAGES.PASSWORD_LENGTH_IS_INVALID)
})

export const loginSchema = accountSchema.pick({
  email: true,
  password: true
})

export type LoginSchema = z.infer<typeof loginSchema>
