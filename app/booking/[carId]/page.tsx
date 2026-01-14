'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import BookingStepper from "@/components/booking/BookingStepper"

interface Car {
	_id: string
	name: string
	brand: string
	model: string
	year: number
	images: Array<{ url: string; isPrimary: boolean }>
	pricing: {
		dailyRate: number
		deposit: number
		currency: string
	}
	specs: {
		seats: number
		doors: number
		bags: number
	}
	transmission: string
	fuelType: string
	extras: Array<{ name: string; price: number }>
}

interface PriceCalculation {
	dates: {
		pickup: string
		dropoff: string
		totalDays: number
	}
	pricing: {
		dailyRate: number
		subtotal: number
		extrasTotal: number
		discount: number
		discountPercentage: number
		tax: number
		total: number
		currency: string
		deposit: number
	}
}

export default function BookingPage({ params }: { params: { carId: string } }) {
	const t = useTranslations('booking')
	const tVehicles = useTranslations('vehicles')
	const tCommon = useTranslations('common')
	const { data: session, status } = useSession()
	const router = useRouter()
	const searchParams = useSearchParams()

	const [car, setCar] = useState<Car | null>(null)
	const [loading, setLoading] = useState(true)
	const [calculating, setCalculating] = useState(false)
	const [calculation, setCalculation] = useState<PriceCalculation | null>(null)
	const [unavailableDates, setUnavailableDates] = useState<string[]>([])
	const [error, setError] = useState<string | null>(null)

	// Form state
	const [pickupDate, setPickupDate] = useState(searchParams.get('pickup') || '')
	const [dropoffDate, setDropoffDate] = useState(searchParams.get('dropoff') || '')
	const [pickupLocation, setPickupLocation] = useState(searchParams.get('location') || '')
	const [dropoffLocation, setDropoffLocation] = useState('')
	const [sameLocation, setSameLocation] = useState(true)
	const [selectedExtras, setSelectedExtras] = useState<string[]>([])

	// Driver info
	const [driverName, setDriverName] = useState('')
	const [driverEmail, setDriverEmail] = useState('')
	const [driverPhone, setDriverPhone] = useState('')
	const [driverCpf, setDriverCpf] = useState('')
	const [driverCnh, setDriverCnh] = useState('')
	const [driverBirthDate, setDriverBirthDate] = useState('')
	const [acceptTerms, setAcceptTerms] = useState(false)

	useEffect(() => {
		if (session?.user) {
			setDriverName(session.user.name || '')
			setDriverEmail(session.user.email || '')
		}
	}, [session])

	useEffect(() => {
		fetchCar()
		fetchAvailability()
	}, [params.carId])

	useEffect(() => {
		if (pickupDate && dropoffDate && car) {
			calculatePrice()
		}
	}, [pickupDate, dropoffDate, selectedExtras])

	const fetchCar = async () => {
		try {
			const response = await fetch(`/api/cars/${params.carId}`)
			if (response.ok) {
				const data = await response.json()
				setCar(data.car)
			} else {
				setError('Car not found')
			}
		} catch (err) {
			setError('Error loading car')
		} finally {
			setLoading(false)
		}
	}

	const fetchAvailability = async () => {
		try {
			const response = await fetch(`/api/cars/${params.carId}/availability`)
			if (response.ok) {
				const data = await response.json()
				setUnavailableDates(data.unavailableDates)
			}
		} catch (err) {
			console.error('Error fetching availability:', err)
		}
	}

	const calculatePrice = async () => {
		if (!pickupDate || !dropoffDate) return

		setCalculating(true)
		try {
			const extras = selectedExtras.map(name => {
				const extra = car?.extras?.find(e => e.name === name)
				return {
					name,
					price: extra?.price || 0,
					quantity: 1,
				}
			})

			const response = await fetch('/api/bookings/calculate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					carId: params.carId,
					pickupDate,
					dropoffDate,
					extras,
				}),
			})

			if (response.ok) {
				const data = await response.json()
				setCalculation(data.calculation)
			}
		} catch (err) {
			console.error('Error calculating price:', err)
		} finally {
			setCalculating(false)
		}
	}

	const handleExtraToggle = (extraName: string) => {
		setSelectedExtras(prev =>
			prev.includes(extraName)
				? prev.filter(e => e !== extraName)
				: [...prev, extraName]
		)
	}

	// CPF validation function
	const validateCPF = (cpf: string): boolean => {
		const cleanCpf = cpf.replace(/\D/g, '')
		if (cleanCpf.length !== 11 || /^(\d)\1+$/.test(cleanCpf)) return false

		let sum = 0
		for (let i = 0; i < 9; i++) sum += parseInt(cleanCpf[i]) * (10 - i)
		let remainder = (sum * 10) % 11
		if (remainder === 10 || remainder === 11) remainder = 0
		if (remainder !== parseInt(cleanCpf[9])) return false

		sum = 0
		for (let i = 0; i < 10; i++) sum += parseInt(cleanCpf[i]) * (11 - i)
		remainder = (sum * 10) % 11
		if (remainder === 10 || remainder === 11) remainder = 0
		return remainder === parseInt(cleanCpf[10])
	}

	// Age validation (minimum 21 years)
	const validateAge = (birthDate: string): boolean => {
		const birth = new Date(birthDate)
		const today = new Date()
		let age = today.getFullYear() - birth.getFullYear()
		const monthDiff = today.getMonth() - birth.getMonth()
		if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
			age--
		}
		return age >= 21
	}

	// CPF mask function
	const formatCPF = (value: string): string => {
		const digits = value.replace(/\D/g, '').slice(0, 11)
		return digits
			.replace(/(\d{3})(\d)/, '$1.$2')
			.replace(/(\d{3})(\d)/, '$1.$2')
			.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!session) {
			router.push(`/login?callbackUrl=/booking/${params.carId}`)
			return
		}

		if (!pickupDate || !dropoffDate || !pickupLocation) {
			setError(t('fillAllFields'))
			return
		}

		// Validate CPF
		if (!driverCpf) {
			setError(t('cpfRequired'))
			return
		}
		if (!validateCPF(driverCpf)) {
			setError(t('invalidCpf'))
			return
		}

		// Validate CNH
		if (!driverCnh) {
			setError(t('cnhRequired'))
			return
		}

		// Validate age
		if (!driverBirthDate || !validateAge(driverBirthDate)) {
			setError(t('minimumAge'))
			return
		}

		// Validate terms acceptance
		if (!acceptTerms) {
			setError(t('termsRequired'))
			return
		}

		setLoading(true)
		setError(null)

		try {
			const extras = selectedExtras.map(name => {
				const extra = car?.extras?.find(e => e.name === name)
				return {
					name,
					price: extra?.price || 0,
					quantity: 1,
				}
			})

			const response = await fetch('/api/bookings', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					carId: params.carId,
					pickupDate,
					dropoffDate,
					pickupLocation,
					dropoffLocation: sameLocation ? pickupLocation : dropoffLocation,
					extras,
					driverInfo: {
						name: driverName,
						email: driverEmail,
						phone: driverPhone,
						cpf: driverCpf.replace(/\D/g, ''),
						cnh: driverCnh,
						birthDate: driverBirthDate,
					},
				}),
			})

			const data = await response.json()

			if (response.ok) {
				router.push(`/booking/checkout?bookingId=${data.bookingId}`)
			} else {
				setError(data.error || 'Error creating booking')
			}
		} catch (err) {
			setError('Error creating booking')
		} finally {
			setLoading(false)
		}
	}

	if (status === 'loading' || loading) {
		return (
			<Layout footerStyle={1}>
				<div className="container pt-140 pb-170">
					<div className="text-center">
						<div className="spinner-border text-primary" role="status">
							<span className="visually-hidden">{tCommon('loading')}</span>
						</div>
					</div>
				</div>
			</Layout>
		)
	}

	if (!car) {
		return (
			<Layout footerStyle={1}>
				<div className="container pt-140 pb-170">
					<div className="text-center">
						<h4>{error || 'Car not found'}</h4>
						<Link href="/cars-list-1" className="btn btn-primary mt-3">
							{tCommon('back')}
						</Link>
					</div>
				</div>
			</Layout>
		)
	}

	const minDate = new Date().toISOString().split('T')[0]

	return (
		<Layout footerStyle={1}>
			<div className="container pt-140 pb-170">
				<BookingStepper currentStep={1} carId={params.carId} />
				<div className="row">
					{/* Car Info */}
					<div className="col-lg-4 mb-4">
						<div className="border rounded-3 p-4 sticky-top" style={{ top: '120px' }}>
							<img
								src={car.images?.[0]?.url || '/assets/imgs/template/placeholder-car.jpg'}
								alt={car.name}
								className="img-fluid rounded-3 mb-3"
							/>
							<h4>{car.name}</h4>
							<p className="text-muted">{car.brand} {car.model} {car.year}</p>

							<div className="d-flex gap-3 mb-3">
								<span><i className="me-1">👥</i> {car.specs?.seats} {t('seats')}</span>
								<span><i className="me-1">🚪</i> {car.specs?.doors} {t('doors')}</span>
								<span><i className="me-1">🧳</i> {car.specs?.bags} {t('bags')}</span>
							</div>

							<div className="d-flex gap-3 mb-3">
								<span className="badge bg-light text-dark">{car.transmission}</span>
								<span className="badge bg-light text-dark">{car.fuelType}</span>
							</div>

							<hr />

							<div className="d-flex justify-content-between align-items-center">
								<span className="text-muted">{t('dailyRate')}:</span>
								<span className="h5 text-primary mb-0">
									R$ {car.pricing?.dailyRate}{tVehicles('perDay')}
								</span>
							</div>

							{car.pricing?.deposit > 0 && (
								<div className="d-flex justify-content-between align-items-center mt-2">
									<span className="text-muted">{t('deposit')}:</span>
									<span>R$ {car.pricing.deposit}</span>
								</div>
							)}
						</div>
					</div>

					{/* Booking Form */}
					<div className="col-lg-8">
						<div className="border rounded-3 p-4">
							<h4 className="mb-4">{t('title')}</h4>

							{error && (
								<div className="alert alert-danger mb-4">{error}</div>
							)}

							<form onSubmit={handleSubmit}>
								{/* Dates */}
								<div className="row g-3 mb-4">
									<div className="col-md-6">
										<label className="form-label">{tVehicles('pickUpDate')} <span className="text-danger">*</span></label>
										<input
											type="date"
											className="form-control"
											value={pickupDate}
											onChange={(e) => setPickupDate(e.target.value)}
											min={minDate}
											required
										/>
									</div>
									<div className="col-md-6">
										<label className="form-label">{tVehicles('returnDate')} <span className="text-danger">*</span></label>
										<input
											type="date"
											className="form-control"
											value={dropoffDate}
											onChange={(e) => setDropoffDate(e.target.value)}
											min={pickupDate || minDate}
											required
										/>
									</div>
								</div>

								{/* Locations */}
								<div className="mb-4">
									<label className="form-label">{tVehicles('pickUpLocation')} <span className="text-danger">*</span></label>
									<input
										type="text"
										className="form-control"
										value={pickupLocation}
										onChange={(e) => setPickupLocation(e.target.value)}
										placeholder={t('enterPickupLocation')}
										required
									/>
								</div>

								<div className="form-check mb-3">
									<input
										className="form-check-input"
										type="checkbox"
										checked={sameLocation}
										onChange={(e) => setSameLocation(e.target.checked)}
										id="sameLocation"
									/>
									<label className="form-check-label" htmlFor="sameLocation">
										{t('sameLocation')}
									</label>
								</div>

								{!sameLocation && (
									<div className="mb-4">
										<label className="form-label">{tVehicles('dropOffLocation')} <span className="text-danger">*</span></label>
										<input
											type="text"
											className="form-control"
											value={dropoffLocation}
											onChange={(e) => setDropoffLocation(e.target.value)}
											placeholder={t('enterDropoffLocation')}
											required={!sameLocation}
										/>
									</div>
								)}

								{/* Extras */}
								{car.extras && car.extras.length > 0 && (
									<div className="mb-4">
										<h5 className="mb-3">{t('extras')}</h5>
										<div className="row g-3">
											{car.extras.map((extra) => (
												<div key={extra.name} className="col-md-6">
													<div
														className={`border rounded-3 p-3 cursor-pointer ${selectedExtras.includes(extra.name) ? 'border-primary bg-light' : ''}`}
														onClick={() => handleExtraToggle(extra.name)}
														style={{ cursor: 'pointer' }}
													>
														<div className="form-check">
															<input
																className="form-check-input"
																type="checkbox"
																checked={selectedExtras.includes(extra.name)}
																onChange={() => handleExtraToggle(extra.name)}
															/>
															<label className="form-check-label d-flex justify-content-between w-100">
																<span>{extra.name}</span>
																<span className="text-primary">+R$ {extra.price}{t('perDay')}</span>
															</label>
														</div>
													</div>
												</div>
											))}
										</div>
									</div>
								)}

								{/* Driver Info */}
								<h5 className="mb-3">{t('driverInformation')}</h5>
								<div className="row g-3 mb-4">
									<div className="col-md-6">
										<label className="form-label">{t('fullName')} <span className="text-danger">*</span></label>
										<input
											type="text"
											className="form-control"
											value={driverName}
											onChange={(e) => setDriverName(e.target.value)}
											required
										/>
									</div>
									<div className="col-md-6">
										<label className="form-label">Email <span className="text-danger">*</span></label>
										<input
											type="email"
											className="form-control"
											value={driverEmail}
											onChange={(e) => setDriverEmail(e.target.value)}
											required
										/>
									</div>
									<div className="col-md-6">
										<label className="form-label">{t('phone')}</label>
										<input
											type="tel"
											className="form-control"
											value={driverPhone}
											onChange={(e) => setDriverPhone(e.target.value)}
										/>
									</div>
									<div className="col-md-6">
										<label className="form-label">{t('cpf')} <span className="text-danger">*</span></label>
										<input
											type="text"
											className="form-control"
											value={driverCpf}
											onChange={(e) => setDriverCpf(formatCPF(e.target.value))}
											placeholder={t('cpfPlaceholder')}
											required
										/>
									</div>
									<div className="col-md-6">
										<label className="form-label">{t('cnh')} <span className="text-danger">*</span></label>
										<input
											type="text"
											className="form-control"
											value={driverCnh}
											onChange={(e) => setDriverCnh(e.target.value)}
											placeholder={t('cnhPlaceholder')}
											required
										/>
									</div>
									<div className="col-md-6">
										<label className="form-label">{t('birthDate')} <span className="text-danger">*</span></label>
										<input
											type="date"
											className="form-control"
											value={driverBirthDate}
											onChange={(e) => setDriverBirthDate(e.target.value)}
											max={new Date(new Date().setFullYear(new Date().getFullYear() - 21)).toISOString().split('T')[0]}
											required
										/>
									</div>
								</div>

								{/* Terms and Conditions */}
								<div className="form-check mb-4">
									<input
										className="form-check-input"
										type="checkbox"
										checked={acceptTerms}
										onChange={(e) => setAcceptTerms(e.target.checked)}
										id="acceptTerms"
										required
									/>
									<label className="form-check-label" htmlFor="acceptTerms">
										{t('acceptTerms')} <a href="/terms" target="_blank" className="text-primary">{t('termsAndConditions')}</a> <span className="text-danger">*</span>
									</label>
								</div>

								{/* Price Summary */}
								{calculation && (
									<div className="bg-light rounded-3 p-4 mb-4">
										<h5 className="mb-3">{t('summary')}</h5>
										<div className="d-flex justify-content-between mb-2">
											<span>{t('duration')}:</span>
											<span>{calculation.dates.totalDays} {calculation.dates.totalDays === 1 ? t('day') : t('days')}</span>
										</div>
										<div className="d-flex justify-content-between mb-2">
											<span>R$ {calculation.pricing.dailyRate} x {calculation.dates.totalDays} {calculation.dates.totalDays === 1 ? t('day') : t('days')}:</span>
											<span>R$ {calculation.pricing.subtotal.toFixed(2)}</span>
										</div>
										{calculation.pricing.extrasTotal > 0 && (
											<div className="d-flex justify-content-between mb-2">
												<span>{t('extras')}:</span>
												<span>R$ {calculation.pricing.extrasTotal.toFixed(2)}</span>
											</div>
										)}
										{calculation.pricing.discount > 0 && (
											<div className="d-flex justify-content-between mb-2 text-success">
												<span>{t('discount')} ({calculation.pricing.discountPercentage}%):</span>
												<span>-R$ {calculation.pricing.discount.toFixed(2)}</span>
											</div>
										)}
										<div className="d-flex justify-content-between mb-2">
											<span>{t('taxes')} (10%):</span>
											<span>R$ {calculation.pricing.tax.toFixed(2)}</span>
										</div>
										<hr />
										<div className="d-flex justify-content-between">
											<strong>{t('total')}:</strong>
											<strong className="text-primary h5 mb-0">
												R$ {calculation.pricing.total.toFixed(2)}
											</strong>
										</div>
									</div>
								)}

								{calculating && (
									<div className="text-center mb-4">
										<div className="spinner-border spinner-border-sm text-primary" role="status">
											<span className="visually-hidden">{tCommon('loading')}</span>
										</div>
										<span className="ms-2">{t('calculating')}</span>
									</div>
								)}

								<button
									type="submit"
									className="btn btn-primary w-100 py-3"
									disabled={loading || !calculation}
								>
									{loading ? (
										<>
											<span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
											{tCommon('loading')}
										</>
									) : (
										<>
											{t('checkout')}
											<svg className="ms-2" width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path d="M8 15L15 8L8 1M15 8L1 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
											</svg>
										</>
									)}
								</button>
							</form>
						</div>
					</div>
				</div>
			</div>
		</Layout>
	)
}
