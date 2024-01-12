import { Metadata } from 'next'

import StudioClient from './_components/studio-client'

export const metadata: Metadata = {
  title: 'Tùy chỉnh kênh - YouTube',
  description: 'Tùy chỉnh kênh - YouTube'
}

const Studio = () => {
  return <StudioClient />
}

export default Studio
