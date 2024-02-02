'use client'

import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import subscriptionApis from '@/apis/subscription.apis'

const useAccountsSubscribedToMe = () => {
  // Query: Get accounts subscribed to me
  const getAccountsSubscribedToMeQuery = useQuery({
    queryKey: ['getAccountsSubscribedToMe'],
    queryFn: () => subscriptionApis.getAccountsSubscribedToMe()
  })

  // Get accounts subscribed to me
  const accountsSubscribedToMe = useMemo(
    () => getAccountsSubscribedToMeQuery.data?.data.data.accounts || [],
    [getAccountsSubscribedToMeQuery.data?.data.data.accounts]
  )

  // Số kênh đã đăng ký cho tôi
  const accountsSubscribedToMeCount = useMemo(
    () => getAccountsSubscribedToMeQuery.data?.data.data.pagination.totalRows || 0,
    [getAccountsSubscribedToMeQuery.data?.data.data.pagination.totalRows]
  )

  return {
    getAccountsSubscribedToMeQuery,
    accountsSubscribedToMe,
    accountsSubscribedToMeCount
  }
}

export default useAccountsSubscribedToMe
