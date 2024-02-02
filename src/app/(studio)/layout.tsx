import { Fragment, ReactNode } from 'react'

import StudioHeader from '@/components/studio-header'
import StudioMenuMobile from '@/components/studio-menu-mobile'
import StudioSidebar from '@/components/studio-sidebar'

const StudioLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Fragment>
      <StudioHeader />
      <div className='flex'>
        <div className='hidden lg:block'>
          <StudioSidebar />
        </div>
        <main className='flex-1'>
          {children}
          <div className='sticky bottom-0 left-0 right-0 block lg:hidden'>
            <StudioMenuMobile />
          </div>
        </main>
      </div>
    </Fragment>
  )
}

export default StudioLayout
