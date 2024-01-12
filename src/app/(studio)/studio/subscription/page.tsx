import { Metadata } from 'next'

import SubscriptionsClient from './_components/subscription-client'

export const metadata: Metadata = {
  title: 'Người đăng ký - YouTube',
  description: 'Người đăng ký - YouTube'
}

const Subscriptions = () => {
  return <SubscriptionsClient />
}

export default Subscriptions
