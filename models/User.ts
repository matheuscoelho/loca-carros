import { ObjectId } from 'mongodb'

export interface IUser {
	_id?: ObjectId
	email: string
	password: string
	name: string
	phone?: string
	avatar?: string
	role: 'cliente' | 'admin'
	address?: {
		street?: string
		city?: string
		state?: string
		zipCode?: string
		country?: string
	}
	driverLicense?: {
		number?: string
		expiryDate?: Date
		verified: boolean
	}
	favorites: ObjectId[]
	status: 'active' | 'inactive' | 'suspended'
	createdAt: Date
	updatedAt: Date
	lastLogin?: Date
}

export const createUserDefaults = (data: Partial<IUser>): IUser => ({
	email: data.email || '',
	password: data.password || '',
	name: data.name || '',
	phone: data.phone,
	avatar: data.avatar,
	role: data.role || 'cliente',
	address: data.address,
	driverLicense: data.driverLicense,
	favorites: data.favorites || [],
	status: data.status || 'active',
	createdAt: data.createdAt || new Date(),
	updatedAt: data.updatedAt || new Date(),
	lastLogin: data.lastLogin,
})
