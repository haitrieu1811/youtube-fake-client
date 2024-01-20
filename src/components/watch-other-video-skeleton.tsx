import { Skeleton } from './ui/skeleton'

const WatchOtherVideoSkeleton = () => {
  return (
    <div className='flex space-x-2'>
      <Skeleton className='w-[170px] h-[100px] rounded-lg' />
      <div className='flex-1 space-y-2'>
        <Skeleton className='w-[160px] h-4' />
        <Skeleton className='w-[140px] h-3' />
        <div className='flex items-center space-x-2'>
          {Array(2)
            .fill(0)
            .map((_, index) => (
              <Skeleton key={index} className='w-[40px] h-3' />
            ))}
        </div>
      </div>
    </div>
  )
}

export default WatchOtherVideoSkeleton
