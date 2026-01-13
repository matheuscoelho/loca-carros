import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const { id } = params

		if (!id) {
			return NextResponse.json({ error: 'Car ID is required' }, { status: 400 })
		}

		const client = await clientPromise
		const db = client.db(process.env.MONGODB_DB)

		let car

		// Try to find by ObjectId first
		if (ObjectId.isValid(id)) {
			car = await db.collection('cars').findOne({ _id: new ObjectId(id) })
		}

		// If not found, try by string ID (in case the ID format is different)
		if (!car) {
			car = await db.collection('cars').findOne({ id: id })
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
	{ params }: { params: { id: string } }
) {
	try {
		const { id } = params
		const data = await request.json()

		if (!id || !ObjectId.isValid(id)) {
			return NextResponse.json({ error: 'Valid car ID is required' }, { status: 400 })
		}

		const client = await clientPromise
		const db = client.db(process.env.MONGODB_DB)

		const result = await db.collection('cars').updateOne(
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
	{ params }: { params: { id: string } }
) {
	try {
		const { id } = params

		if (!id || !ObjectId.isValid(id)) {
			return NextResponse.json({ error: 'Valid car ID is required' }, { status: 400 })
		}

		const client = await clientPromise
		const db = client.db(process.env.MONGODB_DB)

		const result = await db.collection('cars').deleteOne({ _id: new ObjectId(id) })

		if (result.deletedCount === 0) {
			return NextResponse.json({ error: 'Car not found' }, { status: 404 })
		}

		return NextResponse.json({ message: 'Car deleted successfully' })
	} catch (error) {
		console.error('Error deleting car:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}
