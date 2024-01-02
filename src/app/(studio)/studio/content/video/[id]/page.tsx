import UpdateVideoForm from '@/components/update-video-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Chi tiết video - YouTube Studio',
  description: 'Chi tiết video - YouTube Studio'
}

type VideoDetailProps = {
  params: {
    id: string
  }
}

const VideoDetail = ({ params }: VideoDetailProps) => {
  const { id } = params
  return (
    <div className='p-6'>
      <h1 className='text-[25px] tracking-tight font-medium mb-4'>Chi tiết video</h1>
      <UpdateVideoForm videoId={id} />
    </div>
  )
}

export default VideoDetail
