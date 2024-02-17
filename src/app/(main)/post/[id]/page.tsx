import { Metadata } from 'next'

import PostDetailClient from './_components/post-detail-client'

export const metadata: Metadata = {
  title: 'Chi tiết bài viết - YouTube',
  description: 'Chi tiết bài viết - YouTube'
}

type PostDetailProps = {
  params: {
    id: string
  }
}

const PostDetail = ({ params }: PostDetailProps) => {
  const { id } = params
  return <PostDetailClient postId={id} />
}

export default PostDetail
