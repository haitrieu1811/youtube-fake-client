'use client'

import { useQuery } from '@tanstack/react-query'
import Tippy from '@tippyjs/react/headless'
import { ImagePlus, Loader2, Pencil, Search, X, Youtube } from 'lucide-react'
import moment from 'moment'
import Image from 'next/image'
import Link from 'next/link'
import { ChangeEvent, useMemo, useRef, useState } from 'react'

import searchApis from '@/apis/search.apis'
import PATH from '@/constants/path'
import useDebounce from '@/hooks/useDebounce'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'

const MAX_LIMIT_SEARCH_RESULTS = 5

const StudioHeaderSearch = () => {
  const [isShowSearchResult, setIsShowSearchResult] = useState<boolean>(false)
  const [query, setQuery] = useState<string>('')
  const debounceQuery = useDebounce(query, 1500)

  const inputRef = useRef<HTMLInputElement>(null)

  // Query: Tìm kiếm
  const searchQuery = useQuery({
    queryKey: ['searchInMyChannel', debounceQuery],
    queryFn: () => searchApis.searchInMyChannel({ searchQuery: debounceQuery }),
    enabled: !!debounceQuery
  })

  // Kết quả tìm kiếm
  const searchResults = useMemo(() => searchQuery.data?.data.data.videos || [], [searchQuery.data?.data.data.videos])

  // Số lượng video tìm thấy
  const searchResultCount = searchQuery.data?.data.data.pagination.totalRows || 0

  // Cập nhật query
  const handleChangeQuery = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  // Hiển thị kết quả tìm kiếm
  const handleShowSearchResult = () => {
    setIsShowSearchResult(true)
  }

  // Ẩn kết quả tìm kiếm
  const handleHideSearchResult = () => {
    setIsShowSearchResult(false)
  }

  // Dọn dẹp query search
  const handleClearSearchQuery = () => {
    setQuery('')
    inputRef.current?.focus()
  }

  return (
    <div className='w-[615px] h-9 relative'>
      <span className='absolute top-0 left-0 bottom-0 w-[50px] flex justify-center items-center'>
        <Search size={20} strokeWidth={1.5} />
      </span>
      <Tippy
        interactive
        visible={isShowSearchResult && searchResults.length > 0}
        placement='bottom-end'
        offset={[0, 2]}
        render={() => (
          <div className='bg-background w-[615px] rounded-sm shadow-lg border border-border transition-all'>
            <div className='px-6 py-3 border-b border-b-border'>
              <span className='text-[13px] font-medium'>Video ({searchResultCount})</span>{' '}
              {searchResultCount > MAX_LIMIT_SEARCH_RESULTS && (
                <Link href={PATH.HOME} className='text-[13px] font-medium text-blue-600'>
                  Hiện tất cả
                </Link>
              )}
            </div>
            <div>
              {searchResults.slice(0, MAX_LIMIT_SEARCH_RESULTS).map((searchResult) => (
                <Link
                  key={searchResult._id}
                  href={PATH.HOME}
                  className='flex px-6 py-3 border-b last:border-b-0 hover:bg-muted group'
                >
                  <div className='relative flex-shrink-0'>
                    {/* Khi đã có hình thu nhỏ */}
                    {!!searchResult.thumbnail && (
                      <Image
                        width={200}
                        height={200}
                        src={searchResult.thumbnail}
                        alt={searchResult.title}
                        className='w-[120px] h-[68px] rounded-[2px] object-cover'
                      />
                    )}
                    {/* Khi chưa có hình thu nhỏ */}
                    {!searchResult.thumbnail && (
                      <div className='flex justify-center items-center flex-col w-[120px] h-[68px] rounded-[2px] bg-muted space-y-1'>
                        <ImagePlus size={18} strokeWidth={1.5} />
                        <span className='text-xs text-muted-foreground text-center px-2'>Chưa tải hình thu nhỏ</span>
                      </div>
                    )}
                    {/* Khi là bản nháp thì cho ảnh mờ */}
                    {searchResult.isDraft && (
                      <div className='absolute inset-0 bg-white/60 dark:bg-black/60 rounded-[2px]' />
                    )}
                  </div>
                  <div className='flex-1 ml-4 flex space-x-10'>
                    <div className='flex-1 space-y-0.5 flex flex-col'>
                      <h3 className='text-[13px] line-clamp-1'>{searchResult.title}</h3>
                      <div className='flex-1 relative'>
                        <span className='text-xs line-clamp-1 text-muted-foreground'>
                          {!!searchResult.description?.trim() ? searchResult.description : 'Thêm nội dung mô tả'}
                        </span>
                        <div className='absolute inset-0 bg-accent flex items-center opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto'>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button size='icon' variant='ghost' className='w-8 h-8 rounded-full'>
                                  <Pencil size={18} strokeWidth={1.5} />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Chi tiết</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button size='icon' variant='ghost' className='w-8 h-8 rounded-full ml-3'>
                                  <Youtube size={22} strokeWidth={1} />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Xem trên YouTube</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className='text-[13px]'>
                        {moment(searchResult.createdAt).date()} thg {moment(searchResult.createdAt).month() + 1},{' '}
                        {moment(searchResult.createdAt).year()}
                      </div>
                      <div className='text-xs text-muted-foreground'>
                        {searchResult.isDraft ? 'Ngày tải lên' : 'Đã xuất bản'}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      >
        <Input
          ref={inputRef}
          type='text'
          value={query}
          placeholder='Tìm kiếm trên kênh của bạn'
          className='rounded-sm h-full pl-[50px]'
          onChange={handleChangeQuery}
          onFocus={handleShowSearchResult}
          onBlur={handleHideSearchResult}
        />
      </Tippy>
      {query && !searchQuery.isLoading && (
        <Button
          size='icon'
          variant='ghost'
          className='rounded-full absolute top-1/2 -translate-y-1/2 right-2 hover:bg-transparent'
          onClick={handleClearSearchQuery}
        >
          <X size={18} />
        </Button>
      )}
      {searchQuery.isLoading && (
        <span className='absolute top-0 right-0 bottom-0 w-[50px] flex justify-center items-center'>
          <Loader2 size={20} strokeWidth={1.5} className='animate-spin' />
        </span>
      )}
    </div>
  )
}

export default StudioHeaderSearch
