export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import clientPromise from '@/lib/mongodb'
import { constructWebhookEvent } from '@/lib/services/stripe'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
	try {
		const body = await request.text()
		const headersList = headers()
		const signature = headersList.get('stripe-signature')

		if (!signature) {
			return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
		}

		const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

		if (!webhookSecret) {
			console.error('Missing STRIPE_WEBHOOK_SECRET')
			return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
		}

		let event: Stripe.Event

		try {
			event = constructWebhookEvent(
				Buffer.from(body),
				signature,
				webhookSecret
			)
		} catch (err) {
			console.error('Webhook signature verification failed:', err)
			return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
		}

		const client = await clientPromise
		const db = client.db(process.env.MONGODB_DB)

		// Handle different event types
		switch (event.type) {
			case 'payment_intent.succeeded': {
				const paymentIntent = event.data.object as Stripe.PaymentIntent

				// Update payment record
				await db.collection('payments').updateOne(
					{ stripePaymentIntentId: paymentIntent.id },
					{
						$set: {
							status: 'succeeded',
							paymentMethod: {
								type: 'card',
								last4: paymentIntent.payment_method_types?.[0] || '',
								brand: '',
							},
							completedAt: new Date(),
							updatedAt: new Date(),
						}
					}
				)

				// Update booking status
				const bookingId = paymentIntent.metadata.bookingId
				if (bookingId) {
					await db.collection('bookings').updateOne(
						{ _id: new (await import('mongodb')).ObjectId(bookingId) },
						{
							$set: {
								status: 'confirmed',
								paymentStatus: 'paid',
								updatedAt: new Date(),
							}
						}
					)

					// Create notification for user
					const booking = await db.collection('bookings').findOne({
						_id: new (await import('mongodb')).ObjectId(bookingId)
					})

					if (booking) {
						await db.collection('notifications').insertOne({
							userId: booking.userId,
							type: 'payment_received',
							title: 'Payment Received',
							message: `Your payment for booking ${booking.bookingNumber} has been confirmed.`,
							data: {
								bookingId: booking._id,
								link: `/dashboard/my-rentals`,
							},
							read: false,
							createdAt: new Date(),
						})
					}
				}

				break
			}

			case 'payment_intent.payment_failed': {
				const paymentIntent = event.data.object as Stripe.PaymentIntent

				// Update payment record
				await db.collection('payments').updateOne(
					{ stripePaymentIntentId: paymentIntent.id },
					{
						$set: {
							status: 'failed',
							updatedAt: new Date(),
						}
					}
				)

				// Update booking status
				const bookingId = paymentIntent.metadata.bookingId
				if (bookingId) {
					await db.collection('bookings').updateOne(
						{ _id: new (await import('mongodb')).ObjectId(bookingId) },
						{
							$set: {
								paymentStatus: 'failed',
								updatedAt: new Date(),
							}
						}
					)

					// Create notification for user
					const booking = await db.collection('bookings').findOne({
						_id: new (await import('mongodb')).ObjectId(bookingId)
					})

					if (booking) {
						await db.collection('notifications').insertOne({
							userId: booking.userId,
							type: 'payment_failed',
							title: 'Payment Failed',
							message: `Your payment for booking ${booking.bookingNumber} could not be processed.`,
							data: {
								bookingId: booking._id,
								link: `/booking/checkout?bookingId=${bookingId}`,
							},
							read: false,
							createdAt: new Date(),
						})
					}
				}

				break
			}

			case 'charge.refunded': {
				const charge = event.data.object as Stripe.Charge
				const paymentIntentId = charge.payment_intent as string

				// Update payment record
				await db.collection('payments').updateOne(
					{ stripePaymentIntentId: paymentIntentId },
					{
						$set: {
							status: 'refunded',
							refund: {
								amount: charge.amount_refunded / 100,
								reason: 'Refund processed',
								refundedAt: new Date(),
							},
							updatedAt: new Date(),
						}
					}
				)

				break
			}

			default:
				console.log(`Unhandled event type: ${event.type}`)
		}

		return NextResponse.json({ received: true })
	} catch (error) {
		console.error('Webhook error:', error)
		return NextResponse.json({ error: 'Webhook error' }, { status: 500 })
	}
}

// Note: In Next.js App Router, body parsing is handled automatically
// when using request.text() - no special config needed
