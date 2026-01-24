import { getDatabase } from '@/lib/mongodb'

export interface Migration {
  name: string
  up: (db: Awaited<ReturnType<typeof getDatabase>>) => Promise<void>
}

// Importar todas as migrations
import { migration_001_create_root_tenant } from './001_create_root_tenant'

// Lista de migrations em ordem
const migrations: Migration[] = [
  migration_001_create_root_tenant,
]

/**
 * Executa todas as migrations pendentes
 */
export async function runMigrations() {
  try {
    const db = await getDatabase()

    // Garantir que a collection de migrations existe
    const migrationsCollection = db.collection('_migrations')

    for (const migration of migrations) {
      // Verificar se já foi executada
      const executed = await migrationsCollection.findOne({ name: migration.name })

      if (executed) {
        continue
      }

      console.log(`🔄 Executando migration: ${migration.name}`)

      try {
        await migration.up(db)

        // Marcar como executada
        await migrationsCollection.insertOne({
          name: migration.name,
          executedAt: new Date(),
        })

        console.log(`✅ Migration executada: ${migration.name}`)
      } catch (error) {
        console.error(`❌ Erro na migration ${migration.name}:`, error)
        throw error
      }
    }
  } catch (error) {
    console.error('❌ Erro ao executar migrations:', error)
  }
}
