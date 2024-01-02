'use client'

import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { ForwardRefExoticComponent, RefAttributes } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { IconProps } from '@radix-ui/react-icons/dist/types'
import DataTableFacetedFilter from './data-table-faceted-filter'

interface FacetedFilterOption {
  label: string
  value: string
  icon: ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>
}

export interface FacetedFilterType {
  fieldName: string
  title: string
  options: FacetedFilterOption[]
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  searchField?: string
  searchFieldPlaceholder?: string
  facetedFilter?: FacetedFilterType[]
}

export default function DataTableToolbar<TData>({
  table,
  searchField,
  searchFieldPlaceholder = 'Tìm kiếm',
  facetedFilter
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 items-center space-x-2'>
        {searchField && (
          <Input
            placeholder={searchFieldPlaceholder}
            value={(table.getColumn(searchField)?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn(searchField)?.setFilterValue(event.target.value)}
            className='h-8 w-[150px] lg:w-[250px]'
          />
        )}
        {facetedFilter &&
          facetedFilter.length > 0 &&
          facetedFilter.map(
            (item) =>
              table.getColumn(item.fieldName) && (
                <DataTableFacetedFilter
                  key={item.fieldName}
                  column={table.getColumn(item.fieldName)}
                  title={item.title}
                  options={item.options}
                />
              )
          )}
        {isFiltered && (
          <Button variant='ghost' onClick={() => table.resetColumnFilters()} className='h-8 px-2 lg:px-3'>
            Đặt lại
            <Cross2Icon className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>
    </div>
  )
}
