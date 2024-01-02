import { Metadata } from 'next'

import ContentClient from './client'

export const metadata: Metadata = {
  title: 'Nội dung của kênh - YouTube',
  description: 'Nội dung của kênh - YouTube'
}

const Content = () => {
  return <ContentClient />
}

export default Content
