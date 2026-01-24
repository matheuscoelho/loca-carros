import { ObjectId } from 'mongodb'

// User Types
export interface IUser {
  _id?: ObjectId
  tenantId?: ObjectId // Multi-tenancy: ID do tenant (null para super_admin)
  email: string
  password: string
  name: string
  phone?: string
  avatar?: string
  role: 'cliente' | 'admin' | 'super_admin'
  emailVerified?: boolean
  address?: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  driverLicense?: {
    number: string
    expiryDate: Date
    verified: boolean
  }
  preferences?: {
    newsletter: boolean
    notifications: {
      email: boolean
      push: boolean
      sms: boolean
    }
    language: string
    currency: string
  }
  favorites: ObjectId[]
  status: 'active' | 'inactive' | 'suspended'
  createdAt: Date
  updatedAt: Date
  lastLogin?: Date
}

export type UserRole = 'cliente' | 'admin' | 'super_admin'
export type UserStatus = 'active' | 'inactive' | 'suspended'

// Car Types
export interface ICar {
  _id?: ObjectId
  tenantId: ObjectId // Multi-tenancy: ID do tenant
  name: string
  brand: string
  model: string
  year: number
  licensePlate: string
  vin?: string
  carType: CarType
  fuelType: FuelType
  transmission: 'Automatic' | 'Manual' | 'CVT'
  specs: {
    seats: number
    doors: number
    bags: number
    mileage: number
    engineSize?: string
    horsepower?: number
  }
  pricing: {
    dailyRate: number
    weeklyRate?: number
    monthlyRate?: number
    deposit: number
    currency: string
  }
  extras: {
    name: string
    price: number
    description?: string
  }[]
  amenities: string[]
  images: {
    url: string
    alt?: string
    isPrimary: boolean
  }[]
  location: {
    city: string
    state: string
    country: string
    address?: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  availability: {
    isAvailable: boolean
    unavailableDates: {
      start: Date
      end: Date
      reason: 'booking' | 'maintenance' | 'other'
    }[]
  }
  rating: number
  reviewCount: number
  totalBookings: number
  status: 'active' | 'inactive' | 'maintenance'
  createdBy?: ObjectId
  createdAt: Date
  updatedAt: Date
}

export type CarType = 'Sedans' | 'SUVs' | 'Hatchbacks' | 'Convertibles' | 'Coupes' | 'Compacts' | 'Trucks' | 'Vans'
export type FuelType = 'Gasoline/Petrol' | 'Diesel' | 'Electric Vehicle (EV)' | 'Hybrid (HEV)' | 'Plug-in Hybrid (PHEV)' | 'Hydrogen'

// Booking Types
export interface IBooking {
  _id?: ObjectId
  tenantId: ObjectId // Multi-tenancy: ID do tenant
  bookingNumber: string
  userId: ObjectId
  carId: ObjectId
  pickupDate: Date
  dropoffDate: Date
  totalDays: number
  pickupLocation: string
  dropoffLocation: string
  extras: {
    name: string
    price: number
    quantity: number
  }[]
  pricing: {
    dailyRate: number
    subtotal: number
    extrasTotal: number
    taxRate: number
    taxAmount: number
    discount: number
    discountCode?: string
    total: number
    currency: string
  }
  status: BookingStatus
  paymentId?: ObjectId
  paymentStatus: PaymentStatus
  driverInfo: {
    name: string
    email: string
    phone: string
    licenseNumber: string
  }
  customerNotes?: string
  internalNotes?: string
  cancellation?: {
    reason: string
    cancelledAt: Date
    cancelledBy: ObjectId
    refundAmount?: number
  }
  createdAt: Date
  updatedAt: Date
  confirmedAt?: Date
  completedAt?: Date
}

export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'refunded'
export type PaymentStatus = 'pending' | 'paid' | 'partially_paid' | 'refunded'

// Payment Types
export interface IPayment {
  _id?: ObjectId
  tenantId: ObjectId // Multi-tenancy: ID do tenant
  transactionId: string
  userId: ObjectId
  bookingId: ObjectId
  stripePaymentIntentId?: string
  stripeCustomerId?: string
  amount: number
  currency: string
  paymentMethod: {
    type: 'card' | 'pix' | 'boleto'
    last4?: string
    brand?: string
  }
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'refunded' | 'partially_refunded'
  refund?: {
    amount: number
    reason: string
    refundedAt: Date
    refundId: string
  }
  invoice: {
    number: string
    url?: string
    pdfUrl?: string
  }
  metadata?: Record<string, any>
  createdAt: Date
  updatedAt: Date
  paidAt?: Date
}

// Review Types
export interface IReview {
  _id?: ObjectId
  tenantId: ObjectId // Multi-tenancy: ID do tenant
  userId: ObjectId
  carId: ObjectId
  bookingId: ObjectId
  rating: number
  ratings: {
    price: number
    service: number
    safety: number
    comfort: number
    cleanliness: number
  }
  title?: string
  comment: string
  status: 'pending' | 'approved' | 'rejected'
  response?: {
    text: string
    respondedAt: Date
    respondedBy: ObjectId
  }
  createdAt: Date
  updatedAt: Date
}

// Notification Types
export interface INotification {
  _id?: ObjectId
  tenantId: ObjectId // Multi-tenancy: ID do tenant
  userId: ObjectId
  type: NotificationType
  title: string
  message: string
  data?: {
    bookingId?: ObjectId
    carId?: ObjectId
    paymentId?: ObjectId
    link?: string
  }
  read: boolean
  readAt?: Date
  createdAt: Date
  expiresAt?: Date
}

export type NotificationType =
  | 'booking_confirmed'
  | 'booking_cancelled'
  | 'payment_received'
  | 'payment_failed'
  | 'review_reminder'
  | 'rental_reminder'
  | 'promotion'
  | 'system'

// API Response Types
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// NextAuth Types Extension
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: UserRole
      image?: string
      tenantId: string | null // Multi-tenancy: null para super_admin
    }
  }

  interface User {
    id: string
    email: string
    name: string
    role: UserRole
    tenantId: string | null // Multi-tenancy: null para super_admin
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: UserRole
    tenantId: string | null // Multi-tenancy: null para super_admin
  }
}
