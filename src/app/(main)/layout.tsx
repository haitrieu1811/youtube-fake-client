import { Fragment, ReactNode } from 'react'

import MainHeader from '@/components/main-header'
import MainSidebar from '@/components/main-sidebar'

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Fragment>
      <MainHeader />
      <main className='flex items-start'>
        <div className='w-56 py-4 max-h-[calc(100vh-56px)] overflow-y-auto sticky top-14 left-0 bottom-0'>
          <MainSidebar />
        </div>
        <div className='flex-1'>{children}</div>
      </main>
    </Fragment>
  )
}

export default MainLayout
