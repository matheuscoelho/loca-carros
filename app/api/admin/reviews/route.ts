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

		// Get reviews with aggregation to join user and car data
		const reviews = await db.collection('reviews')
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
						from: 'cars',
						localField: 'carId',
						foreignField: '_id',
						as: 'car'
					}
				},
				{ $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
				{ $unwind: { path: '$car', preserveNullAndEmptyArrays: true } },
				{
					$project: {
						rating: 1,
						ratings: 1,
						title: 1,
						comment: 1,
						status: 1,
						response: 1,
						helpful: 1,
						createdAt: 1,
						'user.name': 1,
						'user.email': 1,
						'car.brand': 1,
						'car.model': 1
					}
				},
				{ $sort: { createdAt: -1 } },
				{ $skip: skip },
				{ $limit: limit }
			])
			.toArray()

		// Get total count
		const total = await db.collection('reviews').countDocuments(filter)

		// Get stats
		const stats = await db.collection('reviews').aggregate([
			{
				$group: {
					_id: '$status',
					count: { $sum: 1 }
				}
			}
		]).toArray()

		// Get average rating
		const avgResult = await db.collection('reviews').aggregate([
			{ $match: { status: 'approved' } },
			{
				$group: {
					_id: null,
					avgRating: { $avg: '$rating' }
				}
			}
		]).toArray()

		const statsMap: Record<string, number> = {}
		stats.forEach(s => {
			statsMap[s._id] = s.count
		})

		return NextResponse.json({
			reviews,
			total,
			page,
			totalPages: Math.ceil(total / limit),
			stats: statsMap,
			averageRating: avgResult[0]?.avgRating || 0
		})
	} catch (error) {
		console.error('Error fetching reviews:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}

// PUT - Update review status
export async function PUT(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions)

		if (!session || session.user?.role !== 'admin') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const body = await request.json()
		const { reviewId, status, response } = body

		if (!reviewId) {
			return NextResponse.json({ error: 'Review ID required' }, { status: 400 })
		}

		const client = await clientPromise
		const db = client.db(process.env.MONGODB_DB)

		const updateData: Record<string, unknown> = {
			updatedAt: new Date()
		}

		if (status) {
			updateData.status = status
		}

		if (response) {
			updateData.response = {
				text: response,
				respondedAt: new Date(),
				respondedBy: new ObjectId(session.user.id)
			}
		}

		await db.collection('reviews').updateOne(
			{ _id: new ObjectId(reviewId) },
			{ $set: updateData }
		)

		// If approved, update car's average rating
		if (status === 'approved') {
			const review = await db.collection('reviews').findOne({
				_id: new ObjectId(reviewId)
			})

			if (review?.carId) {
				const avgResult = await db.collection('reviews').aggregate([
					{
						$match: {
							carId: review.carId,
							status: 'approved'
						}
					},
					{
						$group: {
							_id: null,
							avgRating: { $avg: '$rating' },
							count: { $sum: 1 }
						}
					}
				]).toArray()

				if (avgResult[0]) {
					await db.collection('cars').updateOne(
						{ _id: review.carId },
						{
							$set: {
								rating: Math.round(avgResult[0].avgRating * 100) / 100,
								reviewCount: avgResult[0].count
							}
						}
					)
				}
			}
		}

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error('Error updating review:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}
