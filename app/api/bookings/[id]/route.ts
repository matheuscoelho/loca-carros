export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const session = await getServerSession(authOptions)

		if (!session?.user?.id) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const { id } = params

		if (!ObjectId.isValid(id)) {
			return NextResponse.json({ error: 'Invalid booking ID' }, { status: 400 })
		}

		const client = await clientPromise
		const db = client.db(process.env.MONGODB_DB)

		const booking = await db.collection('bookings')
			.aggregate([
				{
					$match: {
						_id: new ObjectId(id),
						...(session.user.role !== 'admin' ? { userId: new ObjectId(session.user.id) } : {}),
					}
				},
				{
					$lookup: {
						from: 'cars',
						localField: 'carId',
						foreignField: '_id',
						as: 'car',
					}
				},
				{ $unwind: { path: '$car', preserveNullAndEmptyArrays: true } },
				{
					$lookup: {
						from: 'payments',
						localField: 'paymentId',
						foreignField: '_id',
						as: 'payment',
					}
				},
				{ $unwind: { path: '$payment', preserveNullAndEmptyArrays: true } },
			])
			.toArray()

		if (booking.length === 0) {
			return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
		}

		return NextResponse.json({ booking: booking[0] })
	} catch (error) {
		console.error('Error fetching booking:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}

export async function PUT(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const session = await getServerSession(authOptions)

		if (!session?.user?.id) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const { id } = params
		const data = await request.json()

		if (!ObjectId.isValid(id)) {
			return NextResponse.json({ error: 'Invalid booking ID' }, { status: 400 })
		}

		const client = await clientPromise
		const db = client.db(process.env.MONGODB_DB)

		// Only allow certain updates based on role
		const allowedUpdates: Record<string, any> = {
			updatedAt: new Date(),
		}

		if (session.user.role === 'admin') {
			// Admin can update status
			if (data.status) allowedUpdates.status = data.status
			if (data.paymentStatus) allowedUpdates.paymentStatus = data.paymentStatus
			if (data.notes) allowedUpdates.notes = data.notes
		}

		// Users can only update driver info before payment
		if (data.driverInfo) {
			const booking = await db.collection('bookings').findOne({
				_id: new ObjectId(id),
				userId: new ObjectId(session.user.id),
				paymentStatus: 'pending',
			})

			if (booking) {
				allowedUpdates.driverInfo = data.driverInfo
			}
		}

		const result = await db.collection('bookings').updateOne(
			{
				_id: new ObjectId(id),
				...(session.user.role !== 'admin' ? { userId: new ObjectId(session.user.id) } : {}),
			},
			{ $set: allowedUpdates }
		)

		if (result.matchedCount === 0) {
			return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
		}

		return NextResponse.json({ message: 'Booking updated successfully' })
	} catch (error) {
		console.error('Error updating booking:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const session = await getServerSession(authOptions)

		if (!session?.user?.id) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const { id } = params
		const { searchParams } = new URL(request.url)
		const reason = searchParams.get('reason') || 'Cancelled by user'

		if (!ObjectId.isValid(id)) {
			return NextResponse.json({ error: 'Invalid booking ID' }, { status: 400 })
		}

		const client = await clientPromise
		const db = client.db(process.env.MONGODB_DB)

		// Find booking
		const booking = await db.collection('bookings').findOne({
			_id: new ObjectId(id),
			...(session.user.role !== 'admin' ? { userId: new ObjectId(session.user.id) } : {}),
		})

		if (!booking) {
			return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
		}

		// Check if booking can be cancelled
		if (['completed', 'cancelled'].includes(booking.status)) {
			return NextResponse.json({
				error: 'Booking cannot be cancelled'
			}, { status: 400 })
		}

		// Calculate refund amount based on status
		let refundAmount = 0
		if (booking.paymentStatus === 'paid') {
			// Full refund if cancelled more than 48 hours before pickup
			const hoursUntilPickup = (new Date(booking.pickupDate).getTime() - Date.now()) / (1000 * 60 * 60)

			if (hoursUntilPickup > 48) {
				refundAmount = booking.pricing.total
			} else if (hoursUntilPickup > 24) {
				refundAmount = booking.pricing.total * 0.5 // 50% refund
			}
			// No refund if less than 24 hours
		}

		// Update booking status
		await db.collection('bookings').updateOne(
			{ _id: new ObjectId(id) },
			{
				$set: {
					status: 'cancelled',
					cancellation: {
						reason,
						cancelledAt: new Date(),
						refundAmount,
					},
					updatedAt: new Date(),
				}
			}
		)

		return NextResponse.json({
			message: 'Booking cancelled successfully',
			refundAmount,
		})
	} catch (error) {
		console.error('Error cancelling booking:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}
