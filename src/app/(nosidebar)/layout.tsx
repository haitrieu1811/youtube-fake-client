import { Fragment, ReactNode } from 'react'

import MainHeader from '@/components/main-header'
import MainOverlaySidebar from '@/components/main-overlay-sidebar'

const NoSidebarLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Fragment>
      <MainHeader />
      <MainOverlaySidebar />
      <main className='flex items-start'>
        {/* <MainSidebar /> */}
        <div className='flex-1'>{children}</div>
      </main>
    </Fragment>
  )
}

export default NoSidebarLayout
