import { Metadata } from 'next'
import Image from 'next/image'

import overviewImage from '@/assets/images/overview.svg'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import PATH from '@/constants/path'

export const metadata: Metadata = {
  title: 'Tùy chỉnh kênh - YouTube',
  description: 'Tùy chỉnh kênh - YouTube'
}

const Studio = () => {
  return (
    <div className='p-6'>
      <h1 className='font-medium text-[25px] mb-6'>Trang tổng quan của kênh</h1>
      <div className='grid grid-cols-12 gap-6'>
        <div className='bg-background border border-border rounded-sm col-span-4 h-[520px] p-[10px]'>
          <div className='h-full flex justify-center items-center flex-col space-y-4 border border-border border-dashed rounded-sm'>
            <Image width={150} height={150} src={overviewImage} alt='' />
            <div className='text-center text-[13px] text-muted-foreground px-10'>
              <div>Bạn có muốn xem các chỉ số cho video gần đây của mình không?</div>
              <div>Hãy đăng tải và xuất bản một video để bắt đầu.</div>
            </div>
            <Button className='rounded-[2px] uppercase text-white bg-blue-700 hover:bg-blue-800' asChild>
              <Link href={PATH.UPLOAD_VIDEO}>Tải video lên</Link>
            </Button>
          </div>
        </div>
        <div className='bg-background border border-border rounded-sm col-span-4 h-[520px] p-[10px]'>
          <div className='h-full flex justify-center items-center flex-col space-y-4 border border-border border-dashed rounded-sm'>
            <Image width={150} height={150} src={overviewImage} alt='' />
            <div className='text-center text-[13px] text-muted-foreground px-10'>
              <div>Bạn có muốn xem các chỉ số cho video gần đây của mình không?</div>
              <div>Hãy đăng tải và xuất bản một video để bắt đầu.</div>
            </div>
            <Button className='rounded-[2px] uppercase text-white bg-blue-700 hover:bg-blue-800' asChild>
              <Link href={PATH.UPLOAD_VIDEO}>Tải video lên</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Studio
