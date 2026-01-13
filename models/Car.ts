import { ObjectId } from 'mongodb'

export type CarType = 'Sedans' | 'SUVs' | 'Hatchbacks' | 'Coupes' | 'Convertibles' | 'Minivans' | 'Pickup Trucks' | 'Luxury' | 'Sports' | 'Electric'
export type FuelType = 'Gasoline' | 'Diesel' | 'Electric' | 'Hybrid' | 'Plug-in Hybrid'
export type TransmissionType = 'Automatic' | 'Manual'

export interface ICar {
	_id?: ObjectId
	name: string
	brand: string
	model: string
	year: number
	licensePlate: string
	carType: CarType
	fuelType: FuelType
	transmission: TransmissionType
	specs: {
		seats: number
		doors: number
		bags: number
		mileage: number
	}
	pricing: {
		dailyRate: number
		weeklyRate?: number
		deposit: number
		currency: string
	}
	extras: Array<{
		name: string
		price: number
	}>
	amenities: string[]
	images: Array<{
		url: string
		isPrimary: boolean
	}>
	location: {
		city: string
		state: string
		country: string
	}
	availability: {
		isAvailable: boolean
		unavailableDates: Date[]
	}
	rating: number
	reviewCount: number
	totalBookings: number
	status: 'active' | 'inactive' | 'maintenance'
	createdAt: Date
	updatedAt: Date
}

export const createCarDefaults = (data: Partial<ICar>): ICar => ({
	name: data.name || '',
	brand: data.brand || '',
	model: data.model || '',
	year: data.year || new Date().getFullYear(),
	licensePlate: data.licensePlate || '',
	carType: data.carType || 'Sedans',
	fuelType: data.fuelType || 'Gasoline',
	transmission: data.transmission || 'Automatic',
	specs: data.specs || {
		seats: 5,
		doors: 4,
		bags: 2,
		mileage: 0,
	},
	pricing: data.pricing || {
		dailyRate: 0,
		deposit: 0,
		currency: 'USD',
	},
	extras: data.extras || [],
	amenities: data.amenities || [],
	images: data.images || [],
	location: data.location || {
		city: '',
		state: '',
		country: '',
	},
	availability: data.availability || {
		isAvailable: true,
		unavailableDates: [],
	},
	rating: data.rating || 0,
	reviewCount: data.reviewCount || 0,
	totalBookings: data.totalBookings || 0,
	status: data.status || 'active',
	createdAt: data.createdAt || new Date(),
	updatedAt: data.updatedAt || new Date(),
})
