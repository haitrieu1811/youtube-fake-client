'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import { Loader2, Pause, Search, Trash2, X } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { ChangeEvent, useEffect, useRef, useState } from 'react'

import watchHistoryApis from '@/apis/watchHistory.apis'
import HorizontalVideo from '@/components/horizontal-video'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import useDebounce from '@/hooks/useDebounce'
import { WatchHistoryItemType } from '@/types/watchHistory.types'
import { Skeleton } from '@/components/ui/skeleton'

const HistoryClient = () => {
  const searchParams = useSearchParams()
  const [videos, setVideos] = useState<WatchHistoryItemType[]>([])
  const [searchQuery, setSearchQuery] = useState<string>('')
  const searchQueryDebounce = useDebounce(searchQuery, 1500)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChangeSearchQuery = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleClearSearchQuery = () => {
    setSearchQuery('')
    inputRef.current?.focus()
  }

  // Query: Lấy lich sử xem
  const getWatchHistories = useQuery({
    queryKey: ['getWatchHistories', searchQueryDebounce],
    queryFn: () => watchHistoryApis.getWatchHistories({ searchQuery: searchQueryDebounce })
  })

  // Đặt lại giá trị lịch sử xem
  useEffect(() => {
    if (!getWatchHistories.data) return
    const resVideos = getWatchHistories.data.data.data.videos
    setVideos(resVideos)
  }, [getWatchHistories.data])

  // Mutation: Xóa một lịch sử xem
  const deleteWatchHistoryMutation = useMutation({
    mutationKey: ['deleteWatchHistory'],
    mutationFn: watchHistoryApis.deleteWatchHistory
  })

  // Mutation: Xóa toàn bộ lịch sử xem
  const deleteAllWatchHistoriesMutation = useMutation({
    mutationKey: ['deleteAllWatchHistories'],
    mutationFn: watchHistoryApis.deleteAllWatchHistories,
    onSuccess: () => {
      setVideos([])
    }
  })

  // Xóa một lịch sử xem
  const handleDeleteWatchHistory = (watchHistoryId: string) => {
    deleteWatchHistoryMutation.mutate(watchHistoryId, {
      onSuccess: () => {
        setVideos((prevState) => prevState.filter((item) => item.historyId !== watchHistoryId))
      }
    })
  }

  // Xóa toàn bộ lịch sử xem
  const handleDeleteAllWatchHistories = () => {
    deleteAllWatchHistoriesMutation.mutate()
  }

  return (
    <div className='w-5/6 mx-auto mb-10'>
      <h1 className='font-black text-[36px] tracking-tight py-8'>Nhật ký xem</h1>
      <div className='flex items-start space-x-24'>
        <div className='space-y-5 flex-1'>
          {getWatchHistories.isFetching &&
            Array(10)
              .fill(0)
              .map((_, index) => (
                <div key={index} className='flex space-x-4'>
                  <Skeleton className='w-[250px] h-[140px] rounded-xl' />
                  <div className='flex-1 space-y-3'>
                    <Skeleton className='w-[240px] h-8' />
                    <Skeleton className='w-[240px] h-3' />
                    <div className='flex items-center space-x-2'>
                      <Skeleton className='w-6 h-6 rounded-full' />
                      <Skeleton className='w-[100px] h-3' />
                    </div>
                    <Skeleton className='w-[240px] h-6' />
                  </div>
                </div>
              ))}
          {!getWatchHistories.isFetching &&
            videos.map((video) => (
              <HorizontalVideo
                videoData={video}
                classNameThumbnail='flex-shrink-0 w-[250px] h-[140px] object-cover rounded-xl'
                videoActions={[
                  {
                    icon: X,
                    explainText: 'Xóa khỏi danh sách video đã xem',
                    method: () => handleDeleteWatchHistory(video.historyId)
                  }
                ]}
              />
            ))}
        </div>
        <div className='basis-1/3 sticky top-24'>
          <div className='flex items-center border-b border-b-border pb-2 space-x-3 focus-within:border-b-muted-foreground'>
            <Search size={18} className='flex-shrink-0' />
            <input
              ref={inputRef}
              value={searchQuery}
              placeholder='Tìm kiếm trong danh sách video đã xem'
              className='flex-1 outline-none text-sm bg-transparent'
              onChange={handleChangeSearchQuery}
            />
            {searchQuery.length > 0 && !getWatchHistories.isFetching && (
              <Button
                variant='ghost'
                size='icon'
                className='rounded-full w-5 h-5 hover:bg-transparent'
                onClick={handleClearSearchQuery}
              >
                <X size={20} strokeWidth={1.5} />
              </Button>
            )}
            {getWatchHistories.isFetching && (
              <Button disabled variant='ghost' size='icon' className='rounded-full w-5 h-5'>
                <Loader2 size={20} strokeWidth={1.5} className='animate-spin' />
              </Button>
            )}
          </div>
          <div className='space-y-2 mt-5'>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant='ghost' className='space-x-3 rounded-full'>
                  <Trash2 size={18} strokeWidth={1.5} />
                  <span>Xóa tất cả nhật ký xem</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Xóa nhật ký xem?</AlertDialogTitle>
                  <AlertDialogDescription className='space-y-6'>
                    <p>
                      Nhật ký xem của bạn trên YouTube sẽ bị xóa khỏi tất cả các ứng dụng YouTube trên mọi thiết bị.
                    </p>
                    <p>
                      Các video đề xuất dành cho bạn sẽ được đặt lại nhưng vẫn có thể bị ảnh hưởng bởi hoạt động trên
                      các sản phẩm khác của Google. Để tìm hiểu thêm, hãy truy cập vào phần Hoạt động của tôi.
                    </p>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                  <AlertDialogAction
                    disabled={deleteAllWatchHistoriesMutation.isPending}
                    onClick={handleDeleteAllWatchHistories}
                  >
                    {deleteAllWatchHistoriesMutation.isPending && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
                    Xóa nhật ký xem
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button variant='ghost' className='space-x-3 rounded-full'>
              <Pause size={18} strokeWidth={1.5} />
              <span>Tạm dừng lưu nhật ký xem</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HistoryClient
