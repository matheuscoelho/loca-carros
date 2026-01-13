'use client'
import { useState, useEffect } from 'react'
import Link from "next/link"

interface Car {
	_id: string
	name: string
	brand: string
	model: string
	year: number
	pricing: {
		dailyRate: number
		currency: string
	}
	specs: {
		seats: number
		mileage: number
	}
	location: {
		city: string
		state: string
		country: string
	}
	images: Array<{
		url: string
		isPrimary: boolean
	}>
	transmission: string
	fuelType: string
	rating: number
	reviewCount: number
}

export default function CarsListing2() {
	const [cars, setCars] = useState<Car[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		fetchCars()
	}, [])

	const fetchCars = async () => {
		try {
			const response = await fetch('/api/cars?limit=4')
			if (response.ok) {
				const data = await response.json()
				setCars(data.cars || [])
			}
		} catch (err) {
			console.error('Error fetching cars:', err)
		} finally {
			setLoading(false)
		}
	}

	const getCarImage = (car: Car) => {
		const primary = car.images?.find(img => img.isPrimary)
		return primary?.url || car.images?.[0]?.url || '/assets/imgs/template/placeholder-car.jpg'
	}

	const getLocation = (car: Car) => {
		const parts = [car.location?.city, car.location?.state].filter(Boolean)
		return parts.join(', ') || 'Location TBD'
	}

	return (
		<>
			<section className="section-box box-flights background-body">
				<div className="container">
					<div className="row align-items-end mb-10">
						<div className="col-md-8">
							<h3 className="neutral-1000 wow fadeInUp">Featured Listings</h3>
							<p className="text-lg-medium neutral-500 wow fadeInUp">Find the perfect ride for any occasion</p>
						</div>
						<div className="col-md-4 mt-md-0 mt-4">
							<div className="d-flex justify-content-end">
								<Link className="btn btn-primary wow fadeInUp" href="/cars-list-1">
									View More
									<svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M8 15L15 8L8 1M15 8L1 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
									</svg>
								</Link>
							</div>
						</div>
					</div>
					<div className="row pt-30">
						{loading ? (
							<div className="col-12 text-center py-5">
								<div className="spinner-border text-primary" role="status">
									<span className="visually-hidden">Loading...</span>
								</div>
							</div>
						) : cars.length === 0 ? (
							<div className="col-12 text-center py-5">
								<p className="text-muted">No vehicles available</p>
							</div>
						) : (
							cars.map((car, index) => (
								<div key={car._id} className="col-lg-3 col-md-6 wow fadeIn" data-wow-delay={`${0.1 * (index + 1)}s`}>
									<div className="card-journey-small background-card hover-up">
										<div className="card-image" style={{ height: '200px', overflow: 'hidden' }}>
											<Link href={`/cars/${car._id}`}>
												<img src={getCarImage(car)} alt={`${car.brand} ${car.model}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
											</Link>
										</div>
										<div className="card-info p-4 pt-30">
											<div className="card-rating">
												<div className="card-left" />
												<div className="card-right">
													<span className="rating text-xs-medium py-1 rounded-pill">
														{car.rating?.toFixed(2) || '4.50'} <span className="text-xs-medium neutral-500">({car.reviewCount || 0} reviews)</span>
													</span>
												</div>
											</div>
											<div className="card-title">
												<Link className="text-lg-bold neutral-1000 text-nowrap" href={`/cars/${car._id}`}>
													{car.brand} {car.model}
												</Link>
											</div>
											<div className="card-program">
												<div className="card-location">
													<p className="text-location text-sm-medium neutral-500">{getLocation(car)}</p>
												</div>
												<div className="card-facitlities">
													<p className="card-miles text-md-medium">{car.specs?.mileage?.toLocaleString() || 0} miles</p>
													<p className="card-gear text-md-medium">{car.transmission || 'Automatic'}</p>
													<p className="card-fuel text-md-medium">{car.fuelType || 'Gasoline'}</p>
													<p className="card-seat text-md-medium">{car.specs?.seats || 5} seats</p>
												</div>
												<div className="endtime">
													<div className="card-price">
														<h6 className="text-lg-bold neutral-1000">${car.pricing?.dailyRate?.toFixed(2) || '0.00'}</h6>
														<p className="text-md-medium neutral-500" />
													</div>
													<div className="card-button">
														<Link className="btn btn-gray" href={`/cars/${car._id}`}>Book Now</Link>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							))
						)}
					</div>
				</div>
			</section>
		</>
	)
}
