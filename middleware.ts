import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Cache em memória para validação de tenant no middleware
const tenantValidationCache = new Map<string, { valid: boolean; status: string; expires: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutos

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
    const response = await fetch(`${origin}/api/tenant/validate?hostname=${encodeURIComponent(hostname)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })

    if (!response.ok) {
      // Em caso de erro, bloquear acesso - tenant não validado
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
    console.error('Erro ao validar tenant no middleware:', error)
    // Em caso de erro, bloquear acesso - tenant não validado
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

    // VALIDAÇÃO DE TENANT: Se não é domínio principal, validar se tenant existe
    if (!isMain) {
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

    // Rotas de root-wl - só acessível do domínio principal
    if (pathname.startsWith('/root-wl')) {
      // Só permitir acesso do domínio principal
      if (!isMain) {
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
