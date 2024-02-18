import http from '@/lib/http'
import {
  CreatePostReponse,
  CreatePostReqBody,
  GetPostDetailResponse,
  GetPostsResponse,
  UpdatePostReqBody
} from '@/types/post.types'
import { OnlyMessageResponse, PaginationReqQuery } from '@/types/utils.types'

const postApis = {
  // Create a new post
  create(body: CreatePostReqBody) {
    return http.post<CreatePostReponse>('/posts', body)
  },

  // Get posts by username
  getPostsByUsername({ params, username }: { params?: PaginationReqQuery; username: string }) {
    return http.get<GetPostsResponse>(`/posts/username/${username}`, { params })
  },

  // Get my posts
  getMyPosts(params?: PaginationReqQuery) {
    return http.get<GetPostsResponse>('/posts/my', { params })
  },

  // Get post detail
  getPostDetail(postId: string) {
    return http.get<GetPostDetailResponse>(`/posts/${postId}`)
  },

  // Update a post
  update({ body, postId }: { body: UpdatePostReqBody; postId: string }) {
    return http.patch(`/posts/${postId}`, body)
  },

  // Delete posts
  delete(postIds: string[]) {
    return http.delete<OnlyMessageResponse>('/posts', {
      data: {
        postIds
      }
    })
  }
}

export default postApis
