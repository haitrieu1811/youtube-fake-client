import { Fragment, ReactNode } from 'react'

import StudioHeader from '@/components/studio-header'
import StudioSidebar from '@/components/studio-sidebar'

const StudioLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Fragment>
      <StudioHeader />
      <div className='flex items-start'>
        <StudioSidebar />
        <main className='flex-1 bg-muted'>{children}</main>
      </div>
    </Fragment>
  )
}

export default StudioLayout
