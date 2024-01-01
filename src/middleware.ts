import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import PATH from './constants/path'

const protectedRoutes: string[] = [PATH.CHANNEL, PATH.STUDIO]
const rejectedRoutes: string[] = [PATH.REGISTER]

const middleware = (req: NextRequest) => {
  const isAuthenticated = req.cookies.has('accessToken')

  if (!isAuthenticated && protectedRoutes.includes(req.nextUrl.pathname)) {
    const absoluteURL = new URL(`${req.nextUrl.origin}${PATH.LOGIN}`)
    return NextResponse.redirect(absoluteURL.toString())
  }

  if (isAuthenticated && rejectedRoutes.includes(req.nextUrl.pathname)) {
    const absoluteURL = new URL(req.nextUrl.origin)
    return NextResponse.redirect(absoluteURL.toString())
  }
}

export default middleware
