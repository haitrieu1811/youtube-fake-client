import type { Metadata } from 'next'

import ChannelPage from '@/components/channel-page'

export const metadata: Metadata = {
  title: 'Kênh của tôi',
  description: 'Quản lý kênh của tôi'
}

const Channel = () => {
  return <ChannelPage />
}

export default Channel
