import type { Metadata } from 'next'
import LikedClient from './_components/liked-client'

export const metadata: Metadata = {
  title: 'Video đã thích - YouTube',
  description: 'Video đã thích - YouTube'
}

const Liked = () => {
  return (
    <div className='w-5/6 mx-auto mb-10'>
      <h1 className='font-bold text-[36px] tracking-tight py-8'>Video đã thích</h1>
      <LikedClient />
    </div>
  )
}

export default Liked
