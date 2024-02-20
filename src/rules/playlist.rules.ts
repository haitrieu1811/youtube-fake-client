import z from 'zod'

// Playlist schema
const playlistSchema = z.object({
  name: z.string().min(6, 'Tên playlist dài tối thiểu 6 ký tự').max(255, 'Tên playlist dài tối đa 255 ký tự'),
  description: z.string(),
  audience: z.string()
})

// Create new playlist
export const createPlaylistSchema = playlistSchema.pick({
  name: true,
  description: true,
  audience: true
})

export type CreatePlaylistSchema = z.infer<typeof createPlaylistSchema>
