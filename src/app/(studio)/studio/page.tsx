import { Metadata } from 'next'

import StudioClient from './client'

export const metadata: Metadata = {
  title: 'Tùy chỉnh kênh - YouTube',
  description: 'Tùy chỉnh kênh - YouTube'
}

const Studio = () => {
  return <StudioClient />
}

export default Studio
