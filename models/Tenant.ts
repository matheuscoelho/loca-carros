import { ObjectId } from 'mongodb'

export type TenantStatus = 'active' | 'inactive' | 'suspended'
export type TenantPlan = 'free' | 'starter' | 'professional' | 'enterprise'
export type SubscriptionStatus = 'active' | 'past_due' | 'cancelled'

export interface ITenant {
  _id?: ObjectId

  // Identificação
  name: string
  slug: string // usado para subdomínio: slug.seudominio.com

  // Domínios permitidos
  domains: {
    primary: string // domínio principal gerado (ex: slug.seudominio.com)
    custom: string[] // domínios customizados (ex: www.minhalocadora.com.br)
  }

  // Proprietário/Admin principal
  owner: {
    userId: ObjectId
    name: string
    email: string
    phone?: string
  }

  // Assinatura e plano
  subscription: {
    plan: TenantPlan
    status: SubscriptionStatus
    currentPeriodStart: Date
    currentPeriodEnd: Date
    stripeCustomerId?: string
    stripeSubscriptionId?: string
  }

  // Limites do plano
  limits: {
    maxUsers: number
    maxCars: number
    maxBookingsPerMonth: number
    maxStorageGB: number
  }

  // Configurações do tenant
  settings: {
    timezone: string
    currency: string
    language: string
    dateFormat: string
  }

  // Status e metadados
  status: TenantStatus
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}

// Limites padrão por plano
export const planLimits: Record<TenantPlan, ITenant['limits']> = {
  free: {
    maxUsers: 5,
    maxCars: 10,
    maxBookingsPerMonth: 50,
    maxStorageGB: 1,
  },
  starter: {
    maxUsers: 15,
    maxCars: 50,
    maxBookingsPerMonth: 200,
    maxStorageGB: 5,
  },
  professional: {
    maxUsers: 50,
    maxCars: 200,
    maxBookingsPerMonth: 1000,
    maxStorageGB: 20,
  },
  enterprise: {
    maxUsers: -1, // ilimitado
    maxCars: -1,
    maxBookingsPerMonth: -1,
    maxStorageGB: 100,
  },
}

// Função para criar tenant com valores padrão
export function createTenantDefaults(data: Partial<ITenant>): ITenant {
  const plan = data.subscription?.plan || 'free'
  const now = new Date()
  const oneMonthLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

  return {
    name: data.name || '',
    slug: data.slug || '',
    domains: data.domains || {
      primary: '',
      custom: [],
    },
    owner: data.owner || {
      userId: new ObjectId(),
      name: '',
      email: '',
    },
    subscription: data.subscription || {
      plan: 'free',
      status: 'active',
      currentPeriodStart: now,
      currentPeriodEnd: oneMonthLater,
    },
    limits: data.limits || planLimits[plan],
    settings: data.settings || {
      timezone: 'America/Sao_Paulo',
      currency: 'BRL',
      language: 'pt-BR',
      dateFormat: 'DD/MM/YYYY',
    },
    status: data.status || 'active',
    createdAt: data.createdAt || now,
    updatedAt: data.updatedAt || now,
  }
}

// Função para gerar slug a partir do nome
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/[^a-z0-9]+/g, '-') // substitui caracteres especiais por hífen
    .replace(/^-|-$/g, '') // remove hífens no início e fim
}

// Função para validar slug
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(slug) && slug.length >= 3 && slug.length <= 50
}

// Função para verificar se o plano permite mais recursos
export function canAddMore(tenant: ITenant, resource: 'users' | 'cars', currentCount: number): boolean {
  const limitKey = resource === 'users' ? 'maxUsers' : 'maxCars'
  const limit = tenant.limits[limitKey]

  // -1 significa ilimitado
  if (limit === -1) return true

  return currentCount < limit
}
