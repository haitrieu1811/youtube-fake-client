import Link from 'next/link'
import { Search } from 'lucide-react'

const SearchItem = () => {
  return (
    <Link href={'/'} className='flex items-center space-x-4 px-4 py-2 hover:bg-slate-50'>
      <Search size={18} strokeWidth={1.5} className='flex-shrink-0' />
      <span className='flex-1 line-clamp-1 font-medium'>
        study with me hanoi chamomile study with me hanoi chamomile study with me hanoi chamomile
      </span>
    </Link>
  )
}

export default SearchItem
