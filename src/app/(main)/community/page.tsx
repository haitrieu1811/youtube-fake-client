import { Metadata } from 'next'

import CommunityClient from './_components/community-client'

export const metadata: Metadata = {
  title: 'Cộng đồng - YouTube',
  description: 'Cộng đồng - YouTube'
}

const Community = () => {
  return <CommunityClient />
}

export default Community
