import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { ITenant } from '@/models/Tenant'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
	const { email } = await request.json()
	const host = request.headers.get('host') || 'NENHUM'
	const db = await getDatabase()

	const baseDomain = process.env.BASE_DOMAIN || 'localhost'
	const cleanHostname = host.split(':')[0].toLowerCase()

	let tenantSlug: string | null = null
	if (cleanHostname.endsWith(`.${baseDomain}`)) {
		tenantSlug = cleanHostname.replace(`.${baseDomain}`, '')
	}

	const orConditions: Record<string, unknown>[] = [
		{ 'domains.primary': cleanHostname },
		{ 'domains.custom': cleanHostname },
	]
	if (tenantSlug) orConditions.push({ slug: tenantSlug })

	const tenant = await db.collection<ITenant>('tenants').findOne({
		$or: orConditions,
		status: 'active',
	})

	const tenantId = tenant?._id?.toString() || null

	const query: Record<string, unknown> = {
		email: email.toLowerCase(),
		role: { $ne: 'super_admin' },
	}
	if (tenantId) {
		query.tenantId = new ObjectId(tenantId)
	}

	const user = await db.collection('users').findOne(query)

	return NextResponse.json({
		host,
		baseDomain,
		cleanHostname,
		tenantSlug,
		tenantFound: !!tenant,
		tenantId,
		queryUsed: JSON.stringify(query, (_, v) => v instanceof ObjectId ? v.toString() : v),
		userFound: !!user,
		userEmail: user?.email || null,
		dbName: db.databaseName,
	})
}
