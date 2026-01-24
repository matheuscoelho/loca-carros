import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

// Cache em memória para validação de tenant no middleware
const tenantValidationCache = new Map<string, { valid: boolean; status: string; expires: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutos

/**
 * Verifica se é ambiente de desenvolvimento (localhost)
 */
function isLocalhost(hostname: string): boolean {
  const cleanHostname = hostname.split(':')[0].toLowerCase()
  return cleanHostname === 'localhost' || cleanHostname.startsWith('localhost')
}

/**
 * Valida tenant chamando a API de validação
 */
async function validateTenant(hostname: string, origin: string): Promise<{ valid: boolean; status: string }> {
  const cleanHostname = hostname.split(':')[0].toLowerCase()

  // Verificar cache
  const cached = tenantValidationCache.get(cleanHostname)
  if (cached && cached.expires > Date.now()) {
    return { valid: cached.valid, status: cached.status }
  }

  try {
    // Usar fetch com timeout para evitar hang
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)

    // Usar NEXTAUTH_URL como base para evitar self-fetch loop
    const baseUrl = process.env.NEXTAUTH_URL || origin
    const response = await fetch(`${baseUrl}/api/tenant/validate?hostname=${encodeURIComponent(hostname)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      // Em caso de erro HTTP, bloquear acesso
      return { valid: false, status: 'not_found' }
    }

    const data = await response.json()

    // Atualizar cache
    tenantValidationCache.set(cleanHostname, {
      valid: data.valid,
      status: data.status,
      expires: Date.now() + CACHE_TTL,
    })

    return { valid: data.valid, status: data.status }
  } catch (error) {
    // Log detalhado do erro
    console.error('Erro ao validar tenant no middleware:', {
      hostname,
      origin,
      error: error instanceof Error ? error.message : String(error)
    })

    // Em caso de erro, bloquear acesso
    return { valid: false, status: 'not_found' }
  }
}

export default withAuth(
  async function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token
    const hostname = req.headers.get('host') || ''
    const origin = req.nextUrl.origin

    // Rotas de erro de tenant - sempre permitir
    if (pathname === '/tenant-not-found' || pathname === '/tenant-inactive') {
      return NextResponse.next()
    }

    // API de validação de tenant - sempre permitir
    if (pathname === '/api/tenant/validate') {
      return NextResponse.next()
    }

    // Rotas de API - não redirecionar, deixar as APIs tratarem o erro
    // As APIs retornam 404 JSON quando tenant não existe
    if (pathname.startsWith('/api/')) {
      return NextResponse.next()
    }

    // Criar response base
    const response = NextResponse.next()
    response.headers.set('x-hostname', hostname)

    // VALIDAÇÃO DE TENANT: Se não é localhost, validar se tenant existe no banco
    if (!isLocalhost(hostname)) {
      try {
        const validation = await validateTenant(hostname, origin)

        if (!validation.valid) {
          if (validation.status === 'not_found') {
            return NextResponse.redirect(new URL('/tenant-not-found', req.url))
          }
          if (validation.status === 'inactive') {
            return NextResponse.redirect(new URL('/tenant-inactive', req.url))
          }
        }
      } catch (error) {
        console.error('Erro na validação de tenant:', error)
        // Em caso de erro, bloquear acesso
        return NextResponse.redirect(new URL('/tenant-not-found', req.url))
      }
    }

    // Rotas de root-wl - só acessível do domínio configurado em ROOT_DOMAIN ou localhost
    if (pathname.startsWith('/root-wl')) {
      const rootDomain = process.env.ROOT_DOMAIN
      const cleanHostname = hostname.split(':')[0].toLowerCase()
      const isAllowedHost = (rootDomain && cleanHostname === rootDomain) || isLocalhost(hostname)

      if (!isAllowedHost) {
        return NextResponse.redirect(new URL('/', req.url))
      }

      // Página de login do root-wl é pública
      if (pathname === '/root-wl/login') {
        // Se já está logado como super_admin, redirecionar para o painel
        if (token?.role === 'super_admin') {
          return NextResponse.redirect(new URL('/root-wl', req.url))
        }
        return response
      }

      // Demais páginas do root-wl requerem role super_admin
      if (token?.role !== 'super_admin') {
        return NextResponse.redirect(new URL('/root-wl/login', req.url))
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
          '/tenant-not-found',
          '/tenant-inactive',
        ]

        // Verificar se é rota pública
        if (publicRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))) {
          return true
        }

        // SEGURANÇA: Login do root-wl é uma rota separada (mas protegida pelo middleware)
        if (pathname === '/root-wl/login') {
          return true
        }

        // Rotas de API pública
        if (pathname.startsWith('/api/auth')) {
          return true
        }

        // API pública de settings, carros e validação de tenant
        if (
          pathname.startsWith('/api/settings/public') ||
          pathname.startsWith('/api/cars') ||
          pathname.startsWith('/api/tenant/validate')
        ) {
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
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - assets (public assets)
     * - images (public images)
     */
    '/((?!_next/static|_next/image|favicon.ico|assets|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ]
}
