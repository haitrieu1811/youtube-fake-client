import z from 'zod'

// Post schema
export const postSchema = z.object({
  content: z.string().min(1, 'Nội dung dài tối thiểu 1 ký tự').max(5000, 'Nội dung dài tối đa 5000 ký tự'),
  audience: z.string()
})

// Update post schema
export const updatePostSchema = postSchema.pick({
  content: true,
  audience: true
})

export type UpdatePostSchema = z.infer<typeof updatePostSchema>
