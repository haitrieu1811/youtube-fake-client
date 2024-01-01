'use client'

import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import subscriptionApis from '@/apis/subscription.apis'
import DataTable from '@/components/data-table'
import { columns } from './columns'

const SubscriptionsClient = () => {
  // Query: Lấy danh sách kênh đã đăng ký cho tôi
  const getChannelsSubscribedForMeQuery = useQuery({
    queryKey: ['getChannelsSubscribedForMe'],
    queryFn: () => subscriptionApis.getSubcribedChannelsForMe()
  })

  // Danh sách kênh đã đăng ký cho tôi
  const channelsSubscribedForMe = useMemo(
    () => getChannelsSubscribedForMeQuery.data?.data.data.channels || [],
    [getChannelsSubscribedForMeQuery.data?.data.data.channels]
  )

  // Số kênh đã đăng ký cho tôi
  const channelsSubscribedForMeCount = useMemo(
    () => getChannelsSubscribedForMeQuery.data?.data.data.pagination.totalRows || 0,
    [getChannelsSubscribedForMeQuery.data?.data.data.pagination.totalRows]
  )

  return (
    <div className='p-6'>
      <h1 className='font-medium text-[25px] tracking-tight'>Người đăng ký kênh</h1>
      <div className='text-[13px] text-muted-foreground mb-10'>
        Chỉ bao gồm những người dùng đã công khai thông tin đăng ký kênh.{' '}
      </div>
      <DataTable columns={columns} data={channelsSubscribedForMe} />
    </div>
  )
}

export default SubscriptionsClient
