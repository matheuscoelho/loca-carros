import { Migration } from './index'

const bannerImages = [
	'/assets/imgs/cars-details/banner.png',
	'/assets/imgs/cars-details/banner2.png',
	'/assets/imgs/cars-details/banner3.png',
	'/assets/imgs/cars-details/banner4.png',
	'/assets/imgs/cars-details/banner5.png',
	'/assets/imgs/cars-details/banner6.png',
	'/assets/imgs/cars-details/banner7.png',
	'/assets/imgs/cars-details/banner8.png',
	'/assets/imgs/cars-details/banner9.png',
	'/assets/imgs/cars-details/banner10.png',
]

const thumbnailImages = [
	'/assets/imgs/page/car/banner-thumn.png',
	'/assets/imgs/page/car/banner-thumn2.png',
	'/assets/imgs/page/car/banner-thumn3.png',
	'/assets/imgs/page/car/banner-thumn4.png',
	'/assets/imgs/page/car/banner-thumn5.png',
	'/assets/imgs/page/car/banner-thumn6.png',
]

export const migration_004_add_multiple_car_images: Migration = {
	name: '004_add_multiple_car_images',
	up: async (db) => {
		const carsCollection = db.collection('cars')
		const cars = await carsCollection.find({}).toArray()

		for (let i = 0; i < cars.length; i++) {
			const car = cars[i]

			// Pular carros que já têm múltiplas imagens
			if (car.images && car.images.length > 1) continue

			// Distribuir imagens diferentes para cada carro
			const offset = i % bannerImages.length
			const images = []
			for (let j = 0; j < 5; j++) {
				const idx = (offset + j) % bannerImages.length
				images.push({
					url: bannerImages[idx],
					isPrimary: j === 0,
				})
			}

			const thumbOffset = i % thumbnailImages.length
			const thumbnails = []
			for (let j = 0; j < 5; j++) {
				const idx = (thumbOffset + j) % thumbnailImages.length
				thumbnails.push(thumbnailImages[idx])
			}

			await carsCollection.updateOne(
				{ _id: car._id },
				{ $set: { images, thumbnails } }
			)
		}

		console.log(`  ${cars.length} carros atualizados com múltiplas imagens.`)
	},
}
