'use client'

import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

import searchApis from '@/apis/search.apis'
import HorizontalVideo from '@/components/horizontal-video'

const ResultsClient = () => {
  const searchParams = useSearchParams()
  const query = searchParams.get('searchQuery')

  // Query: Tìm kiếm
  const searchQuery = useQuery({
    queryKey: ['search', query],
    queryFn: () => searchApis.search({ searchQuery: query as string }),
    enabled: !!query
  })

  // Kết quả tìm kiếm
  const searchResults = useMemo(() => searchQuery.data?.data.data.videos || [], [searchQuery.data?.data.data.videos])

  return (
    <div className='px-24 py-4'>
      {searchResults.length > 0 && (
        <div className='space-y-4'>
          {searchResults.map((searchResult) => (
            <HorizontalVideo key={searchResult._id} videoData={searchResult} />
          ))}
        </div>
      )}
    </div>
  )
}

export default ResultsClient
