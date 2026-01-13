'use client'
import { useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from "swiper/react"
import Link from "next/link"
import { swiperGroup3 } from '@/util/swiperOptions'
import { useTranslations } from 'next-intl'

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

export default function CarsListing1() {
	const t = useTranslations('vehicles')
	const tc = useTranslations('common')
	const [cars, setCars] = useState<Car[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		fetchCars()
	}, [])

	const fetchCars = async () => {
		try {
			const response = await fetch('/api/cars?limit=6')
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

	// Group cars in pairs for the swiper
	const carPairs: Car[][] = []
	for (let i = 0; i < cars.length; i += 2) {
		carPairs.push(cars.slice(i, i + 2))
	}

	return (
		<>
			<section className="section-box box-flights background-body">
				<div className="container">
					<div className="row align-items-end">
						<div className="col-md-9 wow fadeInUp">
							<h3 className="title-svg neutral-1000 mb-5">{t('mostSearched')}</h3>
							<p className="text-lg-medium text-bold neutral-500">{t('worldLeadingBrands')}</p>
						</div>
						<div className="col-md-3 position-relative mb-30 wow fadeInUp">
							<div className="box-button-slider box-button-slider-team justify-content-end">
								<div className="swiper-button-prev swiper-button-prev-style-1 swiper-button-prev-2">
									<svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16" fill="none">
										<path d="M7.99992 3.33325L3.33325 7.99992M3.33325 7.99992L7.99992 12.6666M3.33325 7.99992H12.6666" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
									</svg>
								</div>
								<div className="swiper-button-next swiper-button-next-style-1 swiper-button-next-2">
									<svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16" fill="none">
										<path d="M7.99992 12.6666L12.6666 7.99992L7.99992 3.33325M12.6666 7.99992L3.33325 7.99992" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
									</svg>
								</div>
							</div>
						</div>
					</div>
					<div className="block-flights wow fadeInUp">
						<div className="box-swiper mt-30">
							{loading ? (
								<div className="text-center py-5">
									<div className="spinner-border text-primary" role="status">
										<span className="visually-hidden">{tc('loading')}</span>
									</div>
								</div>
							) : cars.length === 0 ? (
								<div className="text-center py-5">
									<p className="text-muted">{t('noVehiclesAvailable')}</p>
								</div>
							) : (
								<Swiper {...swiperGroup3} className="swiper-container swiper-group-3 swiper-group-journey">
									<div className="swiper-wrapper">
										{carPairs.map((pair, pairIndex) => (
											<SwiperSlide key={pairIndex}>
												{pair.map((car) => (
													<div key={car._id} className="card-journey-small background-card hover-up">
														<div className="card-image" style={{ height: '200px', overflow: 'hidden' }}>
															<Link href={`/cars/${car._id}`}>
																<img src={getCarImage(car)} alt={`${car.brand} ${car.model}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
															</Link>
														</div>
														<div className="card-info">
															<div className="card-rating">
																<div className="card-left" />
																<div className="card-right">
																	<span className="rating">{car.rating?.toFixed(2) || '4.50'} <span className="text-sm-medium neutral-500">({car.reviewCount || 0} {t('reviews')})</span></span>
																</div>
															</div>
															<div className="card-title">
																<Link className="heading-6 neutral-1000" href={`/cars/${car._id}`}>
																	{car.brand} {car.model}
																</Link>
															</div>
															<div className="card-program">
																<div className="card-location">
																	<p className="text-location text-md-medium neutral-500">{getLocation(car)}</p>
																</div>
																<div className="card-facitlities">
																	<p className="card-miles text-md-medium">{car.specs?.mileage?.toLocaleString() || 0} {t('miles')}</p>
																	<p className="card-gear text-md-medium">{car.transmission || 'Automatic'}</p>
																	<p className="card-fuel text-md-medium">{car.fuelType || 'Gasoline'}</p>
																	<p className="card-seat text-md-medium">{car.specs?.seats || 5} {t('seats')}</p>
																</div>
																<div className="endtime">
																	<div className="card-price">
																		<p className="text-md-medium neutral-500 me-2">{t('from')}</p>
																		<h6 className="heading-6 neutral-1000">${car.pricing?.dailyRate?.toFixed(2) || '0.00'}</h6>
																	</div>
																	<div className="card-button">
																		<Link className="btn btn-gray" href={`/cars/${car._id}`}>{t('bookNow')}</Link>
																	</div>
																</div>
															</div>
														</div>
													</div>
												))}
											</SwiperSlide>
										))}
									</div>
								</Swiper>
							)}
						</div>
					</div>
					<div className="d-flex justify-content-center">
						<Link className="btn btn-brand-2 text-nowrap wow fadeInUp" href="/cars-list-1">
							<svg className="me-2" xmlns="http://www.w3.org/2000/svg" width={19} height={18} viewBox="0 0 19 18" fill="none">
								<g clipPath="url(#clip0_117_4717)">
									<path d="M4.4024 14.0977C1.60418 11.2899 1.60418 6.71576 4.4024 3.90794L5.89511 5.40064V0.90332H1.39779L3.13528 2.64081C-0.378102 6.1494 -0.378102 11.8562 3.13528 15.3696C5.35275 17.5823 8.43896 18.403 11.2996 17.8175V15.9648C8.91413 16.584 6.26949 15.9648 4.4024 14.0977Z" fill="#101010" />
									<path d="M15.864 2.64036C13.6465 0.418093 10.5603 -0.402657 7.69971 0.182907V2.03559C10.0852 1.41643 12.7346 2.04519 14.5969 3.90748C17.4047 6.71531 17.4047 11.2894 14.5969 14.0973L13.1042 12.6045V17.1067H17.6063L15.8688 15.3692C19.3774 11.8558 19.3774 6.14894 15.864 2.64036Z" fill="#101010" />
								</g>
								<defs>
									<clipPath id="clip0_117_4717">
										<rect width={18} height={18} fill="white" transform="translate(0.5)" />
									</clipPath>
								</defs>
							</svg>
							{t('loadMoreCars')}
						</Link>
					</div>
				</div>
			</section>
		</>
	)
}
