import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    // Rotas de admin - verificar role
    if (pathname.startsWith('/admin')) {
      if (token?.role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Rotas públicas - não requer autenticação
        const publicRoutes = [
          '/',
          '/login',
          '/register',
          '/forgot-password',
          '/reset-password',
          '/cars-list-1',
          '/cars-list-2',
          '/cars-list-3',
          '/cars-list-4',
          '/cars-details-1',
          '/cars-details-2',
          '/cars-details-3',
          '/cars-details-4',
          '/about-us',
          '/contact',
          '/services',
          '/pricing',
          '/faqs',
          '/term',
          '/blog-list',
          '/blog-grid',
          '/blog-details',
          '/dealer-listing',
          '/dealer-details',
          '/shop-list',
          '/shop-details',
          '/calculator',
          '/404',
          '/index-2',
          '/index-3',
          '/cars',
        ]

        // Verificar se é rota pública
        if (publicRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))) {
          return true
        }

        // Rotas de API pública
        if (pathname.startsWith('/api/auth')) {
          return true
        }

        // Rotas protegidas - requer token
        return !!token
      }
    },
    pages: {
      signIn: '/login',
    }
  }
)

export const config = {
  matcher: [
    // Proteger dashboard e admin
    '/dashboard/:path*',
    '/admin/:path*',
    '/my-rentals/:path*',
    '/my-payments/:path*',
    '/favorites/:path*',
    '/notifications/:path*',
    '/profile/:path*',
    '/booking/:path*',
  ]
}
