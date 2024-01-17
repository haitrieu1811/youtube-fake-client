const PATH = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  CHANNEL: '/channel',
  COMMUNITY: '/community',
  SUBSCRIPTIONS: '/subscriptions',
  UPLOAD_VIDEO: '/upload-video',
  RESULTS: '/results',
  HISTORY: '/history',
  LIKED: '/liked',
  PROFILE: (username: string) => `/@${username}`,
  WATCH: (idName: string) => `/watch/${idName}`,

  STUDIO: '/studio',
  STUDIO_CONTENT: '/studio/content',
  STUDIO_COMMENT: '/studio/comment',
  STUDIO_CUSTOM: '/studio/custom',
  STUDIO_SUBSCRIPTIONS: '/studio/subscription',
  STUDIO_CONTENT_VIDEO: (videoId: string) => `/studio/content/video/${videoId}`
} as const

export default PATH
