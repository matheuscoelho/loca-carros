import Link from 'next/link'
import { MongoDBCar } from '@/util/useCarFilter'

interface CarCard1Props {
	car: MongoDBCar | any
}

export default function CarCard1({ car }: CarCard1Props) {
	// Extrair dados de forma segura (funciona com MongoDB e dados legados)
	const carId = car._id || car.id
	const carName = car.name || 'Unknown'
	const carBrand = car.brand || ''
	const carModel = car.model || ''
	const carYear = car.year || ''

	// Imagem
	const primaryImage = car.images?.find((img: any) => img.isPrimary)?.url
		|| car.images?.[0]?.url
		|| (car.image ? `/assets/imgs/cars-listing/cars-listing-6/${car.image}` : '/assets/imgs/template/placeholder-car.jpg')

	// Location
	const location = typeof car.location === 'object'
		? `${car.location?.city || ''}, ${car.location?.state || ''}`
		: car.location || 'Location not specified'

	// Preço
	const price = car.pricing?.dailyRate || car.price || 0
	const currency = car.pricing?.currency || 'USD'

	// Specs
	const mileage = car.specs?.mileage || 0
	const transmission = car.transmission || 'Automatic'
	const fuelType = car.fuelType || 'Gasoline'
	const seats = car.specs?.seats || 5

	// Rating
	const rating = car.rating || 0
	const reviewCount = car.reviewCount || 0

	// Link para detalhes - usando ID real do MongoDB
	const detailsLink = carId ? `/cars/${carId}` : '/cars-details-1'

	return (
		<>
			<div className="card-journey-small background-card hover-up">
				<div className="card-image">
					<Link href={detailsLink}>
						<img src={primaryImage} alt={carName} style={{ height: '200px', objectFit: 'cover', width: '100%' }} />
					</Link>
				</div>
				<div className="card-info p-4 pt-30">
					<div className="card-rating">
						<div className="card-left" />
						<div className="card-right">
							<span className="rating text-xs-medium rounded-pill">
								{rating.toFixed(2)} <span className="text-xs-medium neutral-500">({reviewCount} reviews)</span>
							</span>
						</div>
					</div>
					<div className="card-title">
						<Link className="text-lg-bold neutral-1000 text-nowrap" href={detailsLink}>
							{carBrand} {carModel} {carYear}
						</Link>
					</div>
					<div className="card-program">
						<div className="card-location">
							<p className="text-location text-sm-medium neutral-500">{location}</p>
						</div>
						<div className="card-facitlities">
							<p className="card-miles text-md-medium">{mileage.toLocaleString()} miles</p>
							<p className="card-gear text-md-medium">{transmission}</p>
							<p className="card-fuel text-md-medium">{fuelType}</p>
							<p className="card-seat text-md-medium">{seats} seats</p>
						</div>
						<div className="endtime">
							<div className="card-price">
								<h6 className="text-lg-bold neutral-1000">${price.toFixed(2)}</h6>
								<p className="text-md-medium neutral-500">/ day</p>
							</div>
							<div className="card-button">
								<Link className="btn btn-gray" href={detailsLink}>Book Now</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
