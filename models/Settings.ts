import { ObjectId } from 'mongodb'

export interface ISettings {
  _id?: ObjectId
  branding: {
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
    textOnDark: string
    textOnLight: string
    textMuted: string
  }
  socialMedia: {
    instagram: string
    facebook: string
    twitter: string
    youtube: string
    linkedin: string
    whatsapp: string
  }
  general: {
    siteDescription: string
    siteTitle: string
    contactEmail: string
    contactPhone: string
    whatsappNumber: string
    address: string
    city: string
    state: string
    zipCode: string
    currency: string
    timezone: string
    showDemoBanner: boolean
  }
  pricing: {
    taxRate: number
    serviceFee: number
    cancellationFee: number
    depositPercentage: number
  }
  notifications: {
    emailNotifications: boolean
    bookingConfirmation: boolean
    paymentReceived: boolean
    reminderBeforePickup: boolean
    reminderHours: number
  }
  business: {
    minRentalDays: number
    maxRentalDays: number
    advanceBookingDays: number
    pickupStartTime: string
    pickupEndTime: string
  }
  createdAt: Date
  updatedAt: Date
  lastModifiedBy?: {
    id: string
    name: string
    email: string
  }
}

export const defaultSettings: Omit<ISettings, '_id'> = {
  branding: {
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
    // Cores de texto inteligentes
    textOnDark: '#ffffff',
    textOnLight: '#101010',
    textMuted: '#6b7280',
  },
  socialMedia: {
    instagram: '',
    facebook: '',
    twitter: '',
    youtube: '',
    linkedin: '',
    whatsapp: '',
  },
  general: {
    siteDescription: 'Serviço premium de aluguel de carros',
    siteTitle: 'Navegar Sistemas - Aluguel de Carros',
    contactEmail: 'contato@navegarsistemas.com.br',
    contactPhone: '+55 (11) 99999-9999',
    whatsappNumber: '+5511999999999',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    currency: 'BRL',
    timezone: 'America/Sao_Paulo',
    showDemoBanner: true,
  },
  pricing: {
    taxRate: 10,
    serviceFee: 5,
    cancellationFee: 15,
    depositPercentage: 20,
  },
  notifications: {
    emailNotifications: true,
    bookingConfirmation: true,
    paymentReceived: true,
    reminderBeforePickup: true,
    reminderHours: 24,
  },
  business: {
    minRentalDays: 1,
    maxRentalDays: 30,
    advanceBookingDays: 365,
    pickupStartTime: '08:00',
    pickupEndTime: '20:00',
  },
  createdAt: new Date(),
  updatedAt: new Date(),
}
