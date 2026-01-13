import Stripe from 'stripe'

// Lazy initialization do Stripe para permitir build sem env vars
let _stripe: Stripe | null = null

function getStripe(): Stripe {
	if (!_stripe) {
		const secretKey = process.env.STRIPE_SECRET_KEY
		if (!secretKey) {
			throw new Error('STRIPE_SECRET_KEY não definida nas variáveis de ambiente')
		}
		_stripe = new Stripe(secretKey, {
			typescript: true,
		})
	}
	return _stripe
}

// Proxy para acesso lazy ao stripe
export const stripe = new Proxy({} as Stripe, {
	get(_, prop) {
		return getStripe()[prop as keyof Stripe]
	}
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
