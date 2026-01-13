export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ICar } from '@/models/Car'

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url)

		// Pagination
		const page = parseInt(searchParams.get('page') || '1')
		const limit = parseInt(searchParams.get('limit') || '12')
		const skip = (page - 1) * limit

		// Filters
		const carType = searchParams.get('carType')
		const fuelType = searchParams.get('fuelType')
		const transmission = searchParams.get('transmission')
		const minPrice = searchParams.get('minPrice')
		const maxPrice = searchParams.get('maxPrice')
		const brand = searchParams.get('brand')
		const city = searchParams.get('city')
		const search = searchParams.get('search')

		// Build query
		const query: Record<string, any> = {
			status: 'active',
			'availability.isAvailable': true,
		}

		if (carType) query.carType = carType
		if (fuelType) query.fuelType = fuelType
		if (transmission) query.transmission = transmission
		if (brand) query.brand = { $regex: brand, $options: 'i' }
		if (city) query['location.city'] = { $regex: city, $options: 'i' }

		if (minPrice || maxPrice) {
			query['pricing.dailyRate'] = {}
			if (minPrice) query['pricing.dailyRate'].$gte = parseFloat(minPrice)
			if (maxPrice) query['pricing.dailyRate'].$lte = parseFloat(maxPrice)
		}

		if (search) {
			query.$or = [
				{ name: { $regex: search, $options: 'i' } },
				{ brand: { $regex: search, $options: 'i' } },
				{ model: { $regex: search, $options: 'i' } },
			]
		}

		const client = await clientPromise
		const db = client.db(process.env.MONGODB_DB)

		// Get total count
		const total = await db.collection('cars').countDocuments(query)

		// Get cars
		const cars = await db.collection('cars')
			.find(query)
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit)
			.toArray()

		return NextResponse.json({
			cars,
			pagination: {
				page,
				limit,
				total,
				totalPages: Math.ceil(total / limit),
			}
		})
	} catch (error) {
		console.error('Error fetching cars:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}

export async function POST(request: NextRequest) {
	try {
		// This would typically require admin authentication
		const data = await request.json()

		const client = await clientPromise
		const db = client.db(process.env.MONGODB_DB)

		const car: Partial<ICar> = {
			...data,
			rating: 0,
			reviewCount: 0,
			totalBookings: 0,
			status: 'active',
			availability: {
				isAvailable: true,
				unavailableDates: [],
			},
			createdAt: new Date(),
			updatedAt: new Date(),
		}

		const result = await db.collection('cars').insertOne(car)

		return NextResponse.json({
			message: 'Car created successfully',
			carId: result.insertedId,
		}, { status: 201 })
	} catch (error) {
		console.error('Error creating car:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}
