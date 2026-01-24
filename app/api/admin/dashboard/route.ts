export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions)

		if (!session || session.user?.role !== 'admin') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const tenantId = session.user.tenantId
		if (!tenantId) {
			return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
		}

		const tenantObjectId = new ObjectId(tenantId)

		const db = await getDatabase()

		// Get current date info
		const now = new Date()
		const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
		const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
		const startOfYear = new Date(now.getFullYear(), 0, 1)

		// Run all queries in parallel - all filtered by tenantId
		const [
			totalUsers,
			totalCars,
			activeCars,
			totalBookings,
			pendingBookings,
			confirmedBookings,
			inProgressBookings,
			completedBookings,
			cancelledBookings,
			todayBookings,
			monthBookings,
			recentBookings,
			revenueData,
			pendingPayments,
		] = await Promise.all([
			// Users count
			db.collection('users').countDocuments({ tenantId: tenantObjectId }),
			// Total cars
			db.collection('cars').countDocuments({ tenantId: tenantObjectId }),
			// Active cars
			db.collection('cars').countDocuments({ tenantId: tenantObjectId, status: 'active' }),
			// Total bookings
			db.collection('bookings').countDocuments({ tenantId: tenantObjectId }),
			// Pending bookings
			db.collection('bookings').countDocuments({ tenantId: tenantObjectId, status: 'pending' }),
			// Confirmed bookings
			db.collection('bookings').countDocuments({ tenantId: tenantObjectId, status: 'confirmed' }),
			// In progress bookings
			db.collection('bookings').countDocuments({ tenantId: tenantObjectId, status: 'in_progress' }),
			// Completed bookings
			db.collection('bookings').countDocuments({ tenantId: tenantObjectId, status: 'completed' }),
			// Cancelled bookings
			db.collection('bookings').countDocuments({ tenantId: tenantObjectId, status: 'cancelled' }),
			// Today's bookings
			db.collection('bookings').countDocuments({
				tenantId: tenantObjectId,
				createdAt: { $gte: startOfToday }
			}),
			// Month bookings
			db.collection('bookings').countDocuments({
				tenantId: tenantObjectId,
				createdAt: { $gte: startOfMonth }
			}),
			// Recent bookings with car info
			db.collection('bookings').aggregate([
				{ $match: { tenantId: tenantObjectId } },
				{ $sort: { createdAt: -1 } },
				{ $limit: 10 },
				{
					$lookup: {
						from: 'cars',
						let: { carId: '$carId', tenantId: '$tenantId' },
						pipeline: [
							{
								$match: {
									$expr: {
										$and: [
											{ $eq: ['$_id', '$$carId'] },
											{ $eq: ['$tenantId', '$$tenantId'] }
										]
									}
								}
							}
						],
						as: 'car'
					}
				},
				{
					$lookup: {
						from: 'users',
						let: { userId: '$userId', tenantId: '$tenantId' },
						pipeline: [
							{
								$match: {
									$expr: {
										$and: [
											{ $eq: ['$_id', '$$userId'] },
											{ $eq: ['$tenantId', '$$tenantId'] }
										]
									}
								}
							}
						],
						as: 'user'
					}
				},
				{
					$project: {
						bookingNumber: 1,
						status: 1,
						paymentStatus: 1,
						pickupDate: 1,
						dropoffDate: 1,
						'pricing.total': 1,
						createdAt: 1,
						'car.name': { $arrayElemAt: ['$car.name', 0] },
						'car.brand': { $arrayElemAt: ['$car.brand', 0] },
						'user.name': { $arrayElemAt: ['$user.name', 0] },
						'user.email': { $arrayElemAt: ['$user.email', 0] },
						driverInfo: 1,
					}
				}
			]).toArray(),
			// Total revenue (paid bookings)
			db.collection('bookings').aggregate([
				{
					$match: {
						tenantId: tenantObjectId,
						paymentStatus: 'paid',
						createdAt: { $gte: startOfYear }
					}
				},
				{
					$group: {
						_id: null,
						total: { $sum: '$pricing.total' },
						count: { $sum: 1 }
					}
				}
			]).toArray(),
			// Pending payments
			db.collection('bookings').countDocuments({ tenantId: tenantObjectId, paymentStatus: 'pending' }),
		])

		// Monthly revenue breakdown
		const monthlyRevenue = await db.collection('bookings').aggregate([
			{
				$match: {
					tenantId: tenantObjectId,
					paymentStatus: 'paid',
					createdAt: { $gte: startOfYear }
				}
			},
			{
				$group: {
					_id: {
						year: { $year: '$createdAt' },
						month: { $month: '$createdAt' }
					},
					revenue: { $sum: '$pricing.total' },
					bookings: { $sum: 1 }
				}
			},
			{ $sort: { '_id.year': 1, '_id.month': 1 } }
		]).toArray()

		const stats = {
			users: {
				total: totalUsers,
			},
			vehicles: {
				total: totalCars,
				active: activeCars,
				inactive: totalCars - activeCars,
			},
			bookings: {
				total: totalBookings,
				pending: pendingBookings,
				confirmed: confirmedBookings,
				inProgress: inProgressBookings,
				completed: completedBookings,
				cancelled: cancelledBookings,
				today: todayBookings,
				thisMonth: monthBookings,
			},
			payments: {
				pending: pendingPayments,
			},
			revenue: {
				total: revenueData[0]?.total || 0,
				paidBookings: revenueData[0]?.count || 0,
				monthly: monthlyRevenue.map(m => ({
					month: m._id.month,
					year: m._id.year,
					revenue: m.revenue,
					bookings: m.bookings,
				})),
			},
			recentBookings: recentBookings.map(b => ({
				_id: b._id,
				bookingNumber: b.bookingNumber,
				status: b.status,
				paymentStatus: b.paymentStatus,
				pickupDate: b.pickupDate,
				dropoffDate: b.dropoffDate,
				total: b.pricing?.total || 0,
				createdAt: b.createdAt,
				carName: b.car?.name || 'Unknown',
				carBrand: b.car?.brand || '',
				customerName: b.user?.name || b.driverInfo?.name || 'Unknown',
				customerEmail: b.user?.email || b.driverInfo?.email || '',
			})),
		}

		return NextResponse.json({ stats })
	} catch (error) {
		console.error('Error fetching dashboard stats:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}
