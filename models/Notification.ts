import { ObjectId } from 'mongodb'

export type NotificationType =
	| 'booking_confirmed'
	| 'booking_cancelled'
	| 'booking_reminder'
	| 'payment_received'
	| 'payment_failed'
	| 'review_request'
	| 'promo_offer'
	| 'system_alert'
	| 'welcome'

export interface INotification {
	_id?: ObjectId
	userId: ObjectId
	type: NotificationType
	title: string
	message: string
	data?: {
		bookingId?: ObjectId
		carId?: ObjectId
		paymentId?: ObjectId
		link?: string
		actionText?: string
	}
	read: boolean
	readAt?: Date
	createdAt: Date
	expiresAt?: Date
}

export const createNotificationDefaults = (data: Partial<INotification>): INotification => ({
	userId: data.userId || new ObjectId(),
	type: data.type || 'system_alert',
	title: data.title || '',
	message: data.message || '',
	data: data.data,
	read: data.read || false,
	readAt: data.readAt,
	createdAt: data.createdAt || new Date(),
	expiresAt: data.expiresAt,
})

// Notification templates
export const notificationTemplates: Record<NotificationType, { title: string; message: string }> = {
	booking_confirmed: {
		title: 'Booking Confirmed',
		message: 'Your booking has been confirmed. Check the details in your dashboard.',
	},
	booking_cancelled: {
		title: 'Booking Cancelled',
		message: 'Your booking has been cancelled. If you have any questions, please contact support.',
	},
	booking_reminder: {
		title: 'Upcoming Rental',
		message: 'Your rental is coming up soon. Don\'t forget to pick up your vehicle.',
	},
	payment_received: {
		title: 'Payment Received',
		message: 'We received your payment. Thank you for your booking!',
	},
	payment_failed: {
		title: 'Payment Failed',
		message: 'Your payment could not be processed. Please try again or use a different payment method.',
	},
	review_request: {
		title: 'Share Your Experience',
		message: 'How was your rental? Leave a review to help other customers.',
	},
	promo_offer: {
		title: 'Special Offer',
		message: 'Check out our latest deals and discounts!',
	},
	system_alert: {
		title: 'System Notification',
		message: 'Important system notification.',
	},
	welcome: {
		title: 'Welcome to Carento!',
		message: 'Thank you for joining us. Start exploring our vehicle collection.',
	},
}
