import { Metadata } from 'next'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Comments from './_components/comments'
import StudioPostDetail from './_components/post-detail'

export const metadata: Metadata = {
  title: 'Chi tiết video - YouTube Studio',
  description: 'Chi tiết video - YouTube Studio'
}

type StudioPostProps = {
  params: {
    id: string
  }
}

const StudioPost = ({ params }: StudioPostProps) => {
  const { id } = params
  return (
    <div className='p-6'>
      <h1 className='text-[25px] tracking-tight font-medium mb-4'>Chi tiết bài đăng</h1>
      <Tabs defaultValue='detail'>
        <TabsList>
          <TabsTrigger value='detail'>Chi tiết</TabsTrigger>
          <TabsTrigger value='comments'>Bình luận</TabsTrigger>
        </TabsList>
        <TabsContent value='detail'>
          <StudioPostDetail postId={id} />
        </TabsContent>
        <TabsContent value='comments'>
          <Comments postId={id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default StudioPost
