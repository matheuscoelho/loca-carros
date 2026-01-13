import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import {
	generateBookingNumber,
	calculateTotalDays,
	calculateBookingPrice,
	IBooking,
} from '@/models/Booking'

export async function GET(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions)

		if (!session?.user?.id) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const { searchParams } = new URL(request.url)
		const status = searchParams.get('status')
		const page = parseInt(searchParams.get('page') || '1')
		const limit = parseInt(searchParams.get('limit') || '10')
		const skip = (page - 1) * limit

		const client = await clientPromise
		const db = client.db(process.env.MONGODB_DB)

		// Build query based on user role
		const query: Record<string, any> = {}

		if (session.user.role !== 'admin') {
			query.userId = new ObjectId(session.user.id)
		}

		if (status) {
			query.status = status
		}

		const total = await db.collection('bookings').countDocuments(query)

		const bookings = await db.collection('bookings')
			.aggregate([
				{ $match: query },
				{ $sort: { createdAt: -1 } },
				{ $skip: skip },
				{ $limit: limit },
				{
					$lookup: {
						from: 'cars',
						localField: 'carId',
						foreignField: '_id',
						as: 'car',
					}
				},
				{ $unwind: { path: '$car', preserveNullAndEmptyArrays: true } },
			])
			.toArray()

		return NextResponse.json({
			bookings,
			pagination: {
				page,
				limit,
				total,
				totalPages: Math.ceil(total / limit),
			}
		})
	} catch (error) {
		console.error('Error fetching bookings:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}

export async function POST(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions)

		if (!session?.user?.id) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const data = await request.json()
		const {
			carId,
			pickupDate,
			dropoffDate,
			pickupLocation,
			dropoffLocation,
			extras = [],
			driverInfo,
		} = data

		// Validation
		if (!carId || !pickupDate || !dropoffDate || !pickupLocation) {
			return NextResponse.json({
				error: 'Missing required fields'
			}, { status: 400 })
		}

		const client = await clientPromise
		const db = client.db(process.env.MONGODB_DB)

		// Get car details
		const car = await db.collection('cars').findOne({
			_id: new ObjectId(carId),
			status: 'active',
		})

		if (!car) {
			return NextResponse.json({ error: 'Car not found' }, { status: 404 })
		}

		// Check availability
		const pickup = new Date(pickupDate)
		const dropoff = new Date(dropoffDate)

		if (pickup >= dropoff) {
			return NextResponse.json({
				error: 'Drop-off date must be after pickup date'
			}, { status: 400 })
		}

		// Check for conflicting bookings
		const conflictingBooking = await db.collection('bookings').findOne({
			carId: new ObjectId(carId),
			status: { $nin: ['cancelled'] },
			$or: [
				{
					pickupDate: { $lte: dropoff },
					dropoffDate: { $gte: pickup },
				}
			]
		})

		if (conflictingBooking) {
			return NextResponse.json({
				error: 'Car is not available for the selected dates'
			}, { status: 409 })
		}

		// Calculate pricing
		const totalDays = calculateTotalDays(pickup, dropoff)
		const dailyRate = car.pricing.dailyRate

		const extrasWithQuantity = extras.map((extra: any) => ({
			name: extra.name,
			price: extra.price,
			quantity: extra.quantity || 1,
		}))

		const pricing = calculateBookingPrice(
			dailyRate,
			totalDays,
			extrasWithQuantity,
			0.1, // 10% tax
			0 // No discount
		)

		// Create booking
		const booking: Partial<IBooking> = {
			bookingNumber: generateBookingNumber(),
			userId: new ObjectId(session.user.id),
			carId: new ObjectId(carId),
			pickupDate: pickup,
			dropoffDate: dropoff,
			totalDays,
			pickupLocation,
			dropoffLocation: dropoffLocation || pickupLocation,
			extras: extrasWithQuantity,
			pricing: {
				dailyRate,
				...pricing,
				currency: car.pricing.currency || 'USD',
			},
			status: 'pending',
			paymentStatus: 'pending',
			driverInfo: driverInfo || {
				name: session.user.name || '',
				email: session.user.email || '',
				phone: '',
			},
			createdAt: new Date(),
			updatedAt: new Date(),
		}

		const result = await db.collection('bookings').insertOne(booking)

		// Update car total bookings
		await db.collection('cars').updateOne(
			{ _id: new ObjectId(carId) },
			{ $inc: { totalBookings: 1 } }
		)

		return NextResponse.json({
			message: 'Booking created successfully',
			bookingId: result.insertedId,
			bookingNumber: booking.bookingNumber,
			pricing: booking.pricing,
		}, { status: 201 })
	} catch (error) {
		console.error('Error creating booking:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}
