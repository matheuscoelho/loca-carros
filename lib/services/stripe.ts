import Stripe from 'stripe'

// Server-side Stripe instance
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: '2025-12-15.clover',
	typescript: true,
})

// Create a payment intent
export async function createPaymentIntent(
	amount: number,
	currency: string = 'usd',
	metadata: Record<string, string> = {}
): Promise<Stripe.PaymentIntent> {
	const paymentIntent = await stripe.paymentIntents.create({
		amount: Math.round(amount * 100), // Convert to cents
		currency: currency.toLowerCase(),
		metadata,
		automatic_payment_methods: {
			enabled: true,
		},
	})

	return paymentIntent
}

// Retrieve a payment intent
export async function getPaymentIntent(
	paymentIntentId: string
): Promise<Stripe.PaymentIntent> {
	return await stripe.paymentIntents.retrieve(paymentIntentId)
}

// Create a refund
export async function createRefund(
	paymentIntentId: string,
	amount?: number,
	reason?: string
): Promise<Stripe.Refund> {
	const refundData: Stripe.RefundCreateParams = {
		payment_intent: paymentIntentId,
	}

	if (amount) {
		refundData.amount = Math.round(amount * 100) // Convert to cents
	}

	if (reason) {
		refundData.reason = reason as Stripe.RefundCreateParams.Reason
	}

	return await stripe.refunds.create(refundData)
}

// Create or get customer
export async function getOrCreateCustomer(
	email: string,
	name?: string,
	metadata: Record<string, string> = {}
): Promise<Stripe.Customer> {
	// Check if customer exists
	const existingCustomers = await stripe.customers.list({
		email,
		limit: 1,
	})

	if (existingCustomers.data.length > 0) {
		return existingCustomers.data[0]
	}

	// Create new customer
	return await stripe.customers.create({
		email,
		name,
		metadata,
	})
}

// Verify webhook signature
export function constructWebhookEvent(
	payload: Buffer,
	signature: string,
	webhookSecret: string
): Stripe.Event {
	return stripe.webhooks.constructEvent(payload, signature, webhookSecret)
}
