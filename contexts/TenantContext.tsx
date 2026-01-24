'use client'

import { createContext, useContext, ReactNode } from 'react'

// Interface simplificada do tenant para o client
export interface TenantInfo {
  id: string
  name: string
  slug: string
  domains: {
    primary: string
    custom: string[]
  }
  subscription: {
    plan: 'free' | 'starter' | 'professional' | 'enterprise'
    status: 'active' | 'past_due' | 'cancelled'
  }
  settings: {
    timezone: string
    currency: string
    language: string
  }
}

interface TenantContextType {
  tenant: TenantInfo | null
  tenantId: string | null
  isLoading: boolean
  isTenantResolved: boolean
}

const TenantContext = createContext<TenantContextType>({
  tenant: null,
  tenantId: null,
  isLoading: true,
  isTenantResolved: false,
})

interface TenantProviderProps {
  children: ReactNode
  tenant?: TenantInfo | null
  tenantId?: string | null
}

/**
 * Provider para informações do tenant.
 * Recebe os dados do servidor (resolvidos pelo middleware ou layout).
 */
export function TenantProvider({ children, tenant = null, tenantId = null }: TenantProviderProps) {
  return (
    <TenantContext.Provider
      value={{
        tenant,
        tenantId: tenantId || tenant?.id || null,
        isLoading: false,
        isTenantResolved: tenant !== null,
      }}
    >
      {children}
    </TenantContext.Provider>
  )
}

/**
 * Hook para acessar informações do tenant atual
 */
export function useTenant() {
  const context = useContext(TenantContext)
  if (!context) {
    throw new Error('useTenant deve ser usado dentro de TenantProvider')
  }
  return context
}

/**
 * Hook para verificar se o tenant está disponível
 */
export function useTenantRequired() {
  const { tenant, tenantId, isLoading, isTenantResolved } = useTenant()

  if (isLoading) {
    return { loading: true as const, tenant: null, tenantId: null }
  }

  if (!isTenantResolved || !tenant || !tenantId) {
    return { loading: false as const, tenant: null, tenantId: null, error: 'Tenant não encontrado' }
  }

  return { loading: false as const, tenant, tenantId, error: null }
}

/**
 * Helper para verificar se o plano do tenant permite uma funcionalidade
 */
export function useTenantPlan() {
  const { tenant } = useTenant()
  const plan = tenant?.subscription?.plan || 'free'

  return {
    plan,
    isFree: plan === 'free',
    isStarter: plan === 'starter',
    isProfessional: plan === 'professional',
    isEnterprise: plan === 'enterprise',
    isPaid: plan !== 'free',
    // Helpers para verificar acesso a funcionalidades
    hasFeature: (minPlan: 'free' | 'starter' | 'professional' | 'enterprise') => {
      const planOrder = ['free', 'starter', 'professional', 'enterprise']
      return planOrder.indexOf(plan) >= planOrder.indexOf(minPlan)
    },
  }
}

export default TenantContext
