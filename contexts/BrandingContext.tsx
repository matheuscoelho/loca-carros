'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface Branding {
  logoLight: string
  logoDark: string
  favicon: string
  siteName: string
  primaryColor: string
  secondaryColor: string
}

export interface PublicSettings {
  branding: Branding
  general: {
    siteName: string
    siteDescription: string
    contactEmail: string
    contactPhone: string
  }
}

const defaultBranding: Branding = {
  logoLight: '/assets/imgs/template/logo.svg',
  logoDark: '/assets/imgs/template/logo-white.svg',
  favicon: '/favicon.ico',
  siteName: 'Navegar Sistemas',
  primaryColor: '#70f46d',
  secondaryColor: '#8acfff',
}

const defaultSettings: PublicSettings = {
  branding: defaultBranding,
  general: {
    siteName: 'Navegar Sistemas',
    siteDescription: 'Serviço premium de aluguel de carros',
    contactEmail: 'contato@navegarsistemas.com.br',
    contactPhone: '+55 (11) 99999-9999',
  },
}

interface BrandingContextType {
  branding: Branding
  settings: PublicSettings
  isLoading: boolean
  refreshBranding: () => Promise<void>
}

const BrandingContext = createContext<BrandingContextType>({
  branding: defaultBranding,
  settings: defaultSettings,
  isLoading: true,
  refreshBranding: async () => {},
})

export function BrandingProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<PublicSettings>(defaultSettings)
  const [isLoading, setIsLoading] = useState(true)

  const fetchBranding = async () => {
    try {
      const response = await fetch('/api/settings/public')
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (error) {
      console.error('Erro ao carregar branding:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBranding()
  }, [])

  // Injetar CSS dinâmico para cores
  useEffect(() => {
    if (!isLoading) {
      const root = document.documentElement
      root.style.setProperty('--bs-brand-2', settings.branding.primaryColor)
      root.style.setProperty('--bs-brand-2-dark', settings.branding.primaryColor)
      root.style.setProperty('--bs-button-bg', settings.branding.primaryColor)
      root.style.setProperty('--bs-brand-1', settings.branding.secondaryColor)
    }
  }, [settings.branding.primaryColor, settings.branding.secondaryColor, isLoading])

  const refreshBranding = async () => {
    setIsLoading(true)
    await fetchBranding()
  }

  return (
    <BrandingContext.Provider
      value={{
        branding: settings.branding,
        settings,
        isLoading,
        refreshBranding,
      }}
    >
      {children}
    </BrandingContext.Provider>
  )
}

export function useBranding() {
  const context = useContext(BrandingContext)
  if (!context) {
    throw new Error('useBranding deve ser usado dentro de um BrandingProvider')
  }
  return context
}

export default BrandingContext
