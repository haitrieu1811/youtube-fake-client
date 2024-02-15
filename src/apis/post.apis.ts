import http from '@/lib/http'
import { CreatePostReponse, CreatePostReqBody } from '@/types/post.types'

const postApis = {
  // Create a new post
  create(body: CreatePostReqBody) {
    return http.post<CreatePostReponse>('/posts', body)
  }
}

export default postApis
