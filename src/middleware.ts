import { auth } from '@/lib/auth/auth-config'

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const role = req.auth?.user?.role
  const isOnDashboard = req.nextUrl.pathname.startsWith('/cliente') ||
                        req.nextUrl.pathname.startsWith('/motoboy') ||
                        req.nextUrl.pathname.startsWith('/admin')
  const isOnLogin = req.nextUrl.pathname.startsWith('/login')
  const isOnPublic = req.nextUrl.pathname === '/' ||
                     req.nextUrl.pathname.startsWith('/api/auth')

  if (!isLoggedIn && isOnDashboard) {
    return Response.redirect(new URL('/login', req.nextUrl))
  }

  if (isLoggedIn && isOnLogin && role) {
    return Response.redirect(new URL(`/${role}`, req.nextUrl))
  }

  // Role-based access control
  if (isLoggedIn && isOnDashboard && role) {
    const pathname = req.nextUrl.pathname

    if (pathname.startsWith('/cliente') && role !== 'cliente') {
      return Response.redirect(new URL(`/${role}`, req.nextUrl))
    }
    if (pathname.startsWith('/motoboy') && role !== 'motoboy') {
      return Response.redirect(new URL(`/${role}`, req.nextUrl))
    }
    if (pathname.startsWith('/admin') && role !== 'gerente') {
      return Response.redirect(new URL(`/${role}`, req.nextUrl))
    }
  }
})

export const config = {
  matcher: [
    '/cliente/:path*',
    '/motoboy/:path*',
    '/admin/:path*',
    '/login/:path*',
  ],
}