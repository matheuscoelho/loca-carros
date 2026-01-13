import { ObjectId } from 'mongodb'

export type ReviewStatus = 'pending' | 'approved' | 'rejected'

export interface IReview {
	_id?: ObjectId
	userId: ObjectId
	carId: ObjectId
	bookingId: ObjectId
	rating: number // 1-5
	ratings?: {
		price?: number
		service?: number
		safety?: number
		comfort?: number
		cleanliness?: number
	}
	title?: string
	comment: string
	status: ReviewStatus
	response?: {
		text: string
		respondedAt: Date
		respondedBy: ObjectId
	}
	helpful?: {
		count: number
		users: ObjectId[]
	}
	createdAt: Date
	updatedAt: Date
}

export const createReviewDefaults = (data: Partial<IReview>): IReview => ({
	userId: data.userId || new ObjectId(),
	carId: data.carId || new ObjectId(),
	bookingId: data.bookingId || new ObjectId(),
	rating: Math.min(5, Math.max(1, data.rating || 5)),
	ratings: data.ratings,
	title: data.title,
	comment: data.comment || '',
	status: data.status || 'pending',
	response: data.response,
	helpful: data.helpful || {
		count: 0,
		users: [],
	},
	createdAt: data.createdAt || new Date(),
	updatedAt: data.updatedAt || new Date(),
})

// Calculate average rating from individual ratings
export const calculateAverageRating = (ratings: IReview['ratings']): number => {
	if (!ratings) return 0

	const values = Object.values(ratings).filter(v => v !== undefined) as number[]
	if (values.length === 0) return 0

	const sum = values.reduce((acc, val) => acc + val, 0)
	return Math.round((sum / values.length) * 10) / 10
}
