import { Metadata } from 'next'

import LikedClient from './_components/liked-client'

export const metadata: Metadata = {
  title: 'Video đã thích - YouTube',
  description: 'Video đã thích - YouTube'
}

const Liked = () => {
  return <LikedClient />
}

export default Liked
