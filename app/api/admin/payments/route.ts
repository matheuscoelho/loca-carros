import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions)

		if (!session || session.user?.role !== 'admin') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const { searchParams } = new URL(request.url)
		const status = searchParams.get('status')
		const limit = parseInt(searchParams.get('limit') || '100')
		const page = parseInt(searchParams.get('page') || '1')
		const skip = (page - 1) * limit

		const client = await clientPromise
		const db = client.db(process.env.MONGODB_DB)

		// Build filter
		const filter: Record<string, unknown> = {}
		if (status && status !== 'all') {
			filter.status = status
		}

		// Get payments with aggregation to join user and booking data
		const payments = await db.collection('payments')
			.aggregate([
				{ $match: filter },
				{
					$lookup: {
						from: 'users',
						localField: 'userId',
						foreignField: '_id',
						as: 'user'
					}
				},
				{
					$lookup: {
						from: 'bookings',
						localField: 'bookingId',
						foreignField: '_id',
						as: 'booking'
					}
				},
				{ $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
				{ $unwind: { path: '$booking', preserveNullAndEmptyArrays: true } },
				{
					$project: {
						transactionId: 1,
						amount: 1,
						currency: 1,
						status: 1,
						paymentMethod: 1,
						stripePaymentIntentId: 1,
						refund: 1,
						createdAt: 1,
						completedAt: 1,
						'user.name': 1,
						'user.email': 1,
						'booking.bookingNumber': 1
					}
				},
				{ $sort: { createdAt: -1 } },
				{ $skip: skip },
				{ $limit: limit }
			])
			.toArray()

		// Get total count
		const total = await db.collection('payments').countDocuments(filter)

		// Get stats
		const stats = await db.collection('payments').aggregate([
			{
				$group: {
					_id: '$status',
					count: { $sum: 1 },
					total: { $sum: '$amount' }
				}
			}
		]).toArray()

		const statsMap: Record<string, { count: number; total: number }> = {}
		stats.forEach(s => {
			statsMap[s._id] = { count: s.count, total: s.total }
		})

		return NextResponse.json({
			payments,
			total,
			page,
			totalPages: Math.ceil(total / limit),
			stats: statsMap
		})
	} catch (error) {
		console.error('Error fetching payments:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}

// POST - Process refund
export async function POST(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions)

		if (!session || session.user?.role !== 'admin') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const body = await request.json()
		const { paymentId, amount, reason } = body

		if (!paymentId) {
			return NextResponse.json({ error: 'Payment ID required' }, { status: 400 })
		}

		const client = await clientPromise
		const db = client.db(process.env.MONGODB_DB)

		const payment = await db.collection('payments').findOne({
			_id: new ObjectId(paymentId)
		})

		if (!payment) {
			return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
		}

		if (payment.status !== 'succeeded') {
			return NextResponse.json({ error: 'Can only refund succeeded payments' }, { status: 400 })
		}

		// Update payment with refund info
		await db.collection('payments').updateOne(
			{ _id: new ObjectId(paymentId) },
			{
				$set: {
					status: 'refunded',
					refund: {
						amount: amount || payment.amount,
						reason: reason || 'Admin refund',
						refundedAt: new Date()
					},
					updatedAt: new Date()
				}
			}
		)

		// Update booking payment status
		if (payment.bookingId) {
			await db.collection('bookings').updateOne(
				{ _id: payment.bookingId },
				{
					$set: {
						paymentStatus: 'refunded',
						updatedAt: new Date()
					}
				}
			)
		}

		return NextResponse.json({ success: true, message: 'Refund processed' })
	} catch (error) {
		console.error('Error processing refund:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}
