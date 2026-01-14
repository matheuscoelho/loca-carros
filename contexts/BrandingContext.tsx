'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface Branding {
  logoLight: string
  logoDark: string
  logoWidth: number
  logoHeight: number
  favicon: string
  siteName: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  successColor: string
  warningColor: string
  dangerColor: string
  backgroundColor: string
  textColor: string
}

export interface SocialMedia {
  instagram: string
  facebook: string
  twitter: string
  youtube: string
  linkedin: string
  whatsapp: string
}

export interface GeneralSettings {
  siteName: string
  siteTitle: string
  siteDescription: string
  contactEmail: string
  contactPhone: string
  whatsappNumber: string
  address: string
  city: string
  state: string
  zipCode: string
}

export interface PublicSettings {
  branding: Branding
  socialMedia: SocialMedia
  general: GeneralSettings
}

const defaultBranding: Branding = {
  logoLight: '/assets/imgs/template/logo.svg',
  logoDark: '/assets/imgs/template/logo-white.svg',
  logoWidth: 150,
  logoHeight: 40,
  favicon: '/favicon.ico',
  siteName: 'Navegar Sistemas',
  primaryColor: '#70f46d',
  secondaryColor: '#8acfff',
  accentColor: '#ffc700',
  successColor: '#34d674',
  warningColor: '#ffc107',
  dangerColor: '#ff2e00',
  backgroundColor: '#ffffff',
  textColor: '#101010',
}

const defaultSocialMedia: SocialMedia = {
  instagram: '',
  facebook: '',
  twitter: '',
  youtube: '',
  linkedin: '',
  whatsapp: '',
}

const defaultGeneral: GeneralSettings = {
  siteName: 'Navegar Sistemas',
  siteTitle: 'Navegar Sistemas - Aluguel de Carros',
  siteDescription: 'Serviço premium de aluguel de carros',
  contactEmail: 'contato@navegarsistemas.com.br',
  contactPhone: '+55 (11) 99999-9999',
  whatsappNumber: '+5511999999999',
  address: '',
  city: '',
  state: '',
  zipCode: '',
}

const defaultSettings: PublicSettings = {
  branding: defaultBranding,
  socialMedia: defaultSocialMedia,
  general: defaultGeneral,
}

interface BrandingContextType {
  branding: Branding
  socialMedia: SocialMedia
  general: GeneralSettings
  settings: PublicSettings
  isLoading: boolean
  refreshBranding: () => Promise<void>
}

const BrandingContext = createContext<BrandingContextType>({
  branding: defaultBranding,
  socialMedia: defaultSocialMedia,
  general: defaultGeneral,
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
      const { branding } = settings

      // Cores principais
      root.style.setProperty('--bs-brand-2', branding.primaryColor)
      root.style.setProperty('--bs-brand-2-dark', branding.primaryColor)
      root.style.setProperty('--bs-button-bg', branding.primaryColor)
      root.style.setProperty('--bs-brand-1', branding.secondaryColor)
      root.style.setProperty('--bs-accent', branding.accentColor)

      // Cores de feedback
      root.style.setProperty('--bs-success', branding.successColor)
      root.style.setProperty('--bs-warning', branding.warningColor)
      root.style.setProperty('--bs-danger', branding.dangerColor)

      // Cores de fundo e texto
      root.style.setProperty('--bs-background', branding.backgroundColor)
      root.style.setProperty('--bs-text', branding.textColor)
    }
  }, [settings.branding, isLoading])

  const refreshBranding = async () => {
    setIsLoading(true)
    await fetchBranding()
  }

  return (
    <BrandingContext.Provider
      value={{
        branding: settings.branding,
        socialMedia: settings.socialMedia || defaultSocialMedia,
        general: settings.general || defaultGeneral,
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
