import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { calculateTotalDays, calculateBookingPrice } from '@/models/Booking'

export async function POST(request: NextRequest) {
	try {
		const data = await request.json()
		const {
			carId,
			pickupDate,
			dropoffDate,
			extras = [],
			discountCode,
		} = data

		// Validation
		if (!carId || !pickupDate || !dropoffDate) {
			return NextResponse.json({
				error: 'Missing required fields: carId, pickupDate, dropoffDate'
			}, { status: 400 })
		}

		if (!ObjectId.isValid(carId)) {
			return NextResponse.json({ error: 'Invalid car ID' }, { status: 400 })
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

		// Calculate dates
		const pickup = new Date(pickupDate)
		const dropoff = new Date(dropoffDate)

		if (pickup >= dropoff) {
			return NextResponse.json({
				error: 'Drop-off date must be after pickup date'
			}, { status: 400 })
		}

		const totalDays = calculateTotalDays(pickup, dropoff)
		const dailyRate = car.pricing.dailyRate

		// Process extras
		const extrasWithQuantity = extras.map((extra: any) => {
			// Find extra in car's available extras
			const carExtra = car.extras?.find((e: any) => e.name === extra.name)
			return {
				name: extra.name,
				price: carExtra?.price || extra.price || 0,
				quantity: extra.quantity || 1,
			}
		})

		// Calculate discount (can be expanded with promo codes)
		let discount = 0
		let discountPercentage = 0

		// Weekly discount
		if (totalDays >= 7) {
			discountPercentage = 10 // 10% off for weekly rentals
		}

		// Monthly discount
		if (totalDays >= 30) {
			discountPercentage = 20 // 20% off for monthly rentals
		}

		const subtotalBeforeDiscount = dailyRate * totalDays
		discount = (subtotalBeforeDiscount * discountPercentage) / 100

		// Calculate final pricing
		const pricing = calculateBookingPrice(
			dailyRate,
			totalDays,
			extrasWithQuantity,
			0.1, // 10% tax
			discount
		)

		return NextResponse.json({
			calculation: {
				car: {
					id: car._id,
					name: car.name,
					brand: car.brand,
					image: car.images?.[0]?.url,
				},
				dates: {
					pickup: pickup.toISOString(),
					dropoff: dropoff.toISOString(),
					totalDays,
				},
				pricing: {
					dailyRate,
					subtotal: pricing.subtotal,
					extras: extrasWithQuantity,
					extrasTotal: pricing.extrasTotal,
					discount,
					discountPercentage,
					tax: pricing.tax,
					taxRate: 10, // 10%
					total: pricing.total,
					currency: car.pricing.currency || 'USD',
					deposit: car.pricing.deposit || 0,
				}
			}
		})
	} catch (error) {
		console.error('Error calculating price:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}
