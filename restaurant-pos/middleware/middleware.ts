import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import AuthUtils from '@/utills/authUtills'
export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Check for access and refresh tokens
  const accessToken = request.cookies.get('accessToken')?.value
  const refreshToken = request.cookies.get('refreshToken')?.value
  const userData = request.cookies.get('userData')?.value

  // Define public paths
  const isPublicPath = path === '/login'

  // If no tokens and not on login page, redirect to login  
  if ((!accessToken || !refreshToken) && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If authenticated and tries to access login, redirect based on role
  if ((accessToken && refreshToken) && isPublicPath) {
    if (!userData) {
      // If tokens exist but no user data, redirect to login
      return NextResponse.redirect(new URL('/login', request.url))
    }

    const user = JSON.parse(userData)
    switch(user.role) {
      case 'restaurant_manager':
        return NextResponse.redirect(new URL('/restaurant_manager', request.url))
      case 'front_desk':
        return NextResponse.redirect(new URL('/front_desk', request.url))
      default:
        return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Role-based route protection
  if (userData && AuthUtils.getUserData()) {
    const user = JSON.parse(userData)
    
    // Detailed route protection configuration
    const protectedRoutes: Record<string, string[]> = {
      'restaurant_manager': ['/restaurant_manager'],
      'front_desk': ['/front_desk']
    }

    const userProtectedRoutes = protectedRoutes[user.role] || []
    
    // Check if the current path requires specific role access
    const requiresSpecificRole = userProtectedRoutes.some(route => path.startsWith(route))
    
    if (requiresSpecificRole) {
      // If user doesn't have the right role, redirect to unauthorized or home page
      if (!userProtectedRoutes.includes(path)) {
        return NextResponse.redirect(new URL('/', request.url))
      }
    }
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/',
    '/login',
    '/restaurant_manager/:path*',
    '/front_desk/:path*'
  ]
}