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

		const { searchParams } = new URL(request.url)
		const unreadOnly = searchParams.get('unreadOnly') === 'true'
		const limit = parseInt(searchParams.get('limit') || '50')

		const client = await clientPromise
		const db = client.db(process.env.MONGODB_DB)

		const query: Record<string, any> = {
			userId: new ObjectId(session.user.id)
		}

		if (unreadOnly) {
			query.read = false
		}

		const notifications = await db.collection('notifications')
			.find(query)
			.sort({ createdAt: -1 })
			.limit(limit)
			.toArray()

		const unreadCount = await db.collection('notifications').countDocuments({
			userId: new ObjectId(session.user.id),
			read: false
		})

		return NextResponse.json({
			notifications,
			unreadCount
		})
	} catch (error) {
		console.error('Error fetching notifications:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}
