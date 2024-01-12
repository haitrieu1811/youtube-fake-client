import { Metadata } from 'next'

import CustomClient from './_components/custom-client'

export const metadata: Metadata = {
  title: 'Tùy chỉnh kênh - YouTube Studio',
  description: 'Tùy chỉnh kênh - YouTube Studio'
}

const Custom = () => {
  return <CustomClient />
}

export default Custom
