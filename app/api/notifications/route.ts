export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

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

		const { searchParams } = new URL(request.url)
		const unreadOnly = searchParams.get('unreadOnly') === 'true'
		const limit = parseInt(searchParams.get('limit') || '50')

		const db = await getDatabase()

		const query: Record<string, unknown> = {
			tenantId: tenantObjectId,
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
			tenantId: tenantObjectId,
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
