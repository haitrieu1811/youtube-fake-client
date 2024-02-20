'use client'

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import { useState } from 'react'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import DataTablePagination from './data-table-pagination'
import DataTableToolbar, { FacetedFilterType } from './data-table-toolbar'
import { Button } from './ui/button'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchField?: string
  searchFieldPlaceholder?: string
  facetedFilter?: FacetedFilterType[]
  onDeleteMany?: (checkedIds: string[]) => void
}

export default function DataTable<TData, TValue>({
  columns,
  data,
  searchField,
  searchFieldPlaceholder,
  facetedFilter,
  onDeleteMany
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues()
  })

  // Handle delete many
  const handleDeleteMany = () => {
    const checkedIds = table.getSelectedRowModel().rows.map((item) => (item.original as any)._id)
    onDeleteMany && onDeleteMany(checkedIds)
    table.resetRowSelection()
  }

  return (
    <div className='space-y-4'>
      {table.getSelectedRowModel().rows.length > 0 && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant='secondary'>Xóa bản ghi đã chọn</Button>
          </AlertDialogTrigger>
          <AlertDialogContent className='max-w-xs'>
            <AlertDialogHeader>
              <AlertDialogTitle>Xóa tất cả bản ghi đã chọn?</AlertDialogTitle>
              <AlertDialogDescription>
                Dữ liệu sẽ không được khôi phục sau khi thực hiện hành động này.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className='rounded-full'>Hủy bỏ</AlertDialogCancel>
              <AlertDialogAction className='rounded-full' onClick={handleDeleteMany}>
                Tiếp tục
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      <DataTableToolbar
        table={table}
        searchField={searchField}
        searchFieldPlaceholder={searchFieldPlaceholder}
        facetedFilter={facetedFilter}
      />
      <div>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} style={{ maxWidth: cell.column.columnDef.maxSize }}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  Không tìm thấy kết quả.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}
