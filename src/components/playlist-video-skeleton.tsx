import { Skeleton } from './ui/skeleton'

const PlaylistVideoSkeleton = () => {
  return (
    <div className='flex items-center p-2'>
      <div className='w-[50px] flex items-center justify-center'>
        <Skeleton className='w-4 h-4 rounded-sm' />
      </div>
      <div className='flex-1 flex space-x-2'>
        <Skeleton className='w-[160px] h-[90px]' />
        <div className='space-y-3'>
          <Skeleton className='w-[300px] h-4' />
          <div className='flex items-center space-x-2'>
            {Array(3)
              .fill(0)
              .map((_, index) => (
                <Skeleton key={index} className='w-[100px] h-3' />
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlaylistVideoSkeleton
