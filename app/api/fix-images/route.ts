import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// Imagens corretas de carros (banner5.png é paisagem, não usar!)
const CAR_IMAGES = [
	'/assets/imgs/cars-details/banner.png',   // Lexus SUV
	'/assets/imgs/cars-details/banner2.png',  // SUV lateral
	'/assets/imgs/cars-details/banner3.png',  // Hyundai sedan
	'/assets/imgs/cars-details/banner4.png',  // Lamborghini SUV branco
]

const CAR_THUMBNAILS = [
	'/assets/imgs/page/car/banner-thumn.png',
	'/assets/imgs/page/car/banner-thumn2.png',
	'/assets/imgs/page/car/banner-thumn3.png',
	'/assets/imgs/page/car/banner-thumn4.png',
	'/assets/imgs/page/car/banner-thumn5.png',
	'/assets/imgs/page/car/banner-thumn6.png',
]

export async function POST(request: NextRequest) {
	try {
		const client = await clientPromise
		const db = client.db(process.env.MONGODB_DB)

		const cars = await db.collection('cars').find({}).toArray()

		const results = []

		for (let i = 0; i < cars.length; i++) {
			const car = cars[i]

			// Rotacionar as imagens para cada carro ter imagens diferentes
			const imageOffset = i % CAR_IMAGES.length
			const images = CAR_IMAGES.map((url, idx) => ({
				url: CAR_IMAGES[(idx + imageOffset) % CAR_IMAGES.length],
				isPrimary: idx === 0
			}))

			await db.collection('cars').updateOne(
				{ _id: car._id },
				{
					$set: {
						images,
						thumbnails: CAR_THUMBNAILS,
						updatedAt: new Date(),
					}
				}
			)

			results.push({
				brand: car.brand,
				model: car.model,
				primaryImage: images[0].url,
			})
		}

		return NextResponse.json({
			message: 'All cars updated',
			count: results.length,
			results,
		})
	} catch (error) {
		console.error('Error fixing images:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}
