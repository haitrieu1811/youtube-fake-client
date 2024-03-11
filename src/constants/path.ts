const PATH = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  CHANNEL: '/channel',
  COMMUNITY: '/community',
  SUBSCRIPTIONS: '/subscriptions',
  UPLOAD_VIDEO: '/upload-video',
  CREATE_PLAYLIST: '/create-playlist',
  RESULTS: '/results',
  HISTORY: '/history',
  LIKED: '/liked',
  WATCH_LATER: '/watch-later',
  PROFILE: (username: string) => `/@${username}`,
  WATCH: (idName: string) => `/watch/${idName}`,
  POST_DETAIL: (postId: string) => `/post/${postId}`,
  PLAYLIST_DETAIL: (playlistId: string) => `/playlist/${playlistId}`,

  STUDIO: '/studio',
  STUDIO_CONTENT: '/studio/content',
  STUDIO_COMMENT: '/studio/comment',
  STUDIO_CUSTOM: '/studio/custom',
  STUDIO_SUBSCRIPTIONS: '/studio/subscription',
  STUDIO_CONTENT_VIDEO: (videoId: string) => `/studio/content/video/${videoId}`,
  STUDIO_CONTENT_POST: (postId: string) => `/studio/content/post/${postId}`,
  STUDIO_CONTENT_PLAYLIST: (playlistId: string) => `/studio/content/playlist/${playlistId}`
} as const

export default PATH
