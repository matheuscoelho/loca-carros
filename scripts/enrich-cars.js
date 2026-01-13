// Script para enriquecer os dados dos carros no MongoDB
const { MongoClient, ObjectId } = require('mongodb')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://admin:2e6fNVDHOmjD2uyZ@cluster0.vn5xy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
const MONGODB_DB = process.env.MONGODB_DB || 'test'

// Dados enriquecidos para cada carro
const enrichedCarsData = [
	{
		licensePlate: 'CAR-001',
		name: 'BMW 3 Series 2024 - Luxury Sport Sedan in Elegant Black',
		description: `Experience the perfect blend of luxury and performance with the BMW 3 Series. This stunning sedan features a turbocharged engine that delivers exhilarating acceleration while maintaining impressive fuel efficiency.

The interior showcases BMW's commitment to craftsmanship with premium leather seats, ambient lighting, and the latest iDrive infotainment system. Whether you're commuting to work or taking a weekend road trip, the 3 Series provides unmatched comfort and driving pleasure.

With its athletic stance, distinctive kidney grille, and LED headlights, this BMW turns heads wherever it goes. The advanced driver assistance features ensure a safe and confident driving experience on any road.`,
		images: [
			{ url: '/assets/imgs/cars-details/banner.png', isPrimary: true },
			{ url: '/assets/imgs/cars-details/banner2.png', isPrimary: false },
			{ url: '/assets/imgs/cars-details/banner3.png', isPrimary: false },
			{ url: '/assets/imgs/cars-details/banner4.png', isPrimary: false },
			{ url: '/assets/imgs/cars-details/banner5.png', isPrimary: false },
		],
		thumbnails: [
			'/assets/imgs/page/car/banner-thumn.png',
			'/assets/imgs/page/car/banner-thumn2.png',
			'/assets/imgs/page/car/banner-thumn3.png',
			'/assets/imgs/page/car/banner-thumn4.png',
			'/assets/imgs/page/car/banner-thumn5.png',
			'/assets/imgs/page/car/banner-thumn6.png',
		],
		fleetCode: 'BMW-3001',
		includedInPrice: [
			'Free cancellation up to 48 hours before pick-up',
			'Collision Damage Waiver with $700 deductible',
			'Theft Protection included',
			'Unlimited mileage',
			'24/7 Roadside Assistance',
			'Basic insurance coverage',
		],
		faq: [
			{
				question: 'What documents do I need to rent this vehicle?',
				answer: 'You will need a valid driver\'s license, a credit card in your name, and proof of insurance. International renters may need an International Driving Permit.',
			},
			{
				question: 'Is there an age requirement?',
				answer: 'Renters must be at least 25 years old. Drivers under 25 may rent with an additional young driver surcharge.',
			},
			{
				question: 'Can I take this car out of state?',
				answer: 'Yes, you can drive this vehicle to any state within the continental US. Please notify us if you plan to travel out of state.',
			},
		],
		reviews: [
			{
				author: 'Michael Thompson',
				avatar: '/assets/imgs/page/tour-detail/avatar.png',
				date: '2026-01-10',
				rating: 5,
				comment: 'Amazing car! The BMW 3 Series exceeded all my expectations. The handling was superb and the interior was incredibly comfortable. Will definitely rent again!',
			},
			{
				author: 'Sarah Williams',
				avatar: '/assets/imgs/page/tour-detail/avatar.png',
				date: '2026-01-05',
				rating: 5,
				comment: 'Perfect for my business trip. The car was spotless and drove like a dream. The pickup process was quick and easy.',
			},
			{
				author: 'David Chen',
				avatar: '/assets/imgs/page/tour-detail/avatar.png',
				date: '2025-12-28',
				rating: 4,
				comment: 'Great car overall. Very responsive and fuel-efficient. The only minor issue was finding parking due to its size, but that\'s not the car\'s fault!',
			},
		],
		ratings: {
			overall: 4.8,
			price: 4.5,
			service: 4.9,
			safety: 5.0,
			comfort: 4.8,
			cleanliness: 4.9,
		},
		dealer: {
			name: 'Premium Auto Rentals',
			phone: '1-800-555-0101',
			email: 'contact@premiumauto.com',
			whatsapp: '1-800-555-0101',
			location: 'New York, NY',
		},
	},
	{
		licensePlate: 'CAR-002',
		name: 'Mercedes-Benz GLE 2024 - Premium Family SUV with Third Row',
		description: `The Mercedes-Benz GLE represents the pinnacle of luxury SUV design. This spacious vehicle comfortably seats seven passengers while delivering the refined driving experience Mercedes is known for.

Powered by a sophisticated hybrid powertrain, the GLE offers both impressive performance and excellent fuel economy. The interior features the MBUX infotainment system with voice control, wireless charging, and a stunning panoramic sunroof that fills the cabin with natural light.

Perfect for family vacations or executive transportation, the GLE provides ample cargo space without compromising on style. Advanced safety features including adaptive cruise control and lane-keeping assist make every journey safer and more relaxed.`,
		images: [
			{ url: '/assets/imgs/cars-details/banner6.png', isPrimary: true },
			{ url: '/assets/imgs/cars-details/banner7.png', isPrimary: false },
			{ url: '/assets/imgs/cars-details/banner8.png', isPrimary: false },
			{ url: '/assets/imgs/cars-details/banner9.png', isPrimary: false },
			{ url: '/assets/imgs/cars-details/banner10.png', isPrimary: false },
		],
		thumbnails: [
			'/assets/imgs/page/car/banner-thumn.png',
			'/assets/imgs/page/car/banner-thumn2.png',
			'/assets/imgs/page/car/banner-thumn3.png',
			'/assets/imgs/page/car/banner-thumn4.png',
			'/assets/imgs/page/car/banner-thumn5.png',
			'/assets/imgs/page/car/banner-thumn6.png',
		],
		fleetCode: 'MBZ-2002',
		includedInPrice: [
			'Free cancellation up to 48 hours before pick-up',
			'Full Collision Damage Waiver included',
			'Theft Protection with zero deductible',
			'Unlimited mileage',
			'Third-party liability coverage',
			'24/7 Roadside Assistance',
			'Free airport pickup available',
		],
		faq: [
			{
				question: 'How many passengers can this SUV accommodate?',
				answer: 'The GLE features seating for up to 7 passengers with its optional third-row seating. The second and third rows can be folded for additional cargo space.',
			},
			{
				question: 'Is the third row suitable for adults?',
				answer: 'The third row is best suited for children or shorter adults. For maximum comfort during long trips, we recommend using it for passengers under 5\'6".',
			},
			{
				question: 'What is the cargo capacity?',
				answer: 'With all seats up, you have 12.6 cubic feet of cargo space. With the third row folded, this expands to 43.9 cubic feet, and with both rows down, you get 80.3 cubic feet.',
			},
		],
		reviews: [
			{
				author: 'Jennifer Martinez',
				avatar: '/assets/imgs/page/tour-detail/avatar.png',
				date: '2026-01-12',
				rating: 5,
				comment: 'Perfect family car! We took a road trip with our kids and everyone was comfortable. The entertainment system kept the kids happy for hours.',
			},
			{
				author: 'Robert Johnson',
				avatar: '/assets/imgs/page/tour-detail/avatar.png',
				date: '2026-01-08',
				rating: 5,
				comment: 'Exceptional SUV. The hybrid system is incredibly smooth, and the interior quality is top-notch. Highly recommended for anyone needing space and luxury.',
			},
			{
				author: 'Amanda Lee',
				avatar: '/assets/imgs/page/tour-detail/avatar.png',
				date: '2025-12-30',
				rating: 4,
				comment: 'Beautiful vehicle with great features. The panoramic roof was a hit with everyone. Only gave 4 stars because parking can be challenging due to its size.',
			},
		],
		ratings: {
			overall: 4.9,
			price: 4.3,
			service: 5.0,
			safety: 5.0,
			comfort: 5.0,
			cleanliness: 4.8,
		},
		dealer: {
			name: 'Luxury Motors LA',
			phone: '1-800-555-0202',
			email: 'rentals@luxurymotorsla.com',
			whatsapp: '1-800-555-0202',
			location: 'Los Angeles, CA',
		},
	},
	{
		licensePlate: 'CAR-003',
		name: 'Tesla Model 3 2024 - Long Range Electric Sedan with Autopilot',
		description: `Welcome to the future of driving with the Tesla Model 3. This all-electric sedan combines cutting-edge technology with impressive performance, delivering an unparalleled driving experience that's also environmentally conscious.

With a range of over 350 miles on a single charge, range anxiety is a thing of the past. The minimalist interior features a stunning 15-inch touchscreen that controls everything from climate to entertainment, while over-the-air updates ensure your car keeps getting better.

Experience instant torque from the dual-motor all-wheel drive system, taking you from 0 to 60 mph in just 4.2 seconds. The Autopilot system provides semi-autonomous driving capabilities, making highway driving safer and less stressful.`,
		images: [
			{ url: '/assets/imgs/cars-details/banner3.png', isPrimary: true },
			{ url: '/assets/imgs/cars-details/banner4.png', isPrimary: false },
			{ url: '/assets/imgs/cars-details/banner5.png', isPrimary: false },
			{ url: '/assets/imgs/cars-details/banner.png', isPrimary: false },
			{ url: '/assets/imgs/cars-details/banner2.png', isPrimary: false },
		],
		thumbnails: [
			'/assets/imgs/page/car/banner-thumn3.png',
			'/assets/imgs/page/car/banner-thumn4.png',
			'/assets/imgs/page/car/banner-thumn5.png',
			'/assets/imgs/page/car/banner-thumn.png',
			'/assets/imgs/page/car/banner-thumn2.png',
			'/assets/imgs/page/car/banner-thumn6.png',
		],
		fleetCode: 'TSL-3003',
		includedInPrice: [
			'Free cancellation up to 48 hours before pick-up',
			'Collision Damage Waiver included',
			'Free Supercharger credits (100 miles)',
			'Unlimited mileage',
			'Mobile charging adapter included',
			'24/7 Roadside Assistance',
			'Tesla app access for remote features',
		],
		faq: [
			{
				question: 'How do I charge the Tesla?',
				answer: 'You can charge at any Tesla Supercharger station, or use the included mobile connector at any standard outlet. We also provide a list of charging stations near your destination.',
			},
			{
				question: 'What is the range on a full charge?',
				answer: 'The Model 3 Long Range has an EPA-estimated range of 358 miles. Actual range may vary based on driving conditions, speed, and climate control usage.',
			},
			{
				question: 'How does Autopilot work?',
				answer: 'Autopilot enables your car to steer, accelerate, and brake automatically within its lane. You must keep your hands on the wheel and remain attentive at all times.',
			},
		],
		reviews: [
			{
				author: 'Tech Enthusiast Alex',
				avatar: '/assets/imgs/page/tour-detail/avatar.png',
				date: '2026-01-11',
				rating: 5,
				comment: 'Mind-blowing experience! The acceleration is insane, and the technology is years ahead of any other car I\'ve driven. The Supercharger network made our trip hassle-free.',
			},
			{
				author: 'Emily Richardson',
				avatar: '/assets/imgs/page/tour-detail/avatar.png',
				date: '2026-01-06',
				rating: 5,
				comment: 'My first time driving an electric car, and I\'m converted! So quiet, so smooth, and the big screen is amazing. Autopilot on the highway was a game-changer.',
			},
			{
				author: 'James Wilson',
				avatar: '/assets/imgs/page/tour-detail/avatar.png',
				date: '2025-12-25',
				rating: 5,
				comment: 'Best rental decision ever. Saved money on gas and had the most fun driving experience. The over-the-air update during my rental added new features!',
			},
		],
		ratings: {
			overall: 4.9,
			price: 4.7,
			service: 4.8,
			safety: 5.0,
			comfort: 4.9,
			cleanliness: 5.0,
		},
		dealer: {
			name: 'EV Rentals SF',
			phone: '1-800-555-0303',
			email: 'hello@evrentalssf.com',
			whatsapp: '1-800-555-0303',
			location: 'San Francisco, CA',
		},
	},
	{
		licensePlate: 'CAR-004',
		name: 'Porsche 911 Carrera 2024 - Iconic Sports Car Experience',
		description: `Feel the thrill of driving one of the most iconic sports cars ever made - the Porsche 911 Carrera. This masterpiece of German engineering delivers breathtaking performance with the unmistakable 911 design that has defined sports car aesthetics for over 60 years.

The twin-turbocharged flat-six engine produces 379 horsepower, propelling you from 0 to 60 mph in just 4.0 seconds. The PDK dual-clutch transmission delivers lightning-fast shifts, while the rear-engine layout provides the unique driving dynamics that Porsche is famous for.

Inside, you'll find a perfect blend of luxury and sportiness with premium leather, the latest PCM infotainment system, and that iconic 911 driving position. This is not just a rental - it's an unforgettable experience.`,
		images: [
			{ url: '/assets/imgs/cars-details/banner5.png', isPrimary: true },
			{ url: '/assets/imgs/cars-details/banner.png', isPrimary: false },
			{ url: '/assets/imgs/cars-details/banner2.png', isPrimary: false },
			{ url: '/assets/imgs/cars-details/banner3.png', isPrimary: false },
			{ url: '/assets/imgs/cars-details/banner4.png', isPrimary: false },
		],
		thumbnails: [
			'/assets/imgs/page/car/banner-thumn5.png',
			'/assets/imgs/page/car/banner-thumn.png',
			'/assets/imgs/page/car/banner-thumn2.png',
			'/assets/imgs/page/car/banner-thumn3.png',
			'/assets/imgs/page/car/banner-thumn4.png',
			'/assets/imgs/page/car/banner-thumn6.png',
		],
		fleetCode: 'POR-9004',
		includedInPrice: [
			'Free cancellation up to 72 hours before pick-up',
			'Premium Collision Damage Waiver',
			'Theft Protection with zero deductible',
			'150 miles per day included',
			'Premium insurance coverage',
			'24/7 Concierge Support',
			'Complimentary car wash upon return',
		],
		faq: [
			{
				question: 'What is the mileage limit?',
				answer: '150 miles per day are included. Additional miles are charged at $1.50 per mile. Weekly rentals include 1,000 miles.',
			},
			{
				question: 'What are the age and experience requirements?',
				answer: 'Drivers must be at least 30 years old with a minimum of 5 years driving experience. A clean driving record is required, and we may run a DMV check.',
			},
			{
				question: 'Can I take this car to a track?',
				answer: 'Track use is not permitted under our standard rental agreement. Please contact us for special track day arrangements and additional insurance requirements.',
			},
		],
		reviews: [
			{
				author: 'Luxury Car Lover',
				avatar: '/assets/imgs/page/tour-detail/avatar.png',
				date: '2026-01-09',
				rating: 5,
				comment: 'A dream come true! The 911 is everything I imagined and more. The sound of that flat-six engine is pure music. Worth every penny!',
			},
			{
				author: 'Weekend Racer',
				avatar: '/assets/imgs/page/tour-detail/avatar.png',
				date: '2026-01-02',
				rating: 5,
				comment: 'Rented for my anniversary weekend and it was the highlight of our trip. My wife loved the head-turning attention we got everywhere we went.',
			},
			{
				author: 'Auto Journalist',
				avatar: '/assets/imgs/page/tour-detail/avatar.png',
				date: '2025-12-20',
				rating: 5,
				comment: 'Having driven many sports cars, I can say the 911 is still the benchmark. The handling precision and build quality are unmatched. A true driver\'s car.',
			},
		],
		ratings: {
			overall: 5.0,
			price: 4.2,
			service: 5.0,
			safety: 5.0,
			comfort: 4.7,
			cleanliness: 5.0,
		},
		dealer: {
			name: 'Exotic Dreams Miami',
			phone: '1-800-555-0404',
			email: 'drive@exoticdreams.com',
			whatsapp: '1-800-555-0404',
			location: 'Miami, FL',
		},
	},
	{
		licensePlate: 'CAR-005',
		name: 'Range Rover Sport 2024 - Ultimate Luxury Adventure SUV',
		description: `Command the road in the Range Rover Sport, where uncompromising luxury meets legendary off-road capability. This vehicle represents the pinnacle of SUV design, offering a driving experience that's equally at home on city streets and rugged terrain.

The powerful supercharged V6 engine delivers 395 horsepower while the adaptive air suspension system automatically adjusts to road conditions, ensuring a smooth ride on any surface. The Terrain Response 2 system automatically selects the optimal driving mode for current conditions.

Inside, discover a sanctuary of British craftsmanship with premium Windsor leather, open-pore wood veneers, and the latest Pivi Pro infotainment system. The panoramic glass roof floods the interior with light, making every journey feel special.`,
		images: [
			{ url: '/assets/imgs/cars-details/banner7.png', isPrimary: true },
			{ url: '/assets/imgs/cars-details/banner8.png', isPrimary: false },
			{ url: '/assets/imgs/cars-details/banner9.png', isPrimary: false },
			{ url: '/assets/imgs/cars-details/banner10.png', isPrimary: false },
			{ url: '/assets/imgs/cars-details/banner6.png', isPrimary: false },
		],
		thumbnails: [
			'/assets/imgs/page/car/banner-thumn2.png',
			'/assets/imgs/page/car/banner-thumn3.png',
			'/assets/imgs/page/car/banner-thumn4.png',
			'/assets/imgs/page/car/banner-thumn5.png',
			'/assets/imgs/page/car/banner-thumn6.png',
			'/assets/imgs/page/car/banner-thumn.png',
		],
		fleetCode: 'RRS-5005',
		includedInPrice: [
			'Free cancellation up to 48 hours before pick-up',
			'Comprehensive Collision Damage Waiver',
			'Theft Protection included',
			'Unlimited mileage',
			'Off-road usage permitted',
			'24/7 Global Assistance',
			'Complimentary car detailing',
		],
		faq: [
			{
				question: 'Can I take this vehicle off-road?',
				answer: 'Yes! The Range Rover Sport is fully equipped for off-road adventures. However, please notify us in advance and document vehicle condition before and after off-road use.',
			},
			{
				question: 'What terrain modes are available?',
				answer: 'The Terrain Response 2 system includes modes for: General Driving, Grass/Gravel/Snow, Mud and Ruts, Sand, Rock Crawl, and an Auto mode that selects the best setting automatically.',
			},
			{
				question: 'Is the air suspension adjustable?',
				answer: 'Yes, you can raise or lower the vehicle using the Terrain Response controls. The suspension also automatically lowers at highway speeds for better aerodynamics and fuel efficiency.',
			},
		],
		reviews: [
			{
				author: 'Adventure Seeker',
				avatar: '/assets/imgs/page/tour-detail/avatar.png',
				date: '2026-01-13',
				rating: 5,
				comment: 'Took this beast on a camping trip and it handled everything from highways to forest trails without breaking a sweat. The interior is like a luxury hotel on wheels!',
			},
			{
				author: 'Business Executive',
				avatar: '/assets/imgs/page/tour-detail/avatar.png',
				date: '2026-01-07',
				rating: 5,
				comment: 'Perfect for client meetings and weekend getaways. The presence this vehicle commands is unmatched. Absolutely love the ride quality.',
			},
			{
				author: 'Family Traveler',
				avatar: '/assets/imgs/page/tour-detail/avatar.png',
				date: '2025-12-15',
				rating: 4,
				comment: 'Great family SUV with tons of space. The air suspension made for a very comfortable ride for our long trip. Fuel economy could be better, but that\'s expected for this class.',
			},
		],
		ratings: {
			overall: 4.7,
			price: 4.0,
			service: 4.9,
			safety: 5.0,
			comfort: 5.0,
			cleanliness: 4.8,
		},
		dealer: {
			name: 'British Motors Chicago',
			phone: '1-800-555-0505',
			email: 'rent@britishmotors.com',
			whatsapp: '1-800-555-0505',
			location: 'Chicago, IL',
		},
	},
	{
		licensePlate: 'CAR-006',
		name: 'Toyota Camry Hybrid 2024 - Reliable Efficiency Champion',
		description: `The Toyota Camry Hybrid delivers the perfect balance of comfort, efficiency, and reliability. Ideal for business travel or family trips, this sedan offers an exceptional driving experience while keeping fuel costs to a minimum.

With Toyota's proven hybrid technology, achieve up to 52 MPG combined while enjoying smooth, quiet operation. The 2.5-liter four-cylinder engine paired with two electric motors provides responsive acceleration when you need it.

The spacious interior features Toyota's Safety Sense 2.5+ suite of driver assistance technologies, a 9-inch touchscreen with wireless Apple CarPlay and Android Auto, and comfortable seating for five adults. This is smart, practical transportation at its finest.`,
		images: [
			{ url: '/assets/imgs/cars-details/banner9.png', isPrimary: true },
			{ url: '/assets/imgs/cars-details/banner10.png', isPrimary: false },
			{ url: '/assets/imgs/cars-details/banner6.png', isPrimary: false },
			{ url: '/assets/imgs/cars-details/banner7.png', isPrimary: false },
			{ url: '/assets/imgs/cars-details/banner8.png', isPrimary: false },
		],
		thumbnails: [
			'/assets/imgs/page/car/banner-thumn4.png',
			'/assets/imgs/page/car/banner-thumn5.png',
			'/assets/imgs/page/car/banner-thumn6.png',
			'/assets/imgs/page/car/banner-thumn.png',
			'/assets/imgs/page/car/banner-thumn2.png',
			'/assets/imgs/page/car/banner-thumn3.png',
		],
		fleetCode: 'TOY-6006',
		includedInPrice: [
			'Free cancellation up to 24 hours before pick-up',
			'Basic Collision Damage Waiver',
			'Theft Protection included',
			'Unlimited mileage',
			'Toyota Safety Sense features',
			'24/7 Roadside Assistance',
			'Free additional driver',
		],
		faq: [
			{
				question: 'How does the hybrid system work?',
				answer: 'The Camry Hybrid seamlessly switches between gas and electric power. At low speeds, it often runs on electric power alone. The battery charges automatically through regenerative braking - no plug-in needed!',
			},
			{
				question: 'What is the actual fuel economy?',
				answer: 'Real-world driving typically achieves 48-52 MPG combined. City driving, where the electric motor does more work, often exceeds the EPA estimates.',
			},
			{
				question: 'Is this car suitable for long trips?',
				answer: 'Absolutely! The Camry Hybrid is excellent for long-distance travel. No charging stops needed, comfortable seats, and the excellent fuel economy means fewer gas stops.',
			},
		],
		reviews: [
			{
				author: 'Budget-Conscious Traveler',
				avatar: '/assets/imgs/page/tour-detail/avatar.png',
				date: '2026-01-10',
				rating: 5,
				comment: 'Incredible fuel economy! Drove 500 miles and spent less than $30 on gas. The car is comfortable, quiet, and has all the features I need. Best value rental!',
			},
			{
				author: 'Commuter Pro',
				avatar: '/assets/imgs/page/tour-detail/avatar.png',
				date: '2026-01-04',
				rating: 4,
				comment: 'Reliable and efficient - exactly what I expect from Toyota. Perfect for my business trips. Wish it was a bit sportier, but can\'t argue with the fuel savings.',
			},
			{
				author: 'First-Time Hybrid User',
				avatar: '/assets/imgs/page/tour-detail/avatar.png',
				date: '2025-12-22',
				rating: 5,
				comment: 'Was skeptical about hybrids but this car converted me! So smooth and quiet. The regenerative braking took some getting used to, but now I love it.',
			},
		],
		ratings: {
			overall: 4.6,
			price: 5.0,
			service: 4.7,
			safety: 4.8,
			comfort: 4.5,
			cleanliness: 4.7,
		},
		dealer: {
			name: 'Value Auto Houston',
			phone: '1-800-555-0606',
			email: 'rentals@valueauto.com',
			whatsapp: '1-800-555-0606',
			location: 'Houston, TX',
		},
	},
]

async function enrichCars() {
	const client = new MongoClient(MONGODB_URI)

	try {
		await client.connect()
		console.log('Connected to MongoDB')

		const db = client.db(MONGODB_DB)
		const carsCollection = db.collection('cars')

		for (const carData of enrichedCarsData) {
			const result = await carsCollection.updateOne(
				{ licensePlate: carData.licensePlate },
				{
					$set: {
						name: carData.name,
						description: carData.description,
						images: carData.images,
						thumbnails: carData.thumbnails,
						fleetCode: carData.fleetCode,
						includedInPrice: carData.includedInPrice,
						faq: carData.faq,
						reviews: carData.reviews,
						ratings: carData.ratings,
						dealer: carData.dealer,
						updatedAt: new Date(),
					},
				}
			)

			if (result.modifiedCount > 0) {
				console.log(`Updated: ${carData.licensePlate} - ${carData.name}`)
			} else {
				console.log(`Not found or no changes: ${carData.licensePlate}`)
			}
		}

		console.log('\nAll cars enriched successfully!')
	} catch (error) {
		console.error('Error:', error)
	} finally {
		await client.close()
	}
}

enrichCars()
