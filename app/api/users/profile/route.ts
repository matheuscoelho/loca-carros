import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions)

		if (!session?.user?.id) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const client = await clientPromise
		const db = client.db(process.env.MONGODB_DB)

		const user = await db.collection('users').findOne(
			{ _id: new ObjectId(session.user.id) },
			{ projection: { password: 0 } }
		)

		if (!user) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 })
		}

		return NextResponse.json({ user })
	} catch (error) {
		console.error('Error fetching profile:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}

export async function PUT(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions)

		if (!session?.user?.id) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const data = await request.json()
		const { name, phone, address } = data

		const client = await clientPromise
		const db = client.db(process.env.MONGODB_DB)

		const updateData: Record<string, any> = {
			updatedAt: new Date(),
		}

		if (name) updateData.name = name
		if (phone !== undefined) updateData.phone = phone
		if (address) updateData.address = address

		const result = await db.collection('users').updateOne(
			{ _id: new ObjectId(session.user.id) },
			{ $set: updateData }
		)

		if (result.matchedCount === 0) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 })
		}

		return NextResponse.json({
			message: 'Profile updated successfully',
			updated: updateData
		})
	} catch (error) {
		console.error('Error updating profile:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}
