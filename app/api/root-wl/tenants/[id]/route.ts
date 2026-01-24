export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { clearTenantCache } from '@/lib/tenant/resolver'

/**
 * GET /api/root-wl/tenants/[id]
 * Busca um tenant específico
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== 'super_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    const db = await getDatabase()

    const tenant = await db.collection('tenants').aggregate([
      { $match: { _id: new ObjectId(id) } },
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
        $lookup: {
          from: 'bookings',
          localField: '_id',
          foreignField: 'tenantId',
          as: 'bookings',
        },
      },
      {
        $addFields: {
          usersCount: { $size: '$users' },
          carsCount: { $size: '$cars' },
          bookingsCount: { $size: '$bookings' },
        },
      },
      {
        $project: {
          users: 0,
          cars: 0,
          bookings: 0,
        },
      },
    ]).toArray()

    if (!tenant || tenant.length === 0) {
      return NextResponse.json({ error: 'Tenant não encontrado' }, { status: 404 })
    }

    return NextResponse.json({ tenant: tenant[0] })
  } catch (error) {
    console.error('Erro ao buscar tenant:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * PUT /api/root-wl/tenants/[id]
 * Atualiza um tenant
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== 'super_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    const body = await request.json()
    const { name, status, subscription, limits, domains } = body

    const db = await getDatabase()

    // Verificar se tenant existe
    const existingTenant = await db.collection('tenants').findOne({ _id: new ObjectId(id) })
    if (!existingTenant) {
      return NextResponse.json({ error: 'Tenant não encontrado' }, { status: 404 })
    }

    // Construir update
    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    }

    if (name) updateData.name = name
    if (status) updateData.status = status
    if (subscription) {
      if (subscription.plan) updateData['subscription.plan'] = subscription.plan
      if (subscription.status) updateData['subscription.status'] = subscription.status
    }
    if (limits) {
      if (limits.maxUsers !== undefined) updateData['limits.maxUsers'] = limits.maxUsers
      if (limits.maxCars !== undefined) updateData['limits.maxCars'] = limits.maxCars
    }
    if (domains) {
      if (domains.custom) updateData['domains.custom'] = domains.custom
    }

    await db.collection('tenants').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )

    // Limpar cache do tenant
    clearTenantCache(existingTenant.domains.primary)
    existingTenant.domains.custom?.forEach((domain: string) => clearTenantCache(domain))

    return NextResponse.json({ message: 'Tenant atualizado com sucesso' })
  } catch (error) {
    console.error('Erro ao atualizar tenant:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * DELETE /api/root-wl/tenants/[id]
 * Deleta um tenant (soft delete)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== 'super_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    const db = await getDatabase()

    // Verificar se tenant existe
    const existingTenant = await db.collection('tenants').findOne({ _id: new ObjectId(id) })
    if (!existingTenant) {
      return NextResponse.json({ error: 'Tenant não encontrado' }, { status: 404 })
    }

    // Soft delete - apenas marca como deletado
    await db.collection('tenants').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: 'inactive',
          deletedAt: new Date(),
          updatedAt: new Date(),
        },
      }
    )

    // Limpar cache
    clearTenantCache(existingTenant.domains.primary)
    existingTenant.domains.custom?.forEach((domain: string) => clearTenantCache(domain))

    return NextResponse.json({ message: 'Tenant removido com sucesso' })
  } catch (error) {
    console.error('Erro ao deletar tenant:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
