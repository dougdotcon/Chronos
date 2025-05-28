import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    // Add any custom middleware logic here
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Protect dashboard and other authenticated routes
        if (req.nextUrl.pathname.startsWith('/dashboard')) {
          return !!token
        }
        if (req.nextUrl.pathname.startsWith('/sweepstakes')) {
          return !!token
        }
        if (req.nextUrl.pathname.startsWith('/profile')) {
          return !!token
        }
        if (req.nextUrl.pathname.startsWith('/deposit')) {
          return !!token
        }
        if (req.nextUrl.pathname.startsWith('/withdraw')) {
          return !!token
        }
        if (req.nextUrl.pathname.startsWith('/history')) {
          return !!token
        }
        if (req.nextUrl.pathname.startsWith('/settings')) {
          return !!token
        }
        
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/sweepstakes/:path*',
    '/profile/:path*',
    '/deposit/:path*',
    '/withdraw/:path*',
    '/history/:path*',
    '/settings/:path*',
  ]
}
