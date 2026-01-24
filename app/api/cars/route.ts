export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { ICar } from '@/models/Car'
import { resolveTenantFromRequest } from '@/lib/tenant/resolver'
import { getTenantCollectionById } from '@/lib/tenant/query'

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url)

		// Resolve tenant from request
		const tenantContext = await resolveTenantFromRequest(request)
		if (!tenantContext.tenantId) {
			return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
		}

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
		const query: Record<string, unknown> = {
			status: 'active',
			'availability.isAvailable': true,
		}

		if (carType) query.carType = carType
		if (fuelType) query.fuelType = fuelType
		if (transmission) query.transmission = transmission
		if (brand) query.brand = { $regex: brand, $options: 'i' }
		if (city) query['location.city'] = { $regex: city, $options: 'i' }

		if (minPrice || maxPrice) {
			const priceFilter: Record<string, number> = {}
			if (minPrice) priceFilter.$gte = parseFloat(minPrice)
			if (maxPrice) priceFilter.$lte = parseFloat(maxPrice)
			query['pricing.dailyRate'] = priceFilter
		}

		if (search) {
			query.$or = [
				{ name: { $regex: search, $options: 'i' } },
				{ brand: { $regex: search, $options: 'i' } },
				{ model: { $regex: search, $options: 'i' } },
			]
		}

		// Get tenant-aware collection
		const carsQuery = await getTenantCollectionById<ICar>('cars', tenantContext.tenantId)

		// Get total count
		const total = await carsQuery.countDocuments(query)

		// Get cars using aggregate for pagination
		const cars = await carsQuery.aggregate([
			{ $match: query },
			{ $sort: { createdAt: -1 } },
			{ $skip: skip },
			{ $limit: limit },
		]).toArray()

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
		// Require admin authentication
		const session = await getServerSession(authOptions)
		if (!session || session.user?.role !== 'admin') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const tenantId = session.user.tenantId
		if (!tenantId) {
			return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
		}

		const data = await request.json()

		const carsQuery = await getTenantCollectionById<ICar>('cars', tenantId)

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

		const result = await carsQuery.insertOne(car as ICar)

		return NextResponse.json({
			message: 'Car created successfully',
			carId: result.insertedId,
		}, { status: 201 })
	} catch (error) {
		console.error('Error creating car:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}
