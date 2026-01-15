export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import clientPromise from '@/lib/mongodb'
import { defaultSettings } from '@/models/Settings'

// GET - Obter configurações
export async function GET() {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)

    const existingSettings = await db.collection('settings').findOne({})

    // Se não existir, criar com valores padrão
    if (!existingSettings) {
      const newSettings = {
        ...defaultSettings,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      const result = await db.collection('settings').insertOne(newSettings)
      return NextResponse.json({
        settings: { ...newSettings, _id: result.insertedId }
      })
    }

    return NextResponse.json({ settings: existingSettings })
  } catch (error) {
    console.error('Erro ao buscar configurações:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar configurações' },
      { status: 500 }
    )
  }
}

// PUT - Atualizar configurações
export async function PUT(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()

    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)

    // Buscar configurações existentes
    const existingSettings = await db.collection('settings').findOne({})

    // Usar valores existentes ou padrão
    const currentSettings = existingSettings || {
      ...defaultSettings,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Construir objeto de atualização
    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
      lastModifiedBy: {
        id: session.user.id || '',
        name: session.user.name || '',
        email: session.user.email || '',
      },
    }

    // Atualizar campos de branding
    if (body.branding) {
      updateData.branding = {
        ...currentSettings.branding,
        ...body.branding,
      }
    }

    // Atualizar campos de redes sociais
    if (body.socialMedia) {
      updateData.socialMedia = {
        ...currentSettings.socialMedia,
        ...body.socialMedia,
      }
    }

    // Atualizar campos gerais
    if (body.general) {
      updateData.general = {
        ...currentSettings.general,
        ...body.general,
      }
    }

    // Atualizar campos de preço
    if (body.pricing) {
      updateData.pricing = {
        ...currentSettings.pricing,
        ...body.pricing,
      }
    }

    // Atualizar campos de notificações
    if (body.notifications) {
      updateData.notifications = {
        ...currentSettings.notifications,
        ...body.notifications,
      }
    }

    // Atualizar campos de negócio
    if (body.business) {
      updateData.business = {
        ...currentSettings.business,
        ...body.business,
      }
    }

    // Upsert - atualizar ou criar
    const result = await db.collection('settings').updateOne(
      {},
      {
        $set: updateData,
        $setOnInsert: { createdAt: new Date() }
      },
      { upsert: true }
    )

    // Buscar documento atualizado
    const updatedSettings = await db.collection('settings').findOne({})

    return NextResponse.json({
      success: true,
      settings: updatedSettings,
    })
  } catch (error) {
    console.error('Erro ao atualizar configurações:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar configurações' },
      { status: 500 }
    )
  }
}
