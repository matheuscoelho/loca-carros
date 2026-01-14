export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET() {
	try {
		const client = await clientPromise
		const db = client.db(process.env.MONGODB_DB)

		// Buscar locais únicos dos carros ativos
		const locations = await db.collection('cars').distinct('location.city', {
			status: 'active',
			'availability.isAvailable': true,
		})

		// Filtrar locais vazios ou nulos
		const validLocations = locations.filter((loc: string | null) => loc && loc.trim() !== '')

		return NextResponse.json({
			locations: validLocations.sort()
		})
	} catch (error) {
		console.error('Error fetching locations:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}
