export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { hash } from 'bcryptjs'
import { createTenantDefaults, isValidSlug, planLimits, TenantPlan } from '@/models/Tenant'
import { defaultSettings } from '@/models/Settings'

/**
 * GET /api/super-admin/tenants
 * Lista todos os tenants
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== 'super_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const db = await getDatabase()

    const filter: Record<string, string> = {}
    if (status && status !== 'all') {
      filter.status = status
    }

    const tenants = await db
      .collection('tenants')
      .aggregate([
        { $match: filter },
        { $sort: { createdAt: -1 } },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: 'tenantId',
            as: 'users',
          },
        },
        {
          $lookup: {
            from: 'cars',
            localField: '_id',
            foreignField: 'tenantId',
            as: 'cars',
          },
        },
        {
          $addFields: {
            usersCount: { $size: '$users' },
            carsCount: { $size: '$cars' },
          },
        },
        {
          $project: {
            users: 0,
            cars: 0,
          },
        },
      ])
      .toArray()

    return NextResponse.json({ tenants })
  } catch (error) {
    console.error('Erro ao listar tenants:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/super-admin/tenants
 * Cria um novo tenant
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== 'super_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, slug, ownerName, ownerEmail, ownerPassword, plan = 'starter' } = body

    // Validações
    if (!name || !slug || !ownerEmail || !ownerName || !ownerPassword) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 })
    }

    if (!isValidSlug(slug)) {
      return NextResponse.json(
        { error: 'Slug inválido. Use apenas letras minúsculas, números e hífens (3-50 caracteres)' },
        { status: 400 }
      )
    }

    if (ownerPassword.length < 6) {
      return NextResponse.json({ error: 'Senha deve ter no mínimo 6 caracteres' }, { status: 400 })
    }

    const db = await getDatabase()

    // Verificar se slug já existe
    const existingTenant = await db.collection('tenants').findOne({ slug })
    if (existingTenant) {
      return NextResponse.json({ error: 'Este slug já está em uso' }, { status: 409 })
    }

    // Verificar se email já existe como super_admin
    const existingSuperAdmin = await db.collection('users').findOne({
      email: ownerEmail.toLowerCase(),
      role: 'super_admin',
    })
    if (existingSuperAdmin) {
      return NextResponse.json({ error: 'Este email já está cadastrado como super admin' }, { status: 409 })
    }

    const now = new Date()
    const baseDomain = process.env.BASE_DOMAIN || 'localhost'

    // Criar tenant
    const tenant = createTenantDefaults({
      name,
      slug,
      domains: {
        primary: `${slug}.${baseDomain}`,
        custom: [],
      },
      subscription: {
        plan: plan as TenantPlan,
        status: 'active',
        currentPeriodStart: now,
        currentPeriodEnd: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
      },
      limits: planLimits[plan as TenantPlan] || planLimits.starter,
      owner: {
        userId: new ObjectId(), // Será atualizado após criar o usuário
        name: ownerName,
        email: ownerEmail.toLowerCase(),
      },
      status: 'active',
      createdAt: now,
      updatedAt: now,
    })

    const tenantResult = await db.collection('tenants').insertOne(tenant)
    const tenantId = tenantResult.insertedId

    // Criar usuário admin do tenant
    const hashedPassword = await hash(ownerPassword, 12)
    const adminUser = {
      tenantId,
      email: ownerEmail.toLowerCase(),
      password: hashedPassword,
      name: ownerName,
      role: 'admin',
      status: 'active',
      favorites: [],
      createdAt: now,
      updatedAt: now,
    }

    const userResult = await db.collection('users').insertOne(adminUser)

    // Atualizar tenant com userId do owner
    await db.collection('tenants').updateOne(
      { _id: tenantId },
      { $set: { 'owner.userId': userResult.insertedId } }
    )

    // Criar settings padrão para o tenant
    const tenantSettings = {
      tenantId,
      ...defaultSettings,
      createdAt: now,
      updatedAt: now,
    }
    await db.collection('settings').insertOne(tenantSettings)

    return NextResponse.json(
      {
        message: 'Tenant criado com sucesso',
        tenant: {
          ...tenant,
          _id: tenantId,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Erro ao criar tenant:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
