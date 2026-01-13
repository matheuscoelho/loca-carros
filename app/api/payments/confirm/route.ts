import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function POST(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions)
		if (!session?.user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const { bookingId, paymentIntentId } = await request.json()

		if (!bookingId || !paymentIntentId) {
			return NextResponse.json(
				{ error: 'bookingId and paymentIntentId are required' },
				{ status: 400 }
			)
		}

		const client = await clientPromise
		const db = client.db(process.env.MONGODB_DB)

		// Atualiza o status da reserva para confirmado
		const bookingResult = await db.collection('bookings').updateOne(
			{ _id: new ObjectId(bookingId) },
			{
				$set: {
					status: 'confirmed',
					paymentStatus: 'paid',
					updatedAt: new Date()
				}
			}
		)

		// Atualiza o pagamento
		await db.collection('payments').updateOne(
			{ bookingId: new ObjectId(bookingId) },
			{
				$set: {
					status: 'paid',
					stripePaymentIntentId: paymentIntentId,
					paidAt: new Date(),
					updatedAt: new Date()
				}
			}
		)

		return NextResponse.json({
			success: true,
			message: 'Payment confirmed successfully'
		})

	} catch (error: any) {
		console.error('Error confirming payment:', error)
		return NextResponse.json(
			{ error: error.message || 'Failed to confirm payment' },
			{ status: 500 }
		)
	}
}
