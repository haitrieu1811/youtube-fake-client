import type { Metadata } from 'next'
import WatchLaterClient from './_components/watch-later-client'

export const metadata: Metadata = {
  title: 'Xem sau - YouTube',
  description: 'Xem sau - YouTube'
}

const Liked = () => {
  return (
    <div className='w-5/6 mx-auto mb-10'>
      <h1 className='font-bold text-[36px] tracking-tight py-8'>Xem sau</h1>
      <WatchLaterClient />
    </div>
  )
}

export default Liked
