import type { Metadata } from 'next'

import ChannelClient from './_components/channel-client'

export const metadata: Metadata = {
  title: 'Kênh của tôi',
  description: 'Quản lý kênh của tôi'
}

const Channel = () => {
  return <ChannelClient />
}

export default Channel
