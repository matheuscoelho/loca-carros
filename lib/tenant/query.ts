import { ObjectId, Collection, Filter, Document, UpdateFilter, OptionalUnlessRequiredId, WithId } from 'mongodb'
import { getDatabase } from '@/lib/mongodb'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { resolveTenantFromRequest } from './resolver'

/**
 * Wrapper para queries MongoDB com isolamento automático por tenant.
 * Adiciona tenantId automaticamente a todas as operações.
 */
export class TenantAwareQuery<T extends Document> {
  private collection: Collection<T>
  private tenantId: ObjectId

  constructor(collection: Collection<T>, tenantId: string | ObjectId) {
    this.collection = collection
    this.tenantId = typeof tenantId === 'string' ? new ObjectId(tenantId) : tenantId
  }

  /**
   * Adiciona tenantId ao filtro
   */
  private withTenant<F extends Filter<T>>(filter: F): F & { tenantId: ObjectId } {
    return {
      ...filter,
      tenantId: this.tenantId,
    } as F & { tenantId: ObjectId }
  }

  /**
   * Busca múltiplos documentos
   */
  find(filter: Filter<T> = {}) {
    return this.collection.find(this.withTenant(filter))
  }

  /**
   * Busca um documento
   */
  async findOne(filter: Filter<T> = {}): Promise<WithId<T> | null> {
    return this.collection.findOne(this.withTenant(filter))
  }

  /**
   * Busca por ID (já inclui tenantId para segurança)
   */
  async findById(id: string | ObjectId): Promise<WithId<T> | null> {
    const objectId = typeof id === 'string' ? new ObjectId(id) : id
    return this.collection.findOne(this.withTenant({ _id: objectId } as Filter<T>))
  }

  /**
   * Insere um documento (adiciona tenantId automaticamente)
   */
  async insertOne(doc: Omit<OptionalUnlessRequiredId<T>, 'tenantId'>) {
    const docWithTenant = {
      ...doc,
      tenantId: this.tenantId,
    } as unknown as OptionalUnlessRequiredId<T>
    return this.collection.insertOne(docWithTenant)
  }

  /**
   * Insere múltiplos documentos (adiciona tenantId a cada um)
   */
  async insertMany(docs: Array<Omit<OptionalUnlessRequiredId<T>, 'tenantId'>>) {
    const docsWithTenant = docs.map(doc => ({
      ...doc,
      tenantId: this.tenantId,
    })) as unknown as Array<OptionalUnlessRequiredId<T>>
    return this.collection.insertMany(docsWithTenant)
  }

  /**
   * Atualiza um documento
   */
  async updateOne(filter: Filter<T>, update: UpdateFilter<T>) {
    return this.collection.updateOne(this.withTenant(filter), update)
  }

  /**
   * Atualiza por ID
   */
  async updateById(id: string | ObjectId, update: UpdateFilter<T>) {
    const objectId = typeof id === 'string' ? new ObjectId(id) : id
    return this.collection.updateOne(
      this.withTenant({ _id: objectId } as Filter<T>),
      update
    )
  }

  /**
   * Atualiza múltiplos documentos
   */
  async updateMany(filter: Filter<T>, update: UpdateFilter<T>) {
    return this.collection.updateMany(this.withTenant(filter), update)
  }

  /**
   * Deleta um documento
   */
  async deleteOne(filter: Filter<T>) {
    return this.collection.deleteOne(this.withTenant(filter))
  }

  /**
   * Deleta por ID
   */
  async deleteById(id: string | ObjectId) {
    const objectId = typeof id === 'string' ? new ObjectId(id) : id
    return this.collection.deleteOne(this.withTenant({ _id: objectId } as Filter<T>))
  }

  /**
   * Deleta múltiplos documentos
   */
  async deleteMany(filter: Filter<T>) {
    return this.collection.deleteMany(this.withTenant(filter))
  }

  /**
   * Conta documentos
   */
  async countDocuments(filter: Filter<T> = {}): Promise<number> {
    return this.collection.countDocuments(this.withTenant(filter))
  }

  /**
   * Aggregation pipeline com match de tenant no início
   */
  aggregate<R extends Document = T>(pipeline: Document[]) {
    return this.collection.aggregate<R>([
      { $match: { tenantId: this.tenantId } },
      ...pipeline,
    ])
  }

  /**
   * Distinct com filtro de tenant
   */
  async distinct<K extends keyof T>(field: K, filter: Filter<T> = {}): Promise<T[K][]> {
    return this.collection.distinct(field as string, this.withTenant(filter)) as Promise<T[K][]>
  }

  /**
   * Retorna o tenantId usado
   */
  getTenantId(): ObjectId {
    return this.tenantId
  }

  /**
   * Retorna a collection original (use com cuidado!)
   */
  getCollection(): Collection<T> {
    return this.collection
  }
}

/**
 * Obtém uma collection com isolamento de tenant usando a sessão do usuário
 */
export async function getTenantCollection<T extends Document>(
  collectionName: string
): Promise<TenantAwareQuery<T> | null> {
  const session = await getServerSession(authOptions)

  if (!session?.user?.tenantId) {
    return null
  }

  const db = await getDatabase()
  const collection = db.collection<T>(collectionName)

  return new TenantAwareQuery(collection, session.user.tenantId)
}

/**
 * Obtém uma collection com isolamento de tenant usando um tenantId específico
 * (útil para APIs públicas que resolvem tenant pelo hostname)
 */
export async function getTenantCollectionById<T extends Document>(
  collectionName: string,
  tenantId: string | ObjectId
): Promise<TenantAwareQuery<T>> {
  const db = await getDatabase()
  const collection = db.collection<T>(collectionName)

  return new TenantAwareQuery(collection, tenantId)
}

/**
 * Obtém uma collection com isolamento de tenant resolvido pelo hostname da requisição
 * (útil para APIs que não requerem autenticação mas precisam de contexto de tenant)
 */
export async function getTenantCollectionFromRequest<T extends Document>(
  collectionName: string
): Promise<TenantAwareQuery<T> | null> {
  const { tenantId } = await resolveTenantFromRequest()

  if (!tenantId) {
    return null
  }

  const db = await getDatabase()
  const collection = db.collection<T>(collectionName)

  return new TenantAwareQuery(collection, tenantId)
}

/**
 * Helper para verificar se o usuário tem permissão para acessar um recurso de um tenant
 */
export async function canAccessTenant(targetTenantId: string): Promise<boolean> {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return false
  }

  // Super admin pode acessar qualquer tenant
  if (session.user.role === 'super_admin') {
    return true
  }

  // Usuário só pode acessar seu próprio tenant
  return session.user.tenantId === targetTenantId
}

/**
 * Helper para obter o tenantId do contexto atual (sessão ou request)
 */
export async function getCurrentTenantId(): Promise<string | null> {
  // Primeiro tenta pegar da sessão
  const session = await getServerSession(authOptions)
  if (session?.user?.tenantId) {
    return session.user.tenantId
  }

  // Se não tiver sessão, tenta resolver pelo hostname
  const { tenantId } = await resolveTenantFromRequest()
  return tenantId
}
