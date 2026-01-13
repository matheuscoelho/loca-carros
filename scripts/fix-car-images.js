// Script para corrigir as imagens dos carros no MongoDB
// As imagens corretas são: banner.png até banner5.png (1872x1040 - fotos de carros)
// As imagens banner6.png até banner10.png são ícones pequenos (241x241)

const API_BASE = 'http://localhost:3050'

// Imagens corretas de carros (todas 1872x1040)
const CAR_IMAGES = [
	'/assets/imgs/cars-details/banner.png',
	'/assets/imgs/cars-details/banner2.png',
	'/assets/imgs/cars-details/banner3.png',
	'/assets/imgs/cars-details/banner4.png',
	'/assets/imgs/cars-details/banner5.png',
]

const CAR_THUMBNAILS = [
	'/assets/imgs/page/car/banner-thumn.png',
	'/assets/imgs/page/car/banner-thumn2.png',
	'/assets/imgs/page/car/banner-thumn3.png',
	'/assets/imgs/page/car/banner-thumn4.png',
	'/assets/imgs/page/car/banner-thumn5.png',
	'/assets/imgs/page/car/banner-thumn6.png',
]

async function fixCarImages() {
	try {
		// Buscar todos os carros
		const response = await fetch(`${API_BASE}/api/cars`)
		const data = await response.json()
		const cars = data.cars

		console.log(`Found ${cars.length} cars to update\n`)

		for (let i = 0; i < cars.length; i++) {
			const car = cars[i]

			// Rotacionar as imagens para cada carro ter imagens diferentes
			const imageOffset = i % CAR_IMAGES.length
			const images = CAR_IMAGES.map((url, idx) => ({
				url: CAR_IMAGES[(idx + imageOffset) % CAR_IMAGES.length],
				isPrimary: idx === 0
			}))

			const updateData = {
				images,
				thumbnails: CAR_THUMBNAILS,
			}

			// Atualizar via API
			const updateResponse = await fetch(`${API_BASE}/api/admin/cars/${car._id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(updateData)
			})

			if (updateResponse.ok) {
				console.log(`✅ Updated ${car.brand} ${car.model} - Primary: ${images[0].url}`)
			} else {
				const error = await updateResponse.text()
				console.log(`❌ Failed to update ${car.brand} ${car.model}: ${error}`)
			}
		}

		console.log('\n✅ All cars updated!')
	} catch (error) {
		console.error('Error:', error)
	}
}

fixCarImages()
