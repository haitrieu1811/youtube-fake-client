import Link from 'next/link'
import { Search } from 'lucide-react'

type SearchItemProps = {
  title: string
  idName: string
}

const SearchItem = ({ title, idName }: SearchItemProps) => {
  return (
    <Link href={`/watch/${idName}`} className='flex items-center space-x-4 px-4 py-2 hover:bg-muted'>
      <Search size={18} strokeWidth={1.5} className='flex-shrink-0' />
      <span className='flex-1 line-clamp-1 font-medium'>{title}</span>
    </Link>
  )
}

export default SearchItem
