import { ObjectId } from 'mongodb'

export type PaymentMethodType = 'card' | 'bank_transfer' | 'pix' | 'boleto'
export type PaymentStatusType = 'pending' | 'processing' | 'succeeded' | 'failed' | 'refunded' | 'cancelled'

export interface IPayment {
	_id?: ObjectId
	transactionId: string
	userId: ObjectId
	bookingId: ObjectId
	stripePaymentIntentId?: string
	stripeCustomerId?: string
	amount: number
	currency: string
	paymentMethod: {
		type: PaymentMethodType
		last4?: string
		brand?: string
	}
	status: PaymentStatusType
	invoice?: {
		number: string
		url?: string
		pdfUrl?: string
	}
	refund?: {
		amount: number
		reason: string
		refundedAt: Date
		stripeRefundId?: string
	}
	metadata?: Record<string, any>
	createdAt: Date
	updatedAt: Date
	completedAt?: Date
}

// Generate unique transaction ID
export const generateTransactionId = (): string => {
	const prefix = 'TXN'
	const timestamp = Date.now().toString(36).toUpperCase()
	const random = Math.random().toString(36).substring(2, 8).toUpperCase()
	return `${prefix}-${timestamp}-${random}`
}

// Generate invoice number
export const generateInvoiceNumber = (): string => {
	const year = new Date().getFullYear()
	const month = String(new Date().getMonth() + 1).padStart(2, '0')
	const random = Math.random().toString(36).substring(2, 8).toUpperCase()
	return `INV-${year}${month}-${random}`
}

export const createPaymentDefaults = (data: Partial<IPayment>): IPayment => ({
	transactionId: data.transactionId || generateTransactionId(),
	userId: data.userId || new ObjectId(),
	bookingId: data.bookingId || new ObjectId(),
	stripePaymentIntentId: data.stripePaymentIntentId,
	stripeCustomerId: data.stripeCustomerId,
	amount: data.amount || 0,
	currency: data.currency || 'USD',
	paymentMethod: data.paymentMethod || {
		type: 'card',
	},
	status: data.status || 'pending',
	invoice: data.invoice,
	refund: data.refund,
	metadata: data.metadata,
	createdAt: data.createdAt || new Date(),
	updatedAt: data.updatedAt || new Date(),
	completedAt: data.completedAt,
})
