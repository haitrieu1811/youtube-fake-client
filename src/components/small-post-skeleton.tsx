import { Skeleton } from './ui/skeleton'

const SmallPostSkeleton = () => {
  return (
    <div className='p-4 space-y-3'>
      <div className='flex items-center space-x-2'>
        <Skeleton className='w-6 h-6 rounded-full' />
        <Skeleton className='h-3 w-[100px]' />
      </div>
      <div className='flex space-x-3'>
        <div className='flex-1 space-y-2.5'>
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <Skeleton key={index} className='h-3 flex-1' />
            ))}
        </div>
        <Skeleton className='w-[116px] h-[116px] rounded-xl' />
      </div>
    </div>
  )
}

export default SmallPostSkeleton
