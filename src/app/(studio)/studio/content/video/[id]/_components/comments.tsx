'use client'

import Image from 'next/image'
import { Fragment } from 'react'

import commentEmpty from '@/assets/images/comment-empty.svg'
import CommentList from '@/components/comment-list'
import useComments from '@/hooks/useComments'

type StudioVideoCommentsProps = {
  videoId: string
}

const StudioVideoComments = ({ videoId }: StudioVideoCommentsProps) => {
  const { comments, commentCount, getCommentsQuery, setComments } = useComments({ contentId: videoId })
  return (
    <Fragment>
      {/* Comments */}
      {commentCount > 0 && !getCommentsQuery.isLoading && (
        <CommentList
          comments={comments}
          setComments={setComments}
          hasMoreComments={getCommentsQuery.hasNextPage}
          fetchMoreComments={getCommentsQuery.fetchNextPage}
        />
      )}
      {/* Empty */}
      {commentCount === 0 && !getCommentsQuery.isLoading && (
        <div className='flex items-center justify-center flex-col space-y-2 py-10'>
          <Image width={180} height={180} src={commentEmpty} alt='' />
          <div className='text-[15px] text-muted-foreground text-center'>
            Không tìm thấy bình luận nào. Hãy thử tìm kiếm nội dung khác hoặc bỏ bộ lọc.
          </div>
        </div>
      )}
    </Fragment>
  )
}

export default StudioVideoComments
