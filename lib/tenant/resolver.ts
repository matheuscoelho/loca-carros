import { headers } from 'next/headers'
import { NextRequest } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { ITenant } from '@/models/Tenant'
import { ObjectId } from 'mongodb'

export interface TenantContext {
  tenant: ITenant | null
  tenantId: string | null
  hostname: string
  isSubdomain: boolean
  isCustomDomain: boolean
}

// Cache em memória para tenants (em produção, considerar Redis)
const tenantCache = new Map<string, { tenant: ITenant; expires: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutos

/**
 * Resolve o tenant a partir do hostname da requisição atual (Server Components)
 * Aceita opcionalmente um NextRequest para uso em API routes
 */
export async function resolveTenantFromRequest(request?: NextRequest): Promise<TenantContext> {
  let hostname: string

  if (request) {
    // API route - get from request headers
    hostname = request.headers.get('host') || request.headers.get('x-forwarded-host') || ''
  } else {
    // Server Component - use next/headers
    const headersList = await headers()
    hostname = headersList.get('host') || headersList.get('x-forwarded-host') || ''
  }

  return resolveTenantByHostname(hostname)
}

/**
 * Resolve o tenant a partir de um hostname específico
 */
export async function resolveTenantByHostname(hostname: string): Promise<TenantContext> {
  // Remover porta se existir
  const cleanHostname = hostname.split(':')[0].toLowerCase()

  // Verificar cache primeiro
  const cached = tenantCache.get(cleanHostname)
  if (cached && cached.expires > Date.now()) {
    return {
      tenant: cached.tenant,
      tenantId: cached.tenant._id?.toString() || null,
      hostname: cleanHostname,
      isSubdomain: isSubdomain(cleanHostname),
      isCustomDomain: isCustomDomain(cleanHostname),
    }
  }

  try {
    const db = await getDatabase()

    // Extrair possível slug do subdomínio
    const slug = extractSubdomainSlug(cleanHostname)

    // Buscar tenant por domínio customizado, subdomínio ou slug
    const tenant = await db.collection<ITenant>('tenants').findOne({
      $or: [
        { 'domains.primary': cleanHostname },
        { 'domains.custom': cleanHostname },
        ...(slug ? [{ slug }] : []),
      ],
      status: 'active',
    })

    // Atualizar cache se encontrou
    if (tenant) {
      tenantCache.set(cleanHostname, {
        tenant,
        expires: Date.now() + CACHE_TTL,
      })
    }

    return {
      tenant,
      tenantId: tenant?._id?.toString() || null,
      hostname: cleanHostname,
      isSubdomain: isSubdomain(cleanHostname),
      isCustomDomain: isCustomDomain(cleanHostname),
    }
  } catch (error) {
    console.error('Erro ao resolver tenant:', error)
    return {
      tenant: null,
      tenantId: null,
      hostname: cleanHostname,
      isSubdomain: false,
      isCustomDomain: false,
    }
  }
}

/**
 * Resolve tenant por ID
 */
export async function resolveTenantById(tenantId: string): Promise<ITenant | null> {
  try {
    const db = await getDatabase()
    const tenant = await db.collection<ITenant>('tenants').findOne({
      _id: new ObjectId(tenantId),
      status: 'active',
    })
    return tenant
  } catch (error) {
    console.error('Erro ao resolver tenant por ID:', error)
    return null
  }
}

/**
 * Verifica se o hostname é um subdomínio do domínio base
 */
function isSubdomain(hostname: string): boolean {
  const baseDomain = process.env.BASE_DOMAIN || 'localhost'
  return hostname.endsWith(`.${baseDomain}`) || hostname.includes(`.${baseDomain}:`)
}

/**
 * Verifica se é um domínio customizado (não é subdomínio do base)
 */
function isCustomDomain(hostname: string): boolean {
  const baseDomain = process.env.BASE_DOMAIN || 'localhost'
  return !hostname.includes(baseDomain) && hostname !== 'localhost' && !hostname.startsWith('localhost:')
}

/**
 * Extrai o slug do subdomínio
 * Ex: "locadora-alpha.seusite.com" -> "locadora-alpha"
 */
function extractSubdomainSlug(hostname: string): string | null {
  const baseDomain = process.env.BASE_DOMAIN || 'localhost'

  if (hostname.endsWith(`.${baseDomain}`)) {
    return hostname.replace(`.${baseDomain}`, '')
  }

  // Para desenvolvimento local com porta
  if (hostname.includes(`.${baseDomain}:`)) {
    const withoutPort = hostname.split(':')[0]
    return withoutPort.replace(`.${baseDomain}`, '')
  }

  return null
}

/**
 * Limpa o cache de um hostname específico ou todo o cache
 */
export function clearTenantCache(hostname?: string): void {
  if (hostname) {
    tenantCache.delete(hostname.toLowerCase())
  } else {
    tenantCache.clear()
  }
}

/**
 * Invalida o cache de um tenant específico por ID
 * (útil após atualizar dados do tenant)
 */
export function invalidateTenantCacheById(tenantId: string): void {
  for (const [hostname, cached] of tenantCache.entries()) {
    if (cached.tenant._id?.toString() === tenantId) {
      tenantCache.delete(hostname)
    }
  }
}

/**
 * Verifica se o hostname atual é o domínio principal (para super admin)
 */
export function isMainDomain(hostname: string): boolean {
  const baseDomain = process.env.BASE_DOMAIN || 'localhost'
  const cleanHostname = hostname.split(':')[0].toLowerCase()

  // É o domínio principal se:
  // 1. É exatamente o baseDomain
  // 2. É www.baseDomain
  // 3. É localhost (desenvolvimento)
  return (
    cleanHostname === baseDomain ||
    cleanHostname === `www.${baseDomain}` ||
    cleanHostname === 'localhost' ||
    cleanHostname.startsWith('localhost:')
  )
}

/**
 * Gera o domínio primário para um novo tenant
 */
export function generatePrimaryDomain(slug: string): string {
  const baseDomain = process.env.BASE_DOMAIN || 'localhost'
  return `${slug}.${baseDomain}`
}
