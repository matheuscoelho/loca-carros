export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function POST(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions)

		if (!session?.user?.id) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const client = await clientPromise
		const db = client.db(process.env.MONGODB_DB)

		const result = await db.collection('notifications').updateMany(
			{
				userId: new ObjectId(session.user.id),
				read: false
			},
			{
				$set: {
					read: true,
					updatedAt: new Date()
				}
			}
		)

		return NextResponse.json({
			message: 'All notifications marked as read',
			modifiedCount: result.modifiedCount
		})
	} catch (error) {
		console.error('Error marking all notifications as read:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}
