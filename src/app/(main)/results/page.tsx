import { Metadata } from 'next'

import ResultsClient from './_components/results-client'

export const metadata: Metadata = {
  title: 'Tìm kiếm - YouTube',
  description: 'Tìm kiếm - YouTube'
}

const Results = () => {
  return <ResultsClient />
}

export default Results
