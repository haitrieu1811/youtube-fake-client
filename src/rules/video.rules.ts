import * as z from 'zod'

import { VIDEO_MESSAGES } from '@/constants/messages'

const videoSchema = z.object({
  title: z.string().min(6, VIDEO_MESSAGES.TITLE_LENGTH_IS_INVALID).max(500, VIDEO_MESSAGES.TITLE_LENGTH_IS_INVALID),
  description: z.string().optional(),
  category: z.string().min(1, VIDEO_MESSAGES.VIDEO_CATEGORY_ID_IS_REQUIRED).nullable(),
  audience: z.string().min(1, VIDEO_MESSAGES.AUDIENCE_IS_REQUIRED)
})

export const createVideoSchema = videoSchema.pick({
  title: true,
  description: true,
  category: true,
  audience: true
})

export type CreateVideoSchema = z.infer<typeof createVideoSchema>
