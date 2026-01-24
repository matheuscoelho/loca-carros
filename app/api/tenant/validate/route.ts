export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { ITenant } from '@/models/Tenant'

// Cache em memória para validação de tenant (evita queries repetidas)
const validationCache = new Map<string, { valid: boolean; status: string; expires: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutos

/**
 * GET /api/tenant/validate?hostname=xxx
 * Valida se um hostname tem tenant cadastrado
 * Retorna: { valid: boolean, status: 'active' | 'inactive' | 'not_found' }
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const hostname = searchParams.get('hostname')

    if (!hostname) {
      return NextResponse.json(
        { valid: false, status: 'not_found', error: 'Hostname não fornecido' },
        { status: 400 }
      )
    }

    // Limpar hostname (remover porta se existir)
    const cleanHostname = hostname.split(':')[0].toLowerCase()

    // Verificar cache
    const cached = validationCache.get(cleanHostname)
    if (cached && cached.expires > Date.now()) {
      return NextResponse.json(
        { valid: cached.valid, status: cached.status },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
          },
        }
      )
    }

    const db = await getDatabase()

    // Buscar tenant por domínio (primary ou custom)
    const tenant = await db.collection<ITenant>('tenants').findOne({
      $or: [
        { 'domains.primary': cleanHostname },
        { 'domains.custom': cleanHostname },
      ],
    })

    let result: { valid: boolean; status: string }

    if (!tenant) {
      result = { valid: false, status: 'not_found' }
    } else if (tenant.status !== 'active') {
      result = { valid: false, status: 'inactive' }
    } else {
      result = { valid: true, status: 'active' }
    }

    // Atualizar cache
    validationCache.set(cleanHostname, {
      ...result,
      expires: Date.now() + CACHE_TTL,
    })

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    console.error('Erro ao validar tenant:', error)
    return NextResponse.json(
      { valid: false, status: 'error', error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

