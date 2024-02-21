import { Metadata } from 'next'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import CreateVideoForm from '@/components/create-video-form'
import Comments from './_components/comments'

export const metadata: Metadata = {
  title: 'Chi tiết video - YouTube Studio',
  description: 'Chi tiết video - YouTube Studio'
}

type VideoDetailProps = {
  params: {
    id: string
  }
}

const StudioVideo = ({ params }: VideoDetailProps) => {
  const { id } = params
  return (
    <div className='p-6'>
      <h1 className='text-[25px] tracking-tight font-medium mb-4'>Chi tiết video</h1>
      <Tabs defaultValue='detail'>
        <TabsList>
          <TabsTrigger value='detail'>Chi tiết</TabsTrigger>
          <TabsTrigger value='comments'>Bình luận</TabsTrigger>
        </TabsList>
        <TabsContent value='detail'>
          <CreateVideoForm videoId={id} />
        </TabsContent>
        <TabsContent value='comments'>
          <Comments videoId={id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default StudioVideo
