import { Skeleton } from './ui/skeleton'

const VerticalVideoSkeleton = () => {
  return (
    <div className='space-y-2'>
      <Skeleton className='w-full h-[180px] rounded-lg' />
      <div className='flex space-x-3'>
        <Skeleton className='w-9 h-9 rounded-full flex-shrink-0' />
        <div className='flex-1 space-y-1'>
          <Skeleton className='w-3/4 h-2' />
          <Skeleton className='w-1/2 h-2' />
          <Skeleton className='w-1/3 h-2' />
        </div>
      </div>
    </div>
  )
}

export default VerticalVideoSkeleton
