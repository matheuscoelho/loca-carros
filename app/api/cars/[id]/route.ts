export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { ObjectId } from 'mongodb'
import { ICar } from '@/models/Car'
import { resolveTenantFromRequest } from '@/lib/tenant/resolver'
import { getTenantCollectionById } from '@/lib/tenant/query'

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params

		if (!id) {
			return NextResponse.json({ error: 'Car ID is required' }, { status: 400 })
		}

		// Resolve tenant from request
		const tenantContext = await resolveTenantFromRequest(request)
		if (!tenantContext.tenantId) {
			return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
		}

		const carsQuery = await getTenantCollectionById<ICar>('cars', tenantContext.tenantId)

		let car = null

		// Try to find by ObjectId first
		if (ObjectId.isValid(id)) {
			car = await carsQuery.findOne({ _id: new ObjectId(id) })
		}

		// If not found, try by string ID
		if (!car) {
			car = await carsQuery.findOne({ id: id })
		}

		if (!car) {
			return NextResponse.json({ error: 'Car not found' }, { status: 404 })
		}

		return NextResponse.json({ car })
	} catch (error) {
		console.error('Error fetching car:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}

export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
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

		const { id } = await params
		const data = await request.json()

		if (!id || !ObjectId.isValid(id)) {
			return NextResponse.json({ error: 'Valid car ID is required' }, { status: 400 })
		}

		const carsQuery = await getTenantCollectionById<ICar>('cars', tenantId)

		const result = await carsQuery.updateOne(
			{ _id: new ObjectId(id) },
			{
				$set: {
					...data,
					updatedAt: new Date(),
				}
			}
		)

		if (result.matchedCount === 0) {
			return NextResponse.json({ error: 'Car not found' }, { status: 404 })
		}

		return NextResponse.json({ message: 'Car updated successfully' })
	} catch (error) {
		console.error('Error updating car:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
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

		const { id } = await params

		if (!id || !ObjectId.isValid(id)) {
			return NextResponse.json({ error: 'Valid car ID is required' }, { status: 400 })
		}

		const carsQuery = await getTenantCollectionById<ICar>('cars', tenantId)

		const result = await carsQuery.deleteOne({ _id: new ObjectId(id) })

		if (result.deletedCount === 0) {
			return NextResponse.json({ error: 'Car not found' }, { status: 404 })
		}

		return NextResponse.json({ message: 'Car deleted successfully' })
	} catch (error) {
		console.error('Error deleting car:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}
