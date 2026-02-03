import Link from 'next/link'
import { MongoDBCar } from '@/util/useCarFilter'
import FavoriteButton from '@/components/elements/FavoriteButton'

interface CarCard3Props {
	car: MongoDBCar | any
}

export default function CarCard3({ car }: CarCard3Props) {
	// Extrair dados de forma segura (funciona com MongoDB e dados legados)
	const carId = car._id || car.id
	const carName = car.name || 'Unknown'
	const carBrand = car.brand || ''
	const carModel = car.model || ''
	const carYear = car.year || ''

	// Imagem
	const primaryImage = car.images?.find((img: any) => img.isPrimary)?.url
		|| car.images?.[0]?.url
		|| (car.image ? `/assets/imgs/page/car/${car.image}` : '/assets/imgs/template/placeholder-car.jpg')

	// Location
	const location = typeof car.location === 'object'
		? `${car.location?.city || ''}, ${car.location?.state || ''}`
		: car.location || 'Location not specified'

	// Preço
	const price = car.pricing?.dailyRate || car.price || 0
	const currency = car.pricing?.currency || 'BRL'
	const currencySymbol = currency === 'BRL' ? 'R$' : '$'

	// Specs
	const mileage = car.specs?.mileage || 0
	const transmission = car.transmission || 'Automatic'
	const fuelType = car.fuelType || 'Gasoline'
	const seats = car.specs?.seats || 5
	const bags = car.specs?.bags || 2
	const carType = car.carType || 'Sedan'

	// Rating
	const rating = car.rating || 0
	const reviewCount = car.reviewCount || 0

	// Link para detalhes - usando ID real do MongoDB
	const detailsLink = carId ? `/cars/${carId}` : '/cars-details-1'

	return (
		<>
			<div className="card-flight card-hotel card-property background-card card-hover">
				<div className="card-image img-zoom-container" style={{ position: 'relative' }}>
					<Link href={detailsLink}>
						<img src={primaryImage} alt={carName} className="img-zoom" style={{ height: '250px', objectFit: 'cover', width: '100%' }} />
					</Link>
					{carId && (
						<div style={{ position: 'absolute', top: '10px', right: '10px' }}>
							<FavoriteButton carId={carId} size="sm" />
						</div>
					)}
				</div>
				<div className="card-info">
					<div className="tour-rate">
						<div className="rate-element">
							<span className="rating">{rating.toFixed(2)} <span className="text-sm-medium neutral-500">({reviewCount} reviews)</span></span>
						</div>
					</div>
					<div className="card-title">
						<Link className="heading-6 neutral-1000" href={detailsLink}>
							{carBrand} {carModel} {carYear}
						</Link>
					</div>
					<div className="card-program">
						<div className="card-location mb-25">
							<p className="text-location text-md-medium neutral-500">{location}</p>
						</div>
						<div className="card-facilities">
							<div className="item-facilities">
								<p className="room text-md-medium neutral-1000">{mileage > 0 ? `${mileage.toLocaleString()} miles` : 'Unlimited mileage'}</p>
							</div>
							<div className="item-facilities">
								<p className="size text-md-medium neutral-1000">{transmission}</p>
							</div>
							<div className="item-facilities">
								<p className="parking text-md-medium neutral-1000">{bags} bags</p>
							</div>
							<div className="item-facilities">
								<p className="bed text-md-medium neutral-1000">{fuelType}</p>
							</div>
							<div className="item-facilities">
								<p className="bathroom text-md-medium neutral-1000">{seats} seats</p>
							</div>
							<div className="item-facilities">
								<p className="pet text-md-medium neutral-1000">{carType}</p>
							</div>
						</div>
						<div className="endtime">
							<div className="card-price">
								<p className="text-md-medium neutral-500 mr-5">From</p>
								<h6 className="heading-6 neutral-1000">{currencySymbol} {price.toFixed(2)}</h6>
								<p className="text-md-medium neutral-500">/ day</p>
							</div>
							<div className="card-button">
								<Link className="btn btn-gray btn-press" href={detailsLink}>Book Now</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
