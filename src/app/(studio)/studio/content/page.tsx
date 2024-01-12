import { Metadata } from 'next'

import ContentClient from './_components/content-client'

export const metadata: Metadata = {
  title: 'Nội dung của kênh - YouTube Studio',
  description: 'Nội dung của kênh - YouTube Studio'
}

const Content = () => {
  return <ContentClient />
}

export default Content
