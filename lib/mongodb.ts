import { MongoClient, Db } from 'mongodb'

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

// Função para obter a conexão de forma lazy
function getClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI

  if (!uri) {
    throw new Error('MONGODB_URI não definida nas variáveis de ambiente')
  }

  const options = {}

  if (process.env.NODE_ENV === 'development') {
    // Em desenvolvimento, usa variável global para preservar conexão entre HMR
    if (!global._mongoClientPromise) {
      const client = new MongoClient(uri, options)
      global._mongoClientPromise = client.connect()
    }
    return global._mongoClientPromise
  } else {
    // Em produção, cria nova conexão
    const client = new MongoClient(uri, options)
    return client.connect()
  }
}

// Exporta uma Promise-like que só inicializa quando .then() é chamado
const clientPromise = {
  then<TResult1 = MongoClient, TResult2 = never>(
    onfulfilled?: ((value: MongoClient) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return getClientPromise().then(onfulfilled, onrejected)
  },
  catch<TResult = never>(
    onrejected?: ((reason: unknown) => TResult | PromiseLike<TResult>) | null
  ): Promise<MongoClient | TResult> {
    return getClientPromise().catch(onrejected)
  },
  finally(onfinally?: (() => void) | null): Promise<MongoClient> {
    return getClientPromise().finally(onfinally)
  },
  [Symbol.toStringTag]: 'Promise' as const,
} as Promise<MongoClient>

export default clientPromise

export async function getDatabase(dbName?: string): Promise<Db> {
  const client = await clientPromise
  return client.db(dbName || process.env.MONGODB_DB || 'test')
}
