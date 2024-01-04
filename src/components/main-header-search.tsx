'use client'

import { useQuery } from '@tanstack/react-query'
import Tippy from '@tippyjs/react/headless'
import { Loader2, Search, X } from 'lucide-react'
import Link from 'next/link'
import { ChangeEvent, useMemo, useRef, useState } from 'react'

import searchApis from '@/apis/search.apis'
import useDebounce from '@/hooks/useDebounce'
import SearchItem from './search-item'
import { Button } from './ui/button'

const MAX_SEARCH_RESULTS = 10

const MainHeaderSearch = () => {
  const [query, setQuery] = useState<string>('')
  const [isShowSearchResult, setIsShowSearchResult] = useState<boolean>(false)
  const debounceQuery = useDebounce(query, 1500)
  const searchBoxRef = useRef<HTMLInputElement>(null)

  const handleChangeSearchQuery = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  const handleClearSearchQuery = () => {
    setQuery('')
    searchBoxRef.current?.focus()
  }

  const handleShowSearchResult = () => {
    setIsShowSearchResult(true)
  }

  const handleHideSearchResult = () => {
    setIsShowSearchResult(false)
  }

  // Query: Tìm kiếm
  const searchQuery = useQuery({
    queryKey: ['search', debounceQuery],
    queryFn: () => searchApis.search({ searchQuery: debounceQuery }),
    enabled: !!debounceQuery
  })

  // Kết quả tìm kiếm
  const searchResults = useMemo(() => searchQuery.data?.data.data.videos ?? [], [searchQuery.data?.data.data.videos])

  return (
    <div className='flex relative'>
      <Tippy
        visible={searchResults.length > 0 && isShowSearchResult}
        interactive
        placement='bottom-end'
        offset={[0, 5]}
        onClickOutside={handleHideSearchResult}
        render={() => (
          <div className='w-[550px] py-4 bg-background rounded-lg border border-border'>
            {searchResults.slice(0, MAX_SEARCH_RESULTS).map((searchResult) => (
              <SearchItem key={searchResult._id} title={searchResult.title} />
            ))}
            {searchResults.length > MAX_SEARCH_RESULTS && (
              <div className='flex justify-end mt-1 mr-4'>
                <Link href={'/'} className='text-xs text-slate-800'>
                  Xem thêm {searchResults.length - MAX_SEARCH_RESULTS} kết quả khác
                </Link>
              </div>
            )}
          </div>
        )}
      >
        <input
          ref={searchBoxRef}
          type='text'
          placeholder='Tìm kiếm'
          value={query}
          className='flex-1 border border-border rounded-l-full outline-none w-[550px] bg-background px-5 focus:border-blue-500'
          onChange={handleChangeSearchQuery}
          onFocus={handleShowSearchResult}
        />
      </Tippy>
      {query && !searchQuery.isLoading && (
        <Button
          size='icon'
          variant='ghost'
          className='rounded-full absolute top-1/2 -translate-y-1/2 right-[60px]'
          onClick={handleClearSearchQuery}
        >
          <X size={18} />
        </Button>
      )}
      {searchQuery.isLoading && (
        <div className='absolute top-1/2 -translate-y-1/2 right-[60px] '>
          <Loader2 size={18} strokeWidth={1.5} className='animate-spin' />
        </div>
      )}
      <Button variant='secondary' className='rounded-r-full border border-border border-l-0 w-[50px]'>
        <Search size={18} />
      </Button>
    </div>
  )
}

export default MainHeaderSearch
