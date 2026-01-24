export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getDatabase } from '@/lib/mongodb'
import { ObjectId, Document } from 'mongodb'

// GET - List user's favorites
export async function GET(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions)

		if (!session?.user?.id) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const tenantId = session.user.tenantId
		if (!tenantId) {
			return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
		}

		const tenantObjectId = new ObjectId(tenantId)
		const db = await getDatabase()

		// Get user with favorites
		const user = await db.collection('users').findOne({
			_id: new ObjectId(session.user.id),
			tenantId: tenantObjectId,
		})

		const favoriteIds = user?.favorites || []

		if (favoriteIds.length === 0) {
			return NextResponse.json({ favorites: [], cars: [] })
		}

		// Get car details for favorites (filtered by tenant)
		const cars = await db.collection('cars')
			.find({
				_id: { $in: favoriteIds.map((id: string) => new ObjectId(id)) },
				tenantId: tenantObjectId,
				status: 'active',
			})
			.toArray()

		return NextResponse.json({
			favorites: favoriteIds,
			cars,
		})
	} catch (error) {
		console.error('Error fetching favorites:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}

// POST - Add car to favorites
export async function POST(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions)

		if (!session?.user?.id) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const tenantId = session.user.tenantId
		if (!tenantId) {
			return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
		}

		const tenantObjectId = new ObjectId(tenantId)

		const { carId } = await request.json()

		if (!carId || !ObjectId.isValid(carId)) {
			return NextResponse.json({ error: 'Invalid car ID' }, { status: 400 })
		}

		const db = await getDatabase()

		// Check if car exists in the same tenant
		const car = await db.collection('cars').findOne({
			_id: new ObjectId(carId),
			tenantId: tenantObjectId,
			status: 'active',
		})

		if (!car) {
			return NextResponse.json({ error: 'Car not found' }, { status: 404 })
		}

		// Add to favorites (using $addToSet to avoid duplicates)
		await db.collection('users').updateOne(
			{ _id: new ObjectId(session.user.id), tenantId: tenantObjectId },
			{
				$addToSet: { favorites: carId },
				$set: { updatedAt: new Date() },
			}
		)

		return NextResponse.json({
			message: 'Car added to favorites',
			carId,
		})
	} catch (error) {
		console.error('Error adding favorite:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}

// DELETE - Remove car from favorites
export async function DELETE(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions)

		if (!session?.user?.id) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const tenantId = session.user.tenantId
		if (!tenantId) {
			return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
		}

		const tenantObjectId = new ObjectId(tenantId)

		const { searchParams } = new URL(request.url)
		const carId = searchParams.get('carId')

		if (!carId || !ObjectId.isValid(carId)) {
			return NextResponse.json({ error: 'Invalid car ID' }, { status: 400 })
		}

		const db = await getDatabase()

		// Remove from favorites
		await db.collection('users').updateOne(
			{ _id: new ObjectId(session.user.id), tenantId: tenantObjectId },
			{ $pull: { favorites: carId }, $set: { updatedAt: new Date() } } as unknown as Document
		)

		return NextResponse.json({
			message: 'Car removed from favorites',
			carId,
		})
	} catch (error) {
		console.error('Error removing favorite:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}
