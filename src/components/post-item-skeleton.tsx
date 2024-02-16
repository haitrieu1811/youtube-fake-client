import { Skeleton } from './ui/skeleton'

const PostItemSkeleton = () => {
  return (
    <div className='rounded-xl p-5 flex space-x-5'>
      <Skeleton className='rounded-full w-10 h-10 flex-shrink-0' />
      <div className='flex-1 space-y-4'>
        <Skeleton className='h-5 w-[100px]' />
        <Skeleton className='h-5 w-[120px]' />
        <Skeleton className='h-5 w-[240px]' />
      </div>
    </div>
  )
}

export default PostItemSkeleton
