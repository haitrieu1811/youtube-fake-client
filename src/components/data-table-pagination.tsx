import { ChevronLeftIcon, ChevronRightIcon, DoubleArrowLeftIcon, DoubleArrowRightIcon } from '@radix-ui/react-icons'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Table } from '@tanstack/react-table'
import { Loader2 } from 'lucide-react'

import videoApis from '@/apis/video.apis'
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
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface DataTablePaginationProps<TData> {
  table: Table<TData>
}

export default function DataTablePagination<TData>({ table }: DataTablePaginationProps<TData>) {
  const queryClient = useQueryClient()

  // Mutation: Xóa video
  const deleteVideosMutation = useMutation({
    mutationKey: ['deleteVideos'],
    mutationFn: videoApis.deleteVideos,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getVideosOfMe'] })
    }
  })

  // Xóa video
  const handleDeleteVideos = () => {
    if (table.getCoreRowModel().rows.length === 0) return
    const videoIds = table.getSelectedRowModel().rows.map((item) => (item.original as any)._id)
    deleteVideosMutation.mutate(videoIds)
  }

  return (
    <div className='flex items-center justify-between px-2'>
      <div className='flex-1 flex items-center'>
        <div className='text-sm text-muted-foreground'>
          {table.getFilteredSelectedRowModel().rows.length} trên {table.getFilteredRowModel().rows.length} bản ghi đã
          chọn.
        </div>
        {table.getSelectedRowModel().rows.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant='secondary' size='sm' className='ml-4'>
                Xóa bản ghi đã chọn
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Bạn có chắc muốn xóa tất cả bản ghi đã chọn?</AlertDialogTitle>
                <AlertDialogDescription>
                  Dữ liệu sẽ không được khôi phục sau khi thực hiện hành động này, bạn hãy cân nhắc trước khi thực hiện.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteVideos}>
                  {deleteVideosMutation.isPending && <Loader2 className='w-3 h-3 mr-2 animate-spin' />}
                  Tiếp tục
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
      <div className='flex items-center space-x-6 lg:space-x-8'>
        <div className='flex items-center space-x-2'>
          <p className='text-sm font-medium'>Bản ghi mỗi trang</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className='h-8 w-[70px]'>
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side='top'>
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='flex w-[100px] items-center justify-center text-sm font-medium'>
          Trang {table.getState().pagination.pageIndex + 1} trên {table.getPageCount()}
        </div>
        <div className='flex items-center space-x-2'>
          <Button
            variant='outline'
            className='hidden h-8 w-8 p-0 lg:flex'
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className='sr-only'>Go to first page</span>
            <DoubleArrowLeftIcon className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            className='h-8 w-8 p-0'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className='sr-only'>Go to previous page</span>
            <ChevronLeftIcon className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            className='h-8 w-8 p-0'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className='sr-only'>Go to next page</span>
            <ChevronRightIcon className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            className='hidden h-8 w-8 p-0 lg:flex'
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className='sr-only'>Go to last page</span>
            <DoubleArrowRightIcon className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  )
}
