import { Fragment, ReactNode } from 'react'

import MainHeader from '@/components/main-header'
import MainSidebar from '@/components/main-sidebar'

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Fragment>
      <MainHeader />
      <main className='flex items-start'>
        <MainSidebar />
        <div className='flex-1'>{children}</div>
      </main>
    </Fragment>
  )
}

export default MainLayout
