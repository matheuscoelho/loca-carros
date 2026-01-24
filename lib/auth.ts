import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import clientPromise from './mongodb'
import { compare } from 'bcryptjs'
import { getDatabase } from './mongodb'
import { ObjectId } from 'mongodb'
import { ITenant } from '@/models/Tenant'

/**
 * Resolve o tenantId a partir do hostname
 */
async function resolveTenantIdFromHostname(hostname: string): Promise<string | null> {
  if (!hostname) return null

  const db = await getDatabase()
  const baseDomain = process.env.BASE_DOMAIN || 'localhost'
  const cleanHostname = hostname.split(':')[0].toLowerCase()

  // Extrair slug se for subdomínio
  let tenantSlug: string | null = null
  if (cleanHostname.endsWith(`.${baseDomain}`)) {
    tenantSlug = cleanHostname.replace(`.${baseDomain}`, '')
  }

  // Buscar tenant por domínio ou slug
  const tenant = await db.collection<ITenant>('tenants').findOne({
    $or: [
      { 'domains.primary': cleanHostname },
      { 'domains.custom': cleanHostname },
      ...(tenantSlug ? [{ slug: tenantSlug }] : []),
    ],
    status: 'active',
  })

  return tenant?._id?.toString() || null
}

/**
 * Verifica se o hostname é o domínio principal (para super_admin)
 */
function isMainDomain(hostname: string): boolean {
  const baseDomain = process.env.BASE_DOMAIN || 'localhost'
  const cleanHostname = hostname.split(':')[0].toLowerCase()

  return (
    cleanHostname === baseDomain ||
    cleanHostname === `www.${baseDomain}` ||
    cleanHostname === 'localhost' ||
    cleanHostname.startsWith('localhost')
  )
}

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise) as any,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        hostname: { label: 'Hostname', type: 'text' }, // Multi-tenancy: hostname para resolver tenant
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email e senha são obrigatórios')
        }

        const db = await getDatabase()
        const hostname = credentials.hostname || 'localhost'

        // SEGURANÇA: Login separado para super_admin
        const isSuperAdminLogin = hostname === 'root-wl-login'

        if (isSuperAdminLogin) {
          // Login exclusivo para super_admin - não aceita outros roles
          const superAdmin = await db.collection('users').findOne({
            email: credentials.email.toLowerCase(),
            role: 'super_admin',
            status: 'active',
          })

          if (!superAdmin) {
            throw new Error('Acesso não autorizado')
          }

          const isPasswordValid = await compare(credentials.password, superAdmin.password)
          if (!isPasswordValid) {
            throw new Error('Credenciais inválidas')
          }

          // Atualizar último login
          await db.collection('users').updateOne(
            { _id: superAdmin._id },
            { $set: { lastLogin: new Date() } }
          )

          return {
            id: superAdmin._id.toString(),
            email: superAdmin.email,
            name: superAdmin.name,
            role: superAdmin.role,
            image: superAdmin.avatar || null,
            tenantId: null, // Super admin não tem tenant
          }
        }

        // Login normal - resolver tenant e NÃO aceitar super_admin
        const tenantId = await resolveTenantIdFromHostname(hostname)
        const isMain = isMainDomain(hostname)

        // Construir query de busca
        let query: Record<string, unknown> = {
          email: credentials.email.toLowerCase(),
          role: { $ne: 'super_admin' }, // SEGURANÇA: Nunca permitir super_admin no login normal
        }

        if (tenantId) {
          // Se tem tenant, buscar usuário desse tenant
          query.tenantId = new ObjectId(tenantId)
        } else if (isMain) {
          // Se é domínio principal sem tenant específico
          // Buscar usuário admin/cliente sem exigir tenant (para compatibilidade)
          query = {
            email: credentials.email.toLowerCase(),
            role: { $in: ['admin', 'cliente'] }, // Apenas admin e cliente
          }
        } else {
          // Domínio customizado sem tenant encontrado
          throw new Error('Domínio não configurado')
        }

        const user = await db.collection('users').findOne(query)

        if (!user) {
          throw new Error('Email ou senha incorretos')
        }

        if (user.status !== 'active') {
          throw new Error('Conta desativada. Entre em contato com o suporte.')
        }

        const isPasswordValid = await compare(credentials.password, user.password)

        if (!isPasswordValid) {
          throw new Error('Email ou senha incorretos')
        }

        // Atualizar último login
        await db.collection('users').updateOne(
          { _id: user._id },
          { $set: { lastLogin: new Date() } }
        )

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.avatar || null,
          tenantId: user.tenantId?.toString() || null, // Multi-tenancy
        }
      }
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.tenantId = user.tenantId || null // Multi-tenancy
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as 'cliente' | 'admin' | 'super_admin'
        session.user.tenantId = token.tenantId as string | null // Multi-tenancy
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
}
