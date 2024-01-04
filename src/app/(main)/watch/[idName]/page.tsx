import { Metadata } from 'next'

import WatchClient from './client'

type WatchProps = {
  params: { idName: string }
}

export async function generateMetadata({ params }: WatchProps): Promise<Metadata> {
  const { idName } = params
  const res = await fetch(`http://localhost:4000/videos/watch/idName/${idName}`)
  const data = await res.json()
  return {
    title: data.data.video.title,
    description: data.data.video.description
  }
}

const Watch = ({ params }: WatchProps) => {
  const { idName } = params

  return (
    <div className='p-10'>
      <WatchClient idName={idName} />
    </div>
  )
}

export default Watch
