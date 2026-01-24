/**
 * Script de Migração para Multi-Tenancy
 *
 * Este script:
 * 1. Cria um tenant "default" para os dados existentes
 * 2. Adiciona tenantId a todos os documentos existentes
 * 3. Cria índices compostos para performance
 * 4. Atribui o primeiro admin como owner do tenant default
 * 5. Cria settings para o tenant default
 *
 * Executar com: npx ts-node scripts/migrate-to-multitenancy.ts
 */

import { MongoClient, ObjectId } from 'mongodb'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Carregar variáveis de ambiente
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const MONGODB_URI = process.env.MONGODB_URI!
const MONGODB_DB = process.env.MONGODB_DB || 'carento'
const BASE_DOMAIN = process.env.BASE_DOMAIN || 'localhost'

// Collections que precisam de tenantId
const COLLECTIONS_TO_MIGRATE = [
  'users',
  'cars',
  'bookings',
  'payments',
  'reviews',
  'notifications',
  'settings',
]

async function migrateToMultitenancy() {
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI não definido no .env')
    process.exit(1)
  }

  const client = new MongoClient(MONGODB_URI)

  try {
    console.log('🔌 Conectando ao MongoDB...')
    await client.connect()
    const db = client.db(MONGODB_DB)

    console.log(`📦 Banco de dados: ${MONGODB_DB}`)
    console.log(`🌐 Base domain: ${BASE_DOMAIN}`)
    console.log('')

    // 1. Verificar se já existe algum tenant
    const existingTenants = await db.collection('tenants').countDocuments()
    if (existingTenants > 0) {
      console.log(`⚠️  Já existem ${existingTenants} tenant(s) no banco.`)
      console.log('   Esta migração é para bancos sem multi-tenancy.')
      console.log('   Pulando criação de tenant default...')
      console.log('')
    } else {
      // 2. Buscar primeiro admin para ser o owner
      const firstAdmin = await db.collection('users').findOne({ role: 'admin' })

      // 3. Criar tenant default
      console.log('📝 Criando tenant default...')
      const now = new Date()
      const oneYearLater = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000)

      const defaultTenant = {
        name: 'Tenant Padrão',
        slug: 'default',
        domains: {
          primary: BASE_DOMAIN,
          custom: [],
        },
        owner: {
          userId: firstAdmin?._id || new ObjectId(),
          name: firstAdmin?.name || 'Admin',
          email: firstAdmin?.email || 'admin@example.com',
        },
        subscription: {
          plan: 'enterprise',
          status: 'active',
          currentPeriodStart: now,
          currentPeriodEnd: oneYearLater,
        },
        limits: {
          maxUsers: -1, // ilimitado
          maxCars: -1,
          maxBookingsPerMonth: -1,
          maxStorageGB: 100,
        },
        settings: {
          timezone: 'America/Sao_Paulo',
          currency: 'BRL',
          language: 'pt-BR',
          dateFormat: 'DD/MM/YYYY',
        },
        status: 'active',
        createdAt: now,
        updatedAt: now,
      }

      const tenantResult = await db.collection('tenants').insertOne(defaultTenant)
      const tenantId = tenantResult.insertedId

      console.log(`✅ Tenant default criado: ${tenantId}`)
      console.log('')

      // 4. Adicionar tenantId a todas as collections
      console.log('📦 Migrando collections...')

      for (const collectionName of COLLECTIONS_TO_MIGRATE) {
        const collection = db.collection(collectionName)
        const countBefore = await collection.countDocuments({ tenantId: { $exists: false } })

        if (countBefore === 0) {
          console.log(`   ⏭️  ${collectionName}: nenhum documento para migrar`)
          continue
        }

        const result = await collection.updateMany(
          { tenantId: { $exists: false } },
          { $set: { tenantId } }
        )

        console.log(`   ✅ ${collectionName}: ${result.modifiedCount} documentos migrados`)
      }
      console.log('')

      // 5. Atualizar owner do tenant com o userId correto
      if (firstAdmin) {
        await db.collection('tenants').updateOne(
          { _id: tenantId },
          {
            $set: {
              'owner.userId': firstAdmin._id,
              'owner.name': firstAdmin.name,
              'owner.email': firstAdmin.email,
            },
          }
        )
        console.log(`👤 Owner do tenant atualizado: ${firstAdmin.email}`)
        console.log('')
      }
    }

    // 6. Criar índices
    console.log('🔍 Criando índices...')

    // Índices para tenants
    await db.collection('tenants').createIndex({ slug: 1 }, { unique: true })
    await db.collection('tenants').createIndex({ 'domains.primary': 1 })
    await db.collection('tenants').createIndex({ 'domains.custom': 1 })
    await db.collection('tenants').createIndex({ status: 1 })
    console.log('   ✅ tenants: índices criados')

    // Índice composto para users (email único por tenant)
    try {
      // Remover índice antigo de email único global
      await db.collection('users').dropIndex('email_1').catch(() => {})
    } catch {
      // Índice pode não existir
    }
    await db.collection('users').createIndex({ email: 1, tenantId: 1 }, { unique: true })
    await db.collection('users').createIndex({ tenantId: 1 })
    console.log('   ✅ users: índice composto email+tenantId criado')

    // Índices para outras collections
    for (const collectionName of ['cars', 'bookings', 'payments', 'reviews', 'notifications']) {
      await db.collection(collectionName).createIndex({ tenantId: 1 })
      await db.collection(collectionName).createIndex({ tenantId: 1, status: 1 })
      console.log(`   ✅ ${collectionName}: índices criados`)
    }

    // Índice único para settings por tenant
    await db.collection('settings').createIndex({ tenantId: 1 }, { unique: true })
    console.log('   ✅ settings: índice único por tenant criado')

    console.log('')
    console.log('🎉 Migração concluída com sucesso!')
    console.log('')
    console.log('Próximos passos:')
    console.log('1. Adicione BASE_DOMAIN ao seu .env (ex: BASE_DOMAIN=seusite.com)')
    console.log('2. Reinicie a aplicação')
    console.log('3. Acesse /root-wl para gerenciar tenants')
    console.log('')
  } catch (error) {
    console.error('❌ Erro na migração:', error)
    process.exit(1)
  } finally {
    await client.close()
  }
}

// Executar migração
migrateToMultitenancy()
