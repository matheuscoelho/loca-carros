export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function PATCH(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const session = await getServerSession(authOptions)

		if (!session?.user?.id) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const { id } = params

		if (!id || !ObjectId.isValid(id)) {
			return NextResponse.json({ error: 'Invalid notification ID' }, { status: 400 })
		}

		const data = await request.json()

		const client = await clientPromise
		const db = client.db(process.env.MONGODB_DB)

		const result = await db.collection('notifications').updateOne(
			{
				_id: new ObjectId(id),
				userId: new ObjectId(session.user.id)
			},
			{
				$set: {
					read: data.read ?? true,
					updatedAt: new Date()
				}
			}
		)

		if (result.matchedCount === 0) {
			return NextResponse.json({ error: 'Notification not found' }, { status: 404 })
		}

		return NextResponse.json({ message: 'Notification updated successfully' })
	} catch (error) {
		console.error('Error updating notification:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const session = await getServerSession(authOptions)

		if (!session?.user?.id) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const { id } = params

		if (!id || !ObjectId.isValid(id)) {
			return NextResponse.json({ error: 'Invalid notification ID' }, { status: 400 })
		}

		const client = await clientPromise
		const db = client.db(process.env.MONGODB_DB)

		const result = await db.collection('notifications').deleteOne({
			_id: new ObjectId(id),
			userId: new ObjectId(session.user.id)
		})

		if (result.deletedCount === 0) {
			return NextResponse.json({ error: 'Notification not found' }, { status: 404 })
		}

		return NextResponse.json({ message: 'Notification deleted successfully' })
	} catch (error) {
		console.error('Error deleting notification:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}
