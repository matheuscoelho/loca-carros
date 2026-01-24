import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'

// Cache simples em memória (5 minutos)
let cachedValue: { show: boolean; timestamp: number } | null = null
const CACHE_TTL = 5 * 60 * 1000 // 5 minutos

export async function GET() {
  try {
    // Verificar cache
    if (cachedValue && Date.now() - cachedValue.timestamp < CACHE_TTL) {
      return NextResponse.json({ show: cachedValue.show })
    }

    const db = await getDatabase()
    const config = await db.collection('global_config').findOne({ _id: 'system' as unknown as import('mongodb').ObjectId })

    // Se não existe config no banco, usar variável de ambiente
    const show = config?.showDemoBanner ?? (process.env.NEXT_PUBLIC_SHOW_DEMO_BANNER === 'true')

    // Atualizar cache
    cachedValue = { show, timestamp: Date.now() }

    return NextResponse.json({ show })
  } catch (error) {
    // Em caso de erro, usar variável de ambiente como fallback
    const show = process.env.NEXT_PUBLIC_SHOW_DEMO_BANNER === 'true'
    return NextResponse.json({ show })
  }
}
