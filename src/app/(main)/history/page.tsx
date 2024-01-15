import { Metadata } from 'next'

import HistoryClient from './_components/history-client'

export const metadata: Metadata = {
  title: 'Nhật ký xem - YouTube',
  description: 'Nhật ký xem - YouTube'
}

const History = () => {
  return <HistoryClient />
}

export default History
