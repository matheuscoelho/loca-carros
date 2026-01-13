'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import BookingStepper from "@/components/booking/BookingStepper"

interface Booking {
	_id: string
	bookingNumber: string
	car: {
		_id: string
		name: string
		brand: string
		model: string
		year: number
		images: Array<{ url: string }>
	}
	pickupDate: string
	dropoffDate: string
	totalDays: number
	pickupLocation: string
	dropoffLocation: string
	pricing: {
		dailyRate: number
		subtotal: number
		extrasTotal: number
		tax: number
		discount: number
		total: number
		currency: string
	}
	extras: Array<{ name: string; price: number; quantity: number }>
	driverInfo: {
		name: string
		email: string
		phone: string
	}
	status: string
	paymentStatus: string
}

export default function ConfirmationPage() {
	const t = useTranslations('booking')
	const tCommon = useTranslations('common')
	const { data: session, status } = useSession()
	const router = useRouter()
	const searchParams = useSearchParams()
	const bookingId = searchParams.get('bookingId') || searchParams.get('id')

	const [booking, setBooking] = useState<Booking | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (status === 'unauthenticated') {
			router.push('/login')
		}
	}, [status, router])

	useEffect(() => {
		if (bookingId && session) {
			fetchBooking()
		}
	}, [bookingId, session])

	const fetchBooking = async () => {
		try {
			const response = await fetch(`/api/bookings/${bookingId}`)
			if (!response.ok) {
				throw new Error('Booking not found')
			}
			const data = await response.json()
			setBooking(data.booking)
		} catch (err: any) {
			setError(err.message || 'Error loading booking')
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
						<p className="mt-3">{tCommon('loading')}</p>
					</div>
				</div>
			</Layout>
		)
	}

	if (error || !booking) {
		return (
			<Layout footerStyle={1}>
				<div className="container pt-140 pb-170">
					<div className="text-center">
						<h4>{error || 'Booking not found'}</h4>
						<Link href="/dashboard/my-rentals" className="btn btn-primary mt-3">
							{tCommon('back')}
						</Link>
					</div>
				</div>
			</Layout>
		)
	}

	const isConfirmed = booking.status === 'confirmed' || booking.paymentStatus === 'paid'

	return (
		<Layout footerStyle={1}>
			<div className="container pt-140 pb-170">
				<BookingStepper currentStep={3} bookingId={booking._id} carId={booking.car?._id} />
				<div className="row justify-content-center">
					<div className="col-lg-8">
						<div className="text-center mb-5">
							{isConfirmed ? (
								<>
									<div className="mb-4">
										<span style={{ fontSize: '80px' }}>✅</span>
									</div>
									<h2 className="text-success">{t('confirmation')}</h2>
									<p className="text-muted lead">
										Your booking has been confirmed. Check your email for details.
									</p>
								</>
							) : (
								<>
									<div className="mb-4">
										<span style={{ fontSize: '80px' }}>⏳</span>
									</div>
									<h2 className="text-warning">Booking Pending</h2>
									<p className="text-muted lead">
										Your booking is pending payment confirmation.
									</p>
								</>
							)}
						</div>

						<div className="border rounded-3 p-4 mb-4">
							<div className="d-flex justify-content-between align-items-center mb-4">
								<h5 className="mb-0">{t('bookingNumber')}</h5>
								<span className="h4 text-primary mb-0">{booking.bookingNumber}</span>
							</div>

							<hr />

							{/* Car Info */}
							<div className="row mb-4">
								<div className="col-md-4">
									<img
										src={booking.car?.images?.[0]?.url || '/assets/imgs/template/placeholder-car.jpg'}
										alt={booking.car?.name}
										className="img-fluid rounded-3"
									/>
								</div>
								<div className="col-md-8">
									<h5>{booking.car?.name}</h5>
									<p className="text-muted mb-2">
										{booking.car?.brand} {booking.car?.model} {booking.car?.year}
									</p>
									<span className={`badge bg-${isConfirmed ? 'success' : 'warning'}`}>
										{booking.status === 'confirmed' ? t('status.confirmed') : t('status.pending')}
									</span>
								</div>
							</div>

							<hr />

							{/* Trip Details */}
							<div className="row mb-4">
								<div className="col-md-6 mb-3">
									<h6 className="text-muted">Pickup</h6>
									<p className="mb-1">
										<strong>{new Date(booking.pickupDate).toLocaleDateString('en-US', {
											weekday: 'long',
											year: 'numeric',
											month: 'long',
											day: 'numeric',
										})}</strong>
									</p>
									<p className="mb-0">{booking.pickupLocation}</p>
								</div>
								<div className="col-md-6 mb-3">
									<h6 className="text-muted">Return</h6>
									<p className="mb-1">
										<strong>{new Date(booking.dropoffDate).toLocaleDateString('en-US', {
											weekday: 'long',
											year: 'numeric',
											month: 'long',
											day: 'numeric',
										})}</strong>
									</p>
									<p className="mb-0">{booking.dropoffLocation}</p>
								</div>
							</div>

							<hr />

							{/* Driver Info */}
							<h6 className="mb-3">Driver Information</h6>
							<div className="row mb-4">
								<div className="col-md-4">
									<p className="text-muted mb-1">Name</p>
									<p className="mb-0">{booking.driverInfo?.name}</p>
								</div>
								<div className="col-md-4">
									<p className="text-muted mb-1">Email</p>
									<p className="mb-0">{booking.driverInfo?.email}</p>
								</div>
								<div className="col-md-4">
									<p className="text-muted mb-1">Phone</p>
									<p className="mb-0">{booking.driverInfo?.phone || '-'}</p>
								</div>
							</div>

							<hr />

							{/* Pricing */}
							<h6 className="mb-3">Payment Summary</h6>
							<div className="bg-light rounded-3 p-3">
								<div className="d-flex justify-content-between mb-2">
									<span>Duration:</span>
									<span>{booking.totalDays} days</span>
								</div>
								<div className="d-flex justify-content-between mb-2">
									<span>${booking.pricing.dailyRate}/day x {booking.totalDays}:</span>
									<span>${booking.pricing.subtotal.toFixed(2)}</span>
								</div>
								{booking.pricing.extrasTotal > 0 && (
									<div className="d-flex justify-content-between mb-2">
										<span>Extras:</span>
										<span>${booking.pricing.extrasTotal.toFixed(2)}</span>
									</div>
								)}
								{booking.pricing.discount > 0 && (
									<div className="d-flex justify-content-between mb-2 text-success">
										<span>Discount:</span>
										<span>-${booking.pricing.discount.toFixed(2)}</span>
									</div>
								)}
								<div className="d-flex justify-content-between mb-2">
									<span>Tax:</span>
									<span>${booking.pricing.tax.toFixed(2)}</span>
								</div>
								<hr />
								<div className="d-flex justify-content-between">
									<strong>{t('total')}:</strong>
									<strong className="text-primary h5 mb-0">
										${booking.pricing.total.toFixed(2)}
									</strong>
								</div>
								<div className="text-end mt-2">
									<span className={`badge bg-${booking.paymentStatus === 'paid' ? 'success' : 'warning'}`}>
										{booking.paymentStatus === 'paid' ? 'Paid' : 'Payment Pending'}
									</span>
								</div>
							</div>
						</div>

						{/* Actions */}
						<div className="d-flex gap-3 justify-content-center">
							<Link href="/dashboard/my-rentals" className="btn btn-primary">
								View My Rentals
							</Link>
							<Link href="/cars-list-1" className="btn btn-outline-primary">
								Browse More Cars
							</Link>
						</div>

						{!isConfirmed && (
							<div className="text-center mt-4">
								<Link
									href={`/booking/checkout?bookingId=${booking._id}`}
									className="btn btn-warning"
								>
									Complete Payment
								</Link>
							</div>
						)}
					</div>
				</div>
			</div>
		</Layout>
	)
}
