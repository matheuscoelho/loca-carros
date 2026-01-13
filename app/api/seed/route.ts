import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

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

export async function POST(request: NextRequest) {
	try {
		const client = await clientPromise
		const db = client.db(process.env.MONGODB_DB)

		// Check if cars already exist
		const existingCars = await db.collection('cars').countDocuments()

		if (existingCars > 0) {
			return NextResponse.json({
				message: 'Database already has cars',
				count: existingCars,
			})
		}

		// Add timestamps
		const carsWithTimestamps = sampleCars.map(car => ({
			...car,
			createdAt: new Date(),
			updatedAt: new Date(),
		}))

		// Insert cars
		const result = await db.collection('cars').insertMany(carsWithTimestamps)

		return NextResponse.json({
			message: 'Sample cars added successfully',
			count: result.insertedCount,
		})
	} catch (error) {
		console.error('Error seeding database:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}

export async function GET(request: NextRequest) {
	return NextResponse.json({
		message: 'Use POST to seed the database with sample cars',
		sampleCount: sampleCars.length,
	})
}
