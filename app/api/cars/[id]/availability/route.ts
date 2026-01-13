import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const { id } = params
		const { searchParams } = new URL(request.url)

		const startDate = searchParams.get('startDate')
		const endDate = searchParams.get('endDate')

		if (!ObjectId.isValid(id)) {
			return NextResponse.json({ error: 'Invalid car ID' }, { status: 400 })
		}

		const client = await clientPromise
		const db = client.db(process.env.MONGODB_DB)

		// Get car
		const car = await db.collection('cars').findOne({
			_id: new ObjectId(id),
		})

		if (!car) {
			return NextResponse.json({ error: 'Car not found' }, { status: 404 })
		}

		// Get all bookings for this car that are not cancelled
		const bookings = await db.collection('bookings').find({
			carId: new ObjectId(id),
			status: { $nin: ['cancelled'] },
		}).toArray()

		// Build unavailable dates from bookings
		const unavailableDates: string[] = []

		bookings.forEach(booking => {
			const start = new Date(booking.pickupDate)
			const end = new Date(booking.dropoffDate)

			for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
				unavailableDates.push(d.toISOString().split('T')[0])
			}
		})

		// Add car's own unavailable dates
		if (car.availability?.unavailableDates) {
			car.availability.unavailableDates.forEach((date: Date) => {
				unavailableDates.push(new Date(date).toISOString().split('T')[0])
			})
		}

		// Check if specific date range is available
		let isAvailable = car.availability?.isAvailable !== false

		if (startDate && endDate && isAvailable) {
			const start = new Date(startDate)
			const end = new Date(endDate)

			for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
				const dateStr = d.toISOString().split('T')[0]
				if (unavailableDates.includes(dateStr)) {
					isAvailable = false
					break
				}
			}
		}

		return NextResponse.json({
			carId: id,
			isAvailable,
			unavailableDates: [...new Set(unavailableDates)], // Remove duplicates
		})
	} catch (error) {
		console.error('Error checking availability:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}
