import { getDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { hash } from 'bcryptjs'
import { createTenantDefaults, planLimits } from '@/models/Tenant'
import { defaultSettings } from '@/models/Settings'
import type { Migration } from './index'

export const migration_001_create_root_tenant: Migration = {
  name: '001_create_root_tenant',

  async up(db: Awaited<ReturnType<typeof getDatabase>>) {
    const now = new Date()
    const baseDomain = process.env.BASE_DOMAIN || 'navegarsistemas.com.br'

    // ========================================
    // 1. Criar Super Admin (root-wl)
    // ========================================
    const superAdminEmail = 'super@admin.com'
    const superAdminPassword = 'super123'

    const existingSuperAdmin = await db.collection('users').findOne({
      email: superAdminEmail,
      role: 'super_admin',
    })

    if (!existingSuperAdmin) {
      const hashedPassword = await hash(superAdminPassword, 12)
      await db.collection('users').insertOne({
        email: superAdminEmail,
        password: hashedPassword,
        name: 'Super Administrador',
        role: 'super_admin',
        status: 'active',
        favorites: [],
        createdAt: now,
        updatedAt: now,
      })
      console.log('  ✅ Super Admin criado: super@admin.com / super123')
    } else {
      console.log('  ⏭️ Super Admin já existe')
    }

    // ========================================
    // 2. Criar Tenant loca-carros
    // ========================================
    const tenantSlug = 'loca-carros'
    const tenantDomain = `${tenantSlug}.${baseDomain}`

    const existingTenant = await db.collection('tenants').findOne({
      $or: [
        { slug: tenantSlug },
        { 'domains.primary': tenantDomain },
      ]
    })

    if (!existingTenant) {
      const tenantData = createTenantDefaults({
        name: 'Loca Carros',
        slug: tenantSlug,
        domains: {
          primary: tenantDomain,
          custom: [],
        },
        subscription: {
          plan: 'professional',
          status: 'active',
          currentPeriodStart: now,
          currentPeriodEnd: new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000),
        },
        limits: planLimits.professional,
        owner: {
          userId: new ObjectId(),
          name: 'Admin Loca Carros',
          email: 'admin@locacarros.com',
        },
        status: 'active',
        createdAt: now,
        updatedAt: now,
      })

      const tenantResult = await db.collection('tenants').insertOne(tenantData)
      const tenantId = tenantResult.insertedId

      // Criar admin do tenant
      const adminPassword = await hash('locacarros123', 12)
      const adminResult = await db.collection('users').insertOne({
        tenantId,
        email: 'admin@locacarros.com',
        password: adminPassword,
        name: 'Admin Loca Carros',
        role: 'admin',
        status: 'active',
        favorites: [],
        createdAt: now,
        updatedAt: now,
      })

      // Atualizar owner do tenant
      await db.collection('tenants').updateOne(
        { _id: tenantId },
        { $set: { 'owner.userId': adminResult.insertedId } }
      )

      // Criar settings
      await db.collection('settings').insertOne({
        tenantId,
        ...defaultSettings,
        createdAt: now,
        updatedAt: now,
      })

      console.log(`  ✅ Tenant criado: ${tenantDomain}`)
      console.log('  ✅ Admin criado: admin@locacarros.com / locacarros123')
    } else {
      console.log(`  ⏭️ Tenant ${tenantSlug} já existe`)
    }
  }
}
