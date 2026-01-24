import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

/**
 * Verifica se o hostname é o domínio principal (para super_admin)
 */
function isMainDomain(hostname: string): boolean {
  const baseDomain = process.env.BASE_DOMAIN || 'localhost'
  const cleanHostname = hostname.split(':')[0].toLowerCase()

  return (
    cleanHostname === baseDomain ||
    cleanHostname === `www.${baseDomain}` ||
    cleanHostname === 'localhost' ||
    cleanHostname.startsWith('localhost')
  )
}

/**
 * Extrai o slug do subdomínio
 */
function extractTenantSlug(hostname: string): string | null {
  const baseDomain = process.env.BASE_DOMAIN || 'localhost'
  const cleanHostname = hostname.split(':')[0].toLowerCase()

  if (cleanHostname.endsWith(`.${baseDomain}`)) {
    return cleanHostname.replace(`.${baseDomain}`, '')
  }
  return null
}

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token
    const hostname = req.headers.get('host') || ''

    // Extrair informações do tenant
    const tenantSlug = extractTenantSlug(hostname)
    const isMain = isMainDomain(hostname)

    // Criar response base
    const response = NextResponse.next()

    // Injetar headers de tenant para uso em API routes e páginas
    if (tenantSlug) {
      response.headers.set('x-tenant-slug', tenantSlug)
    }
    response.headers.set('x-hostname', hostname)
    response.headers.set('x-is-main-domain', isMain ? 'true' : 'false')

    // Rotas de super-admin - só acessível do domínio principal
    if (pathname.startsWith('/super-admin')) {
      // Só permitir acesso do domínio principal
      if (!isMain) {
        return NextResponse.redirect(new URL('/', req.url))
      }

      // Página de login do super-admin é pública
      if (pathname === '/super-admin/login') {
        // Se já está logado como super_admin, redirecionar para o painel
        if (token?.role === 'super_admin') {
          return NextResponse.redirect(new URL('/super-admin', req.url))
        }
        return response
      }

      // Demais páginas do super-admin requerem role super_admin
      if (token?.role !== 'super_admin') {
        return NextResponse.redirect(new URL('/super-admin/login', req.url))
      }

      return response
    }

    // Rotas de admin - verificar role
    if (pathname.startsWith('/admin')) {
      // Admin e super_admin podem acessar
      if (token?.role !== 'admin' && token?.role !== 'super_admin') {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }

      // Se for super_admin acessando tenant específico, permitir
      // Se for admin, verificar se está no tenant correto (a verificação completa é feita na API)
      return response
    }

    return response
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

        // SEGURANÇA: Login do super-admin é uma rota separada (mas protegida pelo middleware)
        if (pathname === '/super-admin/login') {
          return true
        }

        // Rotas de API pública
        if (pathname.startsWith('/api/auth')) {
          return true
        }

        // API pública de settings e carros
        if (pathname.startsWith('/api/settings/public') || pathname.startsWith('/api/cars')) {
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
    // Proteger dashboard, admin e super-admin
    '/dashboard/:path*',
    '/admin/:path*',
    '/super-admin/:path*', // Multi-tenancy: painel super admin
    '/my-rentals/:path*',
    '/my-payments/:path*',
    '/favorites/:path*',
    '/notifications/:path*',
    '/profile/:path*',
    '/booking/:path*',
  ]
}
