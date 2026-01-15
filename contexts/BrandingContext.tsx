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
  ogImage: string
  // Cores de texto inteligentes
  textOnDark: string      // Texto para fundos escuros (header, footer)
  textOnLight: string     // Texto para fundos claros (cards, seções)
  textMuted: string       // Texto secundário/placeholder
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
  ogImage: '',
  textOnDark: '#ffffff',
  textOnLight: '#101010',
  textMuted: '#6b7280',
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

  // Converter HEX para RGB
  const hexToRgb = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (!result) return '112, 244, 109'
    return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
  }

  // Escurecer cor HEX
  const darkenColor = (hex: string, percent: number): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (!result) return hex
    const r = Math.max(0, parseInt(result[1], 16) - Math.round(255 * percent / 100))
    const g = Math.max(0, parseInt(result[2], 16) - Math.round(255 * percent / 100))
    const b = Math.max(0, parseInt(result[3], 16) - Math.round(255 * percent / 100))
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
  }

  // Injetar CSS dinâmico para cores
  useEffect(() => {
    if (!isLoading) {
      const root = document.documentElement
      const { branding } = settings

      // Cor primária e variações
      const primaryDarken = darkenColor(branding.primaryColor, 10)
      const primaryLight = darkenColor(branding.primaryColor, 30)
      const primaryHover = darkenColor(branding.primaryColor, 20)
      const primaryRgb = hexToRgb(branding.primaryColor)

      root.style.setProperty('--bs-brand-2', branding.primaryColor)
      root.style.setProperty('--bs-brand-2-dark', branding.primaryColor)
      root.style.setProperty('--bs-brand-2-darken', primaryDarken)
      root.style.setProperty('--bs-brand-2-light', primaryLight)
      root.style.setProperty('--bs-button-bg', branding.primaryColor)
      root.style.setProperty('--bs-link-hover-color', primaryHover)
      root.style.setProperty('--bs-primary-rgb', primaryRgb)

      // Cor secundária
      root.style.setProperty('--bs-brand-1', branding.secondaryColor)

      // Accent - usar como cor de destaque
      root.style.setProperty('--bs-color-2', branding.accentColor)

      // Cores de feedback
      root.style.setProperty('--bs-success', branding.successColor)
      root.style.setProperty('--bs-warning', branding.warningColor)
      root.style.setProperty('--bs-danger', branding.dangerColor)

      // Cores de fundo e texto
      root.style.setProperty('--bs-background', branding.backgroundColor)
      root.style.setProperty('--bs-text', branding.textColor)
      root.style.setProperty('--bs-neutral-0', branding.backgroundColor)
      root.style.setProperty('--bs-neutral-1000', branding.textColor)

      // Cores de texto inteligentes
      root.style.setProperty('--bs-text-on-dark', branding.textOnDark || '#ffffff')
      root.style.setProperty('--bs-text-on-light', branding.textOnLight || branding.textColor)
      root.style.setProperty('--bs-text-muted', branding.textMuted || '#6b7280')
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
