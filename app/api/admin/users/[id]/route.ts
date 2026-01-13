import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const session = await getServerSession(authOptions)

		if (!session || session.user?.role !== 'admin') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const client = await clientPromise
		const db = client.db(process.env.MONGODB_DB)

		const user = await db.collection('users').findOne(
			{ _id: new ObjectId(params.id) },
			{ projection: { password: 0 } }
		)

		if (!user) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 })
		}

		// Get booking count
		const bookingsCount = await db.collection('bookings').countDocuments({
			userId: new ObjectId(params.id)
		})

		return NextResponse.json({
			user: {
				...user,
				bookingsCount
			}
		})
	} catch (error) {
		console.error('Error fetching user:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}

export async function PUT(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const session = await getServerSession(authOptions)

		if (!session || session.user?.role !== 'admin') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const body = await request.json()
		const { role, status, name, phone } = body

		const client = await clientPromise
		const db = client.db(process.env.MONGODB_DB)

		const updateData: Record<string, any> = {
			updatedAt: new Date(),
		}

		if (role !== undefined) updateData.role = role
		if (status !== undefined) updateData.status = status
		if (name !== undefined) updateData.name = name
		if (phone !== undefined) updateData.phone = phone

		const result = await db.collection('users').updateOne(
			{ _id: new ObjectId(params.id) },
			{ $set: updateData }
		)

		if (result.matchedCount === 0) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 })
		}

		return NextResponse.json({
			message: 'User updated successfully',
		})
	} catch (error) {
		console.error('Error updating user:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const session = await getServerSession(authOptions)

		if (!session || session.user?.role !== 'admin') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const client = await clientPromise
		const db = client.db(process.env.MONGODB_DB)

		// Check if user has active bookings
		const activeBookings = await db.collection('bookings').countDocuments({
			userId: new ObjectId(params.id),
			status: { $in: ['pending', 'confirmed', 'in_progress'] }
		})

		if (activeBookings > 0) {
			return NextResponse.json({
				error: 'Cannot delete user with active bookings'
			}, { status: 400 })
		}

		const result = await db.collection('users').deleteOne({
			_id: new ObjectId(params.id)
		})

		if (result.deletedCount === 0) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 })
		}

		return NextResponse.json({
			message: 'User deleted successfully',
		})
	} catch (error) {
		console.error('Error deleting user:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}
