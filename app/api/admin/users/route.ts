import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import clientPromise from '@/lib/mongodb'

export async function GET(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions)

		if (!session || session.user?.role !== 'admin') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const client = await clientPromise
		const db = client.db(process.env.MONGODB_DB)

		// Get all users with booking count
		const users = await db.collection('users').aggregate([
			{
				$lookup: {
					from: 'bookings',
					localField: '_id',
					foreignField: 'userId',
					as: 'bookings'
				}
			},
			{
				$project: {
					password: 0,
					bookings: 0,
				}
			},
			{
				$addFields: {
					bookingsCount: { $size: { $ifNull: ['$bookings', []] } }
				}
			},
			{
				$sort: { createdAt: -1 }
			}
		]).toArray()

		// Re-run to get bookings count correctly
		const usersWithBookings = await Promise.all(
			users.map(async (user) => {
				const bookingsCount = await db.collection('bookings').countDocuments({
					userId: user._id
				})
				return {
					...user,
					bookingsCount
				}
			})
		)

		return NextResponse.json({ users: usersWithBookings })
	} catch (error) {
		console.error('Error fetching users:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}
