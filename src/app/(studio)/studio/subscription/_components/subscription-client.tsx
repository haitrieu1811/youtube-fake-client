'use client'

import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import subscriptionApis from '@/apis/subscription.apis'
import DataTable from '@/components/data-table'
import { columns } from '../_columns/subscription-columns'

const SubscriptionClient = () => {
  // Query: Get accounts subscribed to me
  const getAccountsSubscribedToMe = useQuery({
    queryKey: ['getAccountsSubscribedToMe'],
    queryFn: () => subscriptionApis.getAccountsSubscribedToMe()
  })

  // Get accounts subscribed to me
  const accountsSubscribedToMe = useMemo(
    () => getAccountsSubscribedToMe.data?.data.data.accounts || [],
    [getAccountsSubscribedToMe.data?.data.data.accounts]
  )

  return (
    <div className='p-6'>
      <h1 className='font-medium text-[25px] tracking-tight'>Người đăng ký kênh</h1>
      <div className='text-[13px] text-muted-foreground mb-10'>
        Chỉ bao gồm những người dùng đã công khai thông tin đăng ký kênh.
      </div>
      <DataTable columns={columns} data={accountsSubscribedToMe} searchField='channelName' />
    </div>
  )
}

export default SubscriptionClient
