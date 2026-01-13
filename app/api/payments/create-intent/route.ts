export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { createPaymentIntent, getOrCreateCustomer } from '@/lib/services/stripe'
import { generateTransactionId, generateInvoiceNumber } from '@/models/Payment'

export async function POST(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions)

		if (!session?.user?.id) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const data = await request.json()
		const { bookingId } = data

		if (!bookingId || !ObjectId.isValid(bookingId)) {
			return NextResponse.json({ error: 'Invalid booking ID' }, { status: 400 })
		}

		const client = await clientPromise
		const db = client.db(process.env.MONGODB_DB)

		// Get booking
		const booking = await db.collection('bookings').findOne({
			_id: new ObjectId(bookingId),
			userId: new ObjectId(session.user.id),
		})

		if (!booking) {
			return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
		}

		if (booking.paymentStatus === 'paid') {
			return NextResponse.json({ error: 'Booking already paid' }, { status: 400 })
		}

		// Get or create Stripe customer
		const customer = await getOrCreateCustomer(
			session.user.email!,
			session.user.name || undefined,
			{ userId: session.user.id }
		)

		// Create payment intent
		const paymentIntent = await createPaymentIntent(
			booking.pricing.total,
			booking.pricing.currency || 'usd',
			{
				bookingId: bookingId,
				bookingNumber: booking.bookingNumber,
				userId: session.user.id,
				customerId: customer.id,
			}
		)

		// Create payment record
		const payment = {
			transactionId: generateTransactionId(),
			userId: new ObjectId(session.user.id),
			bookingId: new ObjectId(bookingId),
			stripePaymentIntentId: paymentIntent.id,
			stripeCustomerId: customer.id,
			amount: booking.pricing.total,
			currency: booking.pricing.currency || 'USD',
			paymentMethod: {
				type: 'card' as const,
			},
			status: 'pending' as const,
			invoice: {
				number: generateInvoiceNumber(),
			},
			createdAt: new Date(),
			updatedAt: new Date(),
		}

		const paymentResult = await db.collection('payments').insertOne(payment)

		// Update booking with payment ID
		await db.collection('bookings').updateOne(
			{ _id: new ObjectId(bookingId) },
			{
				$set: {
					paymentId: paymentResult.insertedId,
					updatedAt: new Date(),
				}
			}
		)

		return NextResponse.json({
			clientSecret: paymentIntent.client_secret,
			paymentIntentId: paymentIntent.id,
			amount: booking.pricing.total,
			currency: booking.pricing.currency,
		})
	} catch (error) {
		console.error('Error creating payment intent:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}
