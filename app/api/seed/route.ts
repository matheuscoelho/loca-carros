export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { hash } from 'bcryptjs'
import { createTenantDefaults, planLimits } from '@/models/Tenant'
import { defaultSettings } from '@/models/Settings'

// Sample cars data based on the template's cars.json
const sampleCars = [
	{
		name: 'BMW 3 Series 2024',
		brand: 'BMW',
		model: '330i',
		year: 2024,
		licensePlate: 'CAR-001',
		carType: 'Sedans',
		fuelType: 'Gasoline',
		transmission: 'Automatic',
		specs: { seats: 5, doors: 4, bags: 3, mileage: 5000 },
		pricing: { dailyRate: 89, weeklyRate: 550, deposit: 500, currency: 'USD' },
		extras: [
			{ name: 'GPS Navigation', price: 10 },
			{ name: 'Child Seat', price: 15 },
			{ name: 'Additional Driver', price: 20 },
		],
		amenities: ['Bluetooth', 'USB Charging', 'Leather Seats', 'Sunroof', 'Heated Seats'],
		images: [{ url: '/assets/imgs/page/homepage1/sedan.png', isPrimary: true }],
		location: { city: 'New York', state: 'NY', country: 'USA' },
		availability: { isAvailable: true, unavailableDates: [] },
		rating: 4.8,
		reviewCount: 45,
		totalBookings: 120,
		status: 'active',
	},
	{
		name: 'Mercedes-Benz GLE 2024',
		brand: 'Mercedes-Benz',
		model: 'GLE 350',
		year: 2024,
		licensePlate: 'CAR-002',
		carType: 'SUVs',
		fuelType: 'Hybrid',
		transmission: 'Automatic',
		specs: { seats: 7, doors: 5, bags: 5, mileage: 3000 },
		pricing: { dailyRate: 129, weeklyRate: 800, deposit: 750, currency: 'USD' },
		extras: [
			{ name: 'GPS Navigation', price: 10 },
			{ name: 'Child Seat', price: 15 },
			{ name: 'Roof Rack', price: 25 },
		],
		amenities: ['Bluetooth', 'USB Charging', 'Leather Seats', 'Panoramic Roof', 'Third Row'],
		images: [{ url: '/assets/imgs/page/homepage1/suv.png', isPrimary: true }],
		location: { city: 'Los Angeles', state: 'CA', country: 'USA' },
		availability: { isAvailable: true, unavailableDates: [] },
		rating: 4.9,
		reviewCount: 78,
		totalBookings: 200,
		status: 'active',
	},
	{
		name: 'Tesla Model 3 2024',
		brand: 'Tesla',
		model: 'Model 3',
		year: 2024,
		licensePlate: 'CAR-003',
		carType: 'Electric',
		fuelType: 'Electric',
		transmission: 'Automatic',
		specs: { seats: 5, doors: 4, bags: 2, mileage: 1500 },
		pricing: { dailyRate: 99, weeklyRate: 620, deposit: 600, currency: 'USD' },
		extras: [
			{ name: 'Full Self-Driving', price: 50 },
			{ name: 'Child Seat', price: 15 },
			{ name: 'Charging Adapter', price: 5 },
		],
		amenities: ['Autopilot', 'Premium Sound', 'Glass Roof', 'Wireless Charging', 'Over-the-Air Updates'],
		images: [{ url: '/assets/imgs/page/homepage1/car-1.png', isPrimary: true }],
		location: { city: 'San Francisco', state: 'CA', country: 'USA' },
		availability: { isAvailable: true, unavailableDates: [] },
		rating: 4.9,
		reviewCount: 120,
		totalBookings: 350,
		status: 'active',
	},
	{
		name: 'Porsche 911 Carrera',
		brand: 'Porsche',
		model: '911 Carrera',
		year: 2024,
		licensePlate: 'CAR-004',
		carType: 'Sports',
		fuelType: 'Gasoline',
		transmission: 'Automatic',
		specs: { seats: 2, doors: 2, bags: 1, mileage: 2000 },
		pricing: { dailyRate: 299, weeklyRate: 1800, deposit: 2000, currency: 'USD' },
		extras: [
			{ name: 'Track Day Experience', price: 200 },
			{ name: 'Premium Insurance', price: 50 },
		],
		amenities: ['Sport Chrono Package', 'Bose Audio', 'Sport Exhaust', 'Carbon Fiber Interior'],
		images: [{ url: '/assets/imgs/page/homepage1/car-2.png', isPrimary: true }],
		location: { city: 'Miami', state: 'FL', country: 'USA' },
		availability: { isAvailable: true, unavailableDates: [] },
		rating: 5.0,
		reviewCount: 32,
		totalBookings: 85,
		status: 'active',
	},
	{
		name: 'Toyota Camry 2024',
		brand: 'Toyota',
		model: 'Camry XSE',
		year: 2024,
		licensePlate: 'CAR-005',
		carType: 'Sedans',
		fuelType: 'Hybrid',
		transmission: 'Automatic',
		specs: { seats: 5, doors: 4, bags: 3, mileage: 8000 },
		pricing: { dailyRate: 59, weeklyRate: 380, deposit: 300, currency: 'USD' },
		extras: [
			{ name: 'GPS Navigation', price: 10 },
			{ name: 'Child Seat', price: 15 },
			{ name: 'Additional Driver', price: 15 },
		],
		amenities: ['Apple CarPlay', 'Android Auto', 'Lane Departure Warning', 'Adaptive Cruise Control'],
		images: [{ url: '/assets/imgs/page/homepage1/car-3.png', isPrimary: true }],
		location: { city: 'Chicago', state: 'IL', country: 'USA' },
		availability: { isAvailable: true, unavailableDates: [] },
		rating: 4.6,
		reviewCount: 95,
		totalBookings: 280,
		status: 'active',
	},
	{
		name: 'Jeep Wrangler 2024',
		brand: 'Jeep',
		model: 'Wrangler Rubicon',
		year: 2024,
		licensePlate: 'CAR-006',
		carType: 'SUVs',
		fuelType: 'Gasoline',
		transmission: 'Manual',
		specs: { seats: 5, doors: 4, bags: 2, mileage: 4500 },
		pricing: { dailyRate: 109, weeklyRate: 700, deposit: 600, currency: 'USD' },
		extras: [
			{ name: 'Off-Road Kit', price: 30 },
			{ name: 'Camping Gear', price: 40 },
			{ name: 'Roof Rack', price: 20 },
		],
		amenities: ['4x4', 'Removable Top', 'All-Terrain Tires', 'Winch', 'Rock Rails'],
		images: [{ url: '/assets/imgs/page/homepage1/car-4.png', isPrimary: true }],
		location: { city: 'Denver', state: 'CO', country: 'USA' },
		availability: { isAvailable: true, unavailableDates: [] },
		rating: 4.7,
		reviewCount: 67,
		totalBookings: 150,
		status: 'active',
	},
]

/**
 * Garante que existe um tenant default para localhost/desenvolvimento
 */
async function ensureDefaultTenant(db: Awaited<ReturnType<typeof getDatabase>>) {
	const baseDomain = process.env.BASE_DOMAIN || 'localhost'

	// Verificar se já existe tenant para localhost
	let tenant = await db.collection('tenants').findOne({
		$or: [
			{ slug: 'default' },
			{ 'domains.primary': 'localhost' },
			{ 'domains.primary': `localhost:3050` },
			{ 'domains.primary': baseDomain },
		]
	})

	if (tenant) {
		return tenant._id
	}

	// Criar tenant default
	const now = new Date()
	const tenantData = createTenantDefaults({
		name: 'Locadora Default',
		slug: 'default',
		domains: {
			primary: 'localhost',
			custom: ['localhost:3050', `default.${baseDomain}`],
		},
		subscription: {
			plan: 'enterprise',
			status: 'active',
			currentPeriodStart: now,
			currentPeriodEnd: new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000), // 1 ano
		},
		limits: planLimits.enterprise,
		owner: {
			userId: new ObjectId(),
			name: 'Admin',
			email: 'admin@locadora.com',
		},
		status: 'active',
		createdAt: now,
		updatedAt: now,
	})

	const result = await db.collection('tenants').insertOne(tenantData)
	console.log('✅ Tenant default criado:', result.insertedId)

	return result.insertedId
}

/**
 * Garante que existe um super_admin (sem tenant)
 */
async function ensureSuperAdmin(db: Awaited<ReturnType<typeof getDatabase>>) {
	// Verificar se já existe super_admin
	let superAdmin = await db.collection('users').findOne({
		role: 'super_admin',
	})

	const superAdminEmail = 'super@admin.com'
	const superAdminPassword = 'super123'
	const hashedPassword = await hash(superAdminPassword, 12)
	const now = new Date()

	if (superAdmin) {
		// Atualizar email e senha do super_admin para garantir acesso
		await db.collection('users').updateOne(
			{ _id: superAdmin._id },
			{
				$set: {
					email: superAdminEmail,
					password: hashedPassword,
					updatedAt: now
				}
			}
		)
		console.log('✅ Super Admin atualizado - email:', superAdminEmail)
		return superAdmin._id
	}

	// Criar super_admin (sem tenantId)
	const superAdminData = {
		email: superAdminEmail,
		password: hashedPassword,
		name: 'Super Administrador',
		role: 'super_admin',
		status: 'active',
		favorites: [],
		createdAt: now,
		updatedAt: now,
	}

	const result = await db.collection('users').insertOne(superAdminData)
	console.log('✅ Super Admin criado:', result.insertedId)

	return result.insertedId
}

/**
 * Garante que existe um usuário admin para o tenant
 */
async function ensureAdminUser(db: Awaited<ReturnType<typeof getDatabase>>, tenantId: ObjectId) {
	// Verificar se já existe admin
	let admin = await db.collection('users').findOne({
		tenantId,
		role: 'admin',
	})

	if (admin) {
		// Sempre atualizar email e senha do admin para garantir acesso
		const newEmail = 'admin@locadora.com'
		const hashedPassword = await hash('admin123', 12)
		await db.collection('users').updateOne(
			{ _id: admin._id },
			{
				$set: {
					email: newEmail,
					password: hashedPassword,
					updatedAt: new Date()
				}
			}
		)
		admin.email = newEmail
		console.log('✅ Admin atualizado - email:', newEmail)
		// Atualizar tenant owner
		await db.collection('tenants').updateOne(
			{ _id: tenantId },
			{ $set: { 'owner.userId': admin._id, 'owner.name': admin.name, 'owner.email': admin.email } }
		)
		return admin._id
	}

	// Criar admin
	const hashedPassword = await hash('admin123', 12)
	const now = new Date()

	const adminData = {
		tenantId,
		email: 'admin@locadora.com',
		password: hashedPassword,
		name: 'Administrador',
		role: 'admin',
		status: 'active',
		favorites: [],
		createdAt: now,
		updatedAt: now,
	}

	const result = await db.collection('users').insertOne(adminData)
	console.log('✅ Usuário admin criado:', result.insertedId)

	// Atualizar tenant owner
	await db.collection('tenants').updateOne(
		{ _id: tenantId },
		{ $set: { 'owner.userId': result.insertedId, 'owner.name': adminData.name, 'owner.email': adminData.email } }
	)

	return result.insertedId
}

/**
 * Garante que existem settings para o tenant
 */
async function ensureTenantSettings(db: Awaited<ReturnType<typeof getDatabase>>, tenantId: ObjectId) {
	const existing = await db.collection('settings').findOne({ tenantId })

	if (existing) {
		return existing._id
	}

	const now = new Date()
	const settingsData = {
		tenantId,
		...defaultSettings,
		createdAt: now,
		updatedAt: now,
	}

	const result = await db.collection('settings').insertOne(settingsData)
	console.log('✅ Settings criados para tenant')

	return result.insertedId
}

/**
 * Migra documentos existentes para multi-tenancy
 */
async function migrateExistingData(db: Awaited<ReturnType<typeof getDatabase>>, tenantId: ObjectId) {
	const collections = ['users', 'cars', 'bookings', 'payments', 'reviews', 'notifications']

	for (const collectionName of collections) {
		const result = await db.collection(collectionName).updateMany(
			{ tenantId: { $exists: false } },
			{ $set: { tenantId } }
		)

		if (result.modifiedCount > 0) {
			console.log(`✅ ${result.modifiedCount} documentos migrados em ${collectionName}`)
		}
	}
}

/**
 * Cria índices necessários para multi-tenancy
 */
async function ensureIndexes(db: Awaited<ReturnType<typeof getDatabase>>) {
	try {
		// Tenants
		await db.collection('tenants').createIndex({ slug: 1 }, { unique: true })
		await db.collection('tenants').createIndex({ 'domains.primary': 1 })
		await db.collection('tenants').createIndex({ 'domains.custom': 1 })

		// Users - email único por tenant
		await db.collection('users').createIndex({ email: 1, tenantId: 1 }, { unique: true })
		await db.collection('users').createIndex({ tenantId: 1 })

		// Cars
		await db.collection('cars').createIndex({ tenantId: 1 })
		await db.collection('cars').createIndex({ tenantId: 1, status: 1 })

		// Bookings
		await db.collection('bookings').createIndex({ tenantId: 1 })
		await db.collection('bookings').createIndex({ tenantId: 1, userId: 1 })

		// Settings
		await db.collection('settings').createIndex({ tenantId: 1 }, { unique: true })

		console.log('✅ Índices criados')
	} catch (error) {
		// Índices podem já existir, ignorar erro
		console.log('⚠️ Alguns índices já existiam')
	}
}

export async function POST(request: NextRequest) {
	try {
		const db = await getDatabase()

		// 1. Resolver tenant pelo hostname da requisição, senão usar default
		const hostname = request.headers.get('host')?.split(':')[0].toLowerCase() || 'localhost'
		const baseDomain = process.env.BASE_DOMAIN || 'localhost'

		let tenantSlug: string | null = null
		if (hostname.endsWith(`.${baseDomain}`)) {
			tenantSlug = hostname.replace(`.${baseDomain}`, '')
		}

		const existingTenant = await db.collection('tenants').findOne({
			$or: [
				{ 'domains.primary': hostname },
				{ 'domains.custom': hostname },
				...(tenantSlug ? [{ slug: tenantSlug }] : []),
			],
			status: 'active',
		})

		let tenantObjectId: ObjectId
		if (existingTenant) {
			tenantObjectId = existingTenant._id instanceof ObjectId ? existingTenant._id : new ObjectId(existingTenant._id)
		} else {
			const tenantId = await ensureDefaultTenant(db)
			tenantObjectId = tenantId instanceof ObjectId ? tenantId : new ObjectId(tenantId)
		}

		// 2. Garantir super_admin existe (sem tenant)
		await ensureSuperAdmin(db)

		// 3. Garantir admin existe
		await ensureAdminUser(db, tenantObjectId)

		// 4. Garantir settings existem
		await ensureTenantSettings(db, tenantObjectId)

		// 5. Migrar dados existentes
		await migrateExistingData(db, tenantObjectId)

		// 6. Criar índices
		await ensureIndexes(db)

		// 7. Verificar se já tem carros
		const existingCars = await db.collection('cars').countDocuments({ tenantId: tenantObjectId })

		if (existingCars > 0) {
			return NextResponse.json({
				message: 'Setup completo! Database já tem carros.',
				tenant: tenantObjectId.toString(),
				carsCount: existingCars,
				credentials: {
					admin: {
						email: 'admin@locadora.com',
						password: 'admin123',
						description: 'Admin do tenant - acessa /admin',
					},
					superAdmin: {
						email: 'super@admin.com',
						password: 'super123',
						description: 'Super Admin - acessa /root-wl para gerenciar tenants/DNS',
					}
				}
			})
		}

		// 8. Adicionar carros sample com tenantId
		const carsWithTenant = sampleCars.map(car => ({
			...car,
			tenantId: tenantObjectId,
			createdAt: new Date(),
			updatedAt: new Date(),
		}))

		const result = await db.collection('cars').insertMany(carsWithTenant)

		return NextResponse.json({
			message: 'Setup completo! Carros de exemplo adicionados.',
			tenant: tenantObjectId.toString(),
			carsCount: result.insertedCount,
			credentials: {
				admin: {
					email: 'admin@locadora.com',
					password: 'admin123',
					description: 'Admin do tenant - acessa /admin',
				},
				superAdmin: {
					email: 'super@admin.com',
					password: 'super123',
					description: 'Super Admin - acessa /root-wl para gerenciar tenants/DNS',
				}
			}
		})
	} catch (error) {
		console.error('Error seeding database:', error)
		return NextResponse.json({ error: 'Internal server error', details: String(error) }, { status: 500 })
	}
}

export async function GET(request: NextRequest) {
	return NextResponse.json({
		message: 'Use POST para inicializar o banco com tenant default e carros de exemplo',
		info: {
			creates: [
				'Tenant default para localhost',
				'Usuário admin (admin@locadora.com / admin123)',
				'Settings padrão',
				'6 carros de exemplo',
			],
			migrates: 'Documentos existentes sem tenantId',
		}
	})
}
