'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import Layout from "@/components/layout/Layout"
import Link from "next/link"

interface Car {
	_id: string
	name: string
	brand: string
	model: string
	year: number
	licensePlate: string
	carType: string
	fuelType: string
	transmission: string
	specs: {
		seats: number
		doors: number
		bags: number
		mileage: number
	}
	pricing: {
		dailyRate: number
		weeklyRate?: number
		deposit: number
		currency: string
	}
	extras: Array<{
		name: string
		price: number
	}>
	amenities: string[]
	images: Array<{
		url: string
		isPrimary: boolean
	}>
	location: {
		city: string
		state: string
		country: string
	}
	availability: {
		isAvailable: boolean
		unavailableDates: Date[]
	}
	rating: number
	reviewCount: number
	totalBookings: number
	status: string
}

export default function CarDetailsPage({ params }: { params: { id: string } }) {
	const t = useTranslations('vehicles')
	const tCommon = useTranslations('common')
	const router = useRouter()
	const [car, setCar] = useState<Car | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [selectedImage, setSelectedImage] = useState<string>('')
	const [pickupDate, setPickupDate] = useState('')
	const [dropoffDate, setDropoffDate] = useState('')

	useEffect(() => {
		fetchCar()
	}, [params.id])

	const fetchCar = async () => {
		try {
			setLoading(true)
			const response = await fetch(`/api/cars/${params.id}`)
			if (!response.ok) {
				throw new Error('Car not found')
			}
			const data = await response.json()
			setCar(data.car)
			if (data.car?.images?.length > 0) {
				const primary = data.car.images.find((img: any) => img.isPrimary)
				setSelectedImage(primary?.url || data.car.images[0].url)
			}
		} catch (err) {
			console.error('Error fetching car:', err)
			setError('Veículo não encontrado')
		} finally {
			setLoading(false)
		}
	}

	const handleBooking = () => {
		const query = new URLSearchParams()
		if (pickupDate) query.set('pickup', pickupDate)
		if (dropoffDate) query.set('dropoff', dropoffDate)
		router.push(`/booking/${params.id}?${query.toString()}`)
	}

	if (loading) {
		return (
			<Layout footerStyle={1}>
				<div className="container pt-140 pb-170">
					<div className="text-center">
						<div className="spinner-border text-primary" role="status">
							<span className="visually-hidden">{tCommon('loading')}</span>
						</div>
						<p className="mt-3">Carregando detalhes do veículo...</p>
					</div>
				</div>
			</Layout>
		)
	}

	if (error || !car) {
		return (
			<Layout footerStyle={1}>
				<div className="container pt-140 pb-170">
					<div className="text-center">
						<h4>{error || 'Veículo não encontrado'}</h4>
						<Link href="/cars-list-1" className="btn btn-primary mt-3">
							{tCommon('back')}
						</Link>
					</div>
				</div>
			</Layout>
		)
	}

	const minDate = new Date().toISOString().split('T')[0]
	const locationText = `${car.location?.city || ''}, ${car.location?.state || ''}, ${car.location?.country || ''}`

	return (
		<Layout footerStyle={1}>
			{/* Header */}
			<div className="page-header-2 pt-30 background-body">
				<div className="custom-container position-relative mx-auto">
					<div className="bg-overlay rounded-12 overflow-hidden">
						<img className="w-100 h-100 img-fluid img-banner" src="/assets/imgs/page-header/banner6.png" alt="Carento" />
					</div>
					<div className="container position-absolute z-1 top-50 start-50 pb-70 translate-middle text-center">
						<h2 className="text-white mt-4">{car.brand} {car.model}</h2>
						<span className="text-white text-lg-medium">{car.year} - {car.carType}</span>
					</div>
					<div className="background-body position-absolute z-1 top-100 start-50 translate-middle px-3 py-2 rounded-12 border d-flex gap-3 d-none d-md-flex">
						<Link href="/" className="neutral-700 text-md-medium">Home</Link>
						<span><img src="/assets/imgs/template/icons/arrow-right.svg" alt="Carento" /></span>
						<Link href="/cars-list-1" className="neutral-700 text-md-medium">Vehicles</Link>
						<span><img src="/assets/imgs/template/icons/arrow-right.svg" alt="Carento" /></span>
						<span className="neutral-1000 text-md-bold">{car.brand} {car.model}</span>
					</div>
				</div>
			</div>

			{/* Content */}
			<section className="section-box pt-100 pb-50 background-body">
				<div className="container">
					<div className="row">
						{/* Images & Details */}
						<div className="col-lg-8">
							{/* Main Image */}
							<div className="box-gallery mb-4">
								<div className="border rounded-3 overflow-hidden">
									<img
										src={selectedImage || '/assets/imgs/template/placeholder-car.jpg'}
										alt={car.name}
										className="w-100"
										style={{ height: '450px', objectFit: 'cover' }}
									/>
								</div>
								{/* Thumbnails */}
								{car.images && car.images.length > 1 && (
									<div className="d-flex gap-2 mt-3 flex-wrap">
										{car.images.map((img, idx) => (
											<div
												key={idx}
												className={`border rounded-2 overflow-hidden cursor-pointer ${selectedImage === img.url ? 'border-primary border-2' : ''}`}
												style={{ width: '80px', height: '60px', cursor: 'pointer' }}
												onClick={() => setSelectedImage(img.url)}
											>
												<img
													src={img.url}
													alt={`${car.name} ${idx + 1}`}
													className="w-100 h-100"
													style={{ objectFit: 'cover' }}
												/>
											</div>
										))}
									</div>
								)}
							</div>

							{/* Car Details */}
							<div className="border rounded-3 p-4 mb-4">
								<h4 className="mb-4">{car.brand} {car.model} {car.year}</h4>

								{/* Rating */}
								<div className="d-flex align-items-center gap-2 mb-3">
									<span className="badge bg-warning text-dark">
										{car.rating.toFixed(1)} / 5
									</span>
									<span className="text-muted">({car.reviewCount} reviews)</span>
									<span className="text-muted ms-2">| {car.totalBookings} bookings</span>
								</div>

								{/* Location */}
								<p className="text-muted mb-4">
									<i className="bi bi-geo-alt me-2"></i>
									{locationText}
								</p>

								{/* Specs Grid */}
								<div className="row g-3 mb-4">
									<div className="col-6 col-md-3">
										<div className="border rounded-3 p-3 text-center">
											<p className="text-muted mb-1">Seats</p>
											<h6>{car.specs?.seats || 5}</h6>
										</div>
									</div>
									<div className="col-6 col-md-3">
										<div className="border rounded-3 p-3 text-center">
											<p className="text-muted mb-1">Doors</p>
											<h6>{car.specs?.doors || 4}</h6>
										</div>
									</div>
									<div className="col-6 col-md-3">
										<div className="border rounded-3 p-3 text-center">
											<p className="text-muted mb-1">Bags</p>
											<h6>{car.specs?.bags || 2}</h6>
										</div>
									</div>
									<div className="col-6 col-md-3">
										<div className="border rounded-3 p-3 text-center">
											<p className="text-muted mb-1">Mileage</p>
											<h6>{car.specs?.mileage?.toLocaleString() || 0}</h6>
										</div>
									</div>
								</div>

								{/* Main Specs */}
								<div className="row g-3 mb-4">
									<div className="col-md-4">
										<div className="d-flex align-items-center gap-2">
											<span className="badge bg-light text-dark">{car.transmission}</span>
										</div>
									</div>
									<div className="col-md-4">
										<div className="d-flex align-items-center gap-2">
											<span className="badge bg-light text-dark">{car.fuelType}</span>
										</div>
									</div>
									<div className="col-md-4">
										<div className="d-flex align-items-center gap-2">
											<span className="badge bg-light text-dark">{car.carType}</span>
										</div>
									</div>
								</div>

								{/* Amenities */}
								{car.amenities && car.amenities.length > 0 && (
									<>
										<h5 className="mb-3">Amenities</h5>
										<div className="d-flex flex-wrap gap-2 mb-4">
											{car.amenities.map((amenity, idx) => (
												<span key={idx} className="badge bg-success text-white">
													{amenity}
												</span>
											))}
										</div>
									</>
								)}

								{/* Extras */}
								{car.extras && car.extras.length > 0 && (
									<>
										<h5 className="mb-3">Available Extras</h5>
										<div className="row g-2">
											{car.extras.map((extra, idx) => (
												<div key={idx} className="col-md-6">
													<div className="d-flex justify-content-between align-items-center border rounded-2 p-2">
														<span>{extra.name}</span>
														<span className="text-primary">+${extra.price}/day</span>
													</div>
												</div>
											))}
										</div>
									</>
								)}
							</div>
						</div>

						{/* Sidebar - Booking */}
						<div className="col-lg-4">
							<div className="border rounded-3 p-4 sticky-top" style={{ top: '120px' }}>
								{/* Price */}
								<div className="text-center mb-4">
									<span className="text-muted">Daily Rate</span>
									<h2 className="text-primary mb-0">
										${car.pricing?.dailyRate?.toFixed(2) || 0}
										<small className="text-muted fs-6">/day</small>
									</h2>
									{car.pricing?.weeklyRate && (
										<p className="text-muted small mb-0">
											Weekly: ${car.pricing.weeklyRate.toFixed(2)}/week
										</p>
									)}
								</div>

								{/* Deposit Info */}
								{car.pricing?.deposit > 0 && (
									<div className="alert alert-info py-2 text-center">
										<small>Security Deposit: ${car.pricing.deposit.toFixed(2)}</small>
									</div>
								)}

								{/* Availability */}
								<div className="text-center mb-4">
									{car.availability?.isAvailable ? (
										<span className="badge bg-success">Available</span>
									) : (
										<span className="badge bg-danger">Not Available</span>
									)}
								</div>

								{/* Date Selection */}
								<div className="mb-3">
									<label className="form-label">{t('pickUpDate')}</label>
									<input
										type="date"
										className="form-control"
										value={pickupDate}
										onChange={(e) => setPickupDate(e.target.value)}
										min={minDate}
									/>
								</div>
								<div className="mb-4">
									<label className="form-label">{t('returnDate')}</label>
									<input
										type="date"
										className="form-control"
										value={dropoffDate}
										onChange={(e) => setDropoffDate(e.target.value)}
										min={pickupDate || minDate}
									/>
								</div>

								{/* Book Button */}
								<button
									className="btn btn-primary w-100 py-3 mb-3"
									onClick={handleBooking}
									disabled={!car.availability?.isAvailable}
								>
									{car.availability?.isAvailable ? 'Rent This Vehicle' : 'Not Available'}
								</button>

								{/* Quick Info */}
								<div className="border-top pt-3 mt-3">
									<div className="d-flex justify-content-between mb-2">
										<span className="text-muted">License Plate</span>
										<span>{car.licensePlate}</span>
									</div>
									<div className="d-flex justify-content-between">
										<span className="text-muted">Currency</span>
										<span>{car.pricing?.currency || 'USD'}</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</Layout>
	)
}
