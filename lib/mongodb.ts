import { MongoClient, Db } from 'mongodb'

// Não verificamos MONGODB_URI no top-level para permitir build sem env vars
const uri = process.env.MONGODB_URI || ''
const options = {}

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

let clientPromise: Promise<MongoClient>

// Só cria a conexão se tiver URI configurada (permite build sem env vars)
if (uri) {
  if (process.env.NODE_ENV === 'development') {
    // Em desenvolvimento, usa variável global para preservar conexão entre HMR
    if (!global._mongoClientPromise) {
      const client = new MongoClient(uri, options)
      global._mongoClientPromise = client.connect()
    }
    clientPromise = global._mongoClientPromise
  } else {
    // Em produção, cria nova conexão
    const client = new MongoClient(uri, options)
    clientPromise = client.connect()
  }
} else {
  // Durante o build, cria uma Promise que será rejeitada em runtime se chamada
  clientPromise = new Promise((_, reject) => {
    // Esta promise só será avaliada em runtime, não durante o build
    setImmediate(() => {
      reject(new Error('MONGODB_URI não definida nas variáveis de ambiente'))
    })
  })
}

export default clientPromise

export async function getDatabase(dbName?: string): Promise<Db> {
  if (!uri) {
    throw new Error('MONGODB_URI não definida nas variáveis de ambiente')
  }
  const client = await clientPromise
  return client.db(dbName || process.env.MONGODB_DB || 'test')
}
