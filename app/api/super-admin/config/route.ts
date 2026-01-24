import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getDatabase } from '@/lib/mongodb'

// GET - Buscar configurações globais
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const db = await getDatabase()

    // Buscar configurações globais (sem tenantId)
    let config = await db.collection('global_config').findOne({ _id: 'system' as unknown as import('mongodb').ObjectId })

    if (!config) {
      // Criar configuração padrão
      const defaultConfig = {
        _id: 'system' as unknown as import('mongodb').ObjectId,
        showDemoBanner: process.env.NEXT_PUBLIC_SHOW_DEMO_BANNER === 'true',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      await db.collection('global_config').insertOne(defaultConfig as any)
      config = defaultConfig as any
    }

    return NextResponse.json(config)
  } catch (error) {
    console.error('Erro ao buscar configurações:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

// PUT - Atualizar configurações globais
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const db = await getDatabase()

    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    }

    // Apenas permitir campos específicos
    if (typeof body.showDemoBanner === 'boolean') {
      updateData.showDemoBanner = body.showDemoBanner
    }

    await db.collection('global_config').updateOne(
      { _id: 'system' as unknown as import('mongodb').ObjectId },
      {
        $set: updateData,
        $setOnInsert: { createdAt: new Date() }
      },
      { upsert: true }
    )

    const config = await db.collection('global_config').findOne({ _id: 'system' as unknown as import('mongodb').ObjectId })

    return NextResponse.json(config)
  } catch (error) {
    console.error('Erro ao atualizar configurações:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
