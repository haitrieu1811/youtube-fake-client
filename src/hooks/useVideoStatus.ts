'use client'

import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import mediaApis from '@/apis/media.apis'

type UseVideoStatusProps = {
  videoIdName: string | null
  refetchIntervalEnabled: boolean
  refetchIntervalMilliseconds?: number
}

const useVideoStatus = ({
  videoIdName,
  refetchIntervalEnabled,
  refetchIntervalMilliseconds = 5000
}: UseVideoStatusProps) => {
  // Query: Get video status
  const getVideoStatusQuery = useQuery({
    queryKey: ['getVideoStatus', videoIdName],
    queryFn: () => mediaApis.getVideoStatus(videoIdName as string),
    enabled: !!videoIdName,
    refetchInterval: refetchIntervalEnabled ? refetchIntervalMilliseconds : false
  })

  // Video status
  const videoStatus = useMemo(
    () => getVideoStatusQuery.data?.data.data.videoStatus,
    [getVideoStatusQuery.data?.data.data.videoStatus]
  )

  return {
    videoStatus,
    getVideoStatusQuery
  }
}

export default useVideoStatus
