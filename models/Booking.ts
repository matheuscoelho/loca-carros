import { ObjectId } from 'mongodb'

export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'failed'

export interface IBooking {
	_id?: ObjectId
	bookingNumber: string
	userId: ObjectId
	carId: ObjectId
	pickupDate: Date
	dropoffDate: Date
	totalDays: number
	pickupLocation: string
	dropoffLocation: string
	extras: Array<{
		name: string
		price: number
		quantity: number
	}>
	pricing: {
		dailyRate: number
		subtotal: number
		extrasTotal: number
		tax: number
		discount: number
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
		licenseNumber?: string
	}
	cancellation?: {
		reason: string
		cancelledAt: Date
		refundAmount: number
	}
	notes?: string
	createdAt: Date
	updatedAt: Date
}

// Generate unique booking number
export const generateBookingNumber = (): string => {
	const prefix = 'CAR'
	const timestamp = Date.now().toString(36).toUpperCase()
	const random = Math.random().toString(36).substring(2, 6).toUpperCase()
	return `${prefix}-${timestamp}-${random}`
}

// Calculate total days between two dates
export const calculateTotalDays = (pickupDate: Date, dropoffDate: Date): number => {
	const diffTime = Math.abs(dropoffDate.getTime() - pickupDate.getTime())
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
	return Math.max(1, diffDays)
}

// Calculate booking price
export const calculateBookingPrice = (
	dailyRate: number,
	totalDays: number,
	extras: Array<{ price: number; quantity: number }>,
	taxRate: number = 0.1,
	discount: number = 0
): { subtotal: number; extrasTotal: number; tax: number; total: number } => {
	const subtotal = dailyRate * totalDays
	const extrasTotal = extras.reduce((sum, extra) => sum + (extra.price * extra.quantity), 0)
	const taxableAmount = subtotal + extrasTotal - discount
	const tax = taxableAmount * taxRate
	const total = taxableAmount + tax

	return {
		subtotal: Math.round(subtotal * 100) / 100,
		extrasTotal: Math.round(extrasTotal * 100) / 100,
		tax: Math.round(tax * 100) / 100,
		total: Math.round(total * 100) / 100,
	}
}

export const createBookingDefaults = (data: Partial<IBooking>): IBooking => ({
	bookingNumber: data.bookingNumber || generateBookingNumber(),
	userId: data.userId || new ObjectId(),
	carId: data.carId || new ObjectId(),
	pickupDate: data.pickupDate || new Date(),
	dropoffDate: data.dropoffDate || new Date(),
	totalDays: data.totalDays || 1,
	pickupLocation: data.pickupLocation || '',
	dropoffLocation: data.dropoffLocation || '',
	extras: data.extras || [],
	pricing: data.pricing || {
		dailyRate: 0,
		subtotal: 0,
		extrasTotal: 0,
		tax: 0,
		discount: 0,
		total: 0,
		currency: 'USD',
	},
	status: data.status || 'pending',
	paymentId: data.paymentId,
	paymentStatus: data.paymentStatus || 'pending',
	driverInfo: data.driverInfo || {
		name: '',
		email: '',
		phone: '',
	},
	cancellation: data.cancellation,
	notes: data.notes,
	createdAt: data.createdAt || new Date(),
	updatedAt: data.updatedAt || new Date(),
})
