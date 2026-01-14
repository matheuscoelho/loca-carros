import { ObjectId } from 'mongodb'

export interface ISettings {
  _id?: ObjectId
  branding: {
    logoLight: string
    logoDark: string
    favicon: string
    siteName: string
    primaryColor: string
    secondaryColor: string
  }
  general: {
    siteDescription: string
    contactEmail: string
    contactPhone: string
    currency: string
    timezone: string
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
}

export const defaultSettings: Omit<ISettings, '_id'> = {
  branding: {
    logoLight: '/assets/imgs/template/logo.svg',
    logoDark: '/assets/imgs/template/logo-white.svg',
    favicon: '/favicon.ico',
    siteName: 'Navegar Sistemas',
    primaryColor: '#70f46d',
    secondaryColor: '#8acfff',
  },
  general: {
    siteDescription: 'Serviço premium de aluguel de carros',
    contactEmail: 'contato@navegarsistemas.com.br',
    contactPhone: '+55 (11) 99999-9999',
    currency: 'BRL',
    timezone: 'America/Sao_Paulo',
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
