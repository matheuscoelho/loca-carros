export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getDatabase } from '@/lib/mongodb'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== 'super_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = await getDatabase()

    // Estatísticas agregadas
    const [
      totalTenants,
      activeTenants,
      totalUsers,
      totalCars,
      totalBookings,
      recentTenants,
    ] = await Promise.all([
      db.collection('tenants').countDocuments(),
      db.collection('tenants').countDocuments({ status: 'active' }),
      db.collection('users').countDocuments(),
      db.collection('cars').countDocuments(),
      db.collection('bookings').countDocuments(),
      db.collection('tenants').aggregate([
        { $sort: { createdAt: -1 } },
        { $limit: 5 },
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
      ]).toArray(),
    ])

    return NextResponse.json({
      totalTenants,
      activeTenants,
      totalUsers,
      totalCars,
      totalBookings,
      recentTenants,
    })
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
