'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import Layout from "@/components/layout/Layout"
import BookingStepper from "@/components/booking/BookingStepper"

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface Booking {
	_id: string
	bookingNumber: string
	car: {
		_id: string
		name: string
		brand: string
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
	driverInfo: {
		name: string
		email: string
		phone: string
	}
}

function CheckoutForm({ booking, onSuccess }: { booking: Booking; onSuccess: () => void }) {
	const t = useTranslations('payment')
	const tCommon = useTranslations('common')
	const stripe = useStripe()
	const elements = useElements()
	const [error, setError] = useState<string | null>(null)
	const [processing, setProcessing] = useState(false)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!stripe || !elements) {
			return
		}

		setProcessing(true)
		setError(null)

		const { error: submitError } = await elements.submit()
		if (submitError) {
			setError(submitError.message || 'An error occurred')
			setProcessing(false)
			return
		}

		const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
			elements,
			confirmParams: {
				return_url: `${window.location.origin}/booking/confirmation?bookingId=${booking._id}`,
			},
			redirect: 'if_required',
		})

		if (confirmError) {
			setError(confirmError.message || 'Payment failed')
			setProcessing(false)
		} else if (paymentIntent && paymentIntent.status === 'succeeded') {
			onSuccess()
		}
	}

	return (
		<form onSubmit={handleSubmit}>
			<PaymentElement />

			{error && (
				<div className="alert alert-danger mt-3">{error}</div>
			)}

			<button
				type="submit"
				className="btn btn-primary w-100 py-3 mt-4"
				disabled={!stripe || processing}
			>
				{processing ? (
					<>
						<span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
						{t('processing')}
					</>
				) : (
					<>
						{t('pay')} ${booking.pricing.total.toFixed(2)}
					</>
				)}
			</button>

			<p className="text-muted text-center small mt-3">
				Your payment is secure and encrypted
			</p>
		</form>
	)
}

export default function CheckoutPage() {
	const t = useTranslations('booking')
	const tPayment = useTranslations('payment')
	const tCommon = useTranslations('common')
	const { data: session, status } = useSession()
	const router = useRouter()
	const searchParams = useSearchParams()
	const bookingId = searchParams.get('bookingId')

	const [booking, setBooking] = useState<Booking | null>(null)
	const [clientSecret, setClientSecret] = useState<string | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (status === 'unauthenticated') {
			router.push('/login')
		}
	}, [status, router])

	useEffect(() => {
		if (bookingId && session) {
			fetchBookingAndCreatePaymentIntent()
		}
	}, [bookingId, session])

	const fetchBookingAndCreatePaymentIntent = async () => {
		try {
			// Fetch booking
			const bookingResponse = await fetch(`/api/bookings/${bookingId}`)
			if (!bookingResponse.ok) {
				throw new Error('Booking not found')
			}
			const bookingData = await bookingResponse.json()
			setBooking(bookingData.booking)

			// Check if already paid
			if (bookingData.booking.paymentStatus === 'paid') {
				router.push(`/booking/confirmation?bookingId=${bookingId}`)
				return
			}

			// Create payment intent
			const paymentResponse = await fetch('/api/payments/create-intent', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ bookingId }),
			})

			if (!paymentResponse.ok) {
				throw new Error('Failed to create payment')
			}

			const paymentData = await paymentResponse.json()
			setClientSecret(paymentData.clientSecret)
		} catch (err: any) {
			setError(err.message || 'Error loading checkout')
		} finally {
			setLoading(false)
		}
	}

	const handlePaymentSuccess = () => {
		router.push(`/booking/confirmation?bookingId=${bookingId}`)
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
						<a href="/dashboard/my-rentals" className="btn btn-primary mt-3">
							{tCommon('back')}
						</a>
					</div>
				</div>
			</Layout>
		)
	}

	return (
		<Layout footerStyle={1}>
			<div className="container pt-140 pb-170">
				<BookingStepper currentStep={2} bookingId={bookingId || undefined} carId={booking.car?._id} />
				<div className="row justify-content-center">
					<div className="col-lg-8">
						<div className="row">
							{/* Order Summary */}
							<div className="col-lg-5 order-lg-2 mb-4">
								<div className="border rounded-3 p-4 sticky-top" style={{ top: '120px' }}>
									<h5 className="mb-4">{t('summary')}</h5>

									<div className="d-flex gap-3 mb-4">
										<img
											src={booking.car?.images?.[0]?.url || '/assets/imgs/template/placeholder-car.jpg'}
											alt={booking.car?.name}
											className="rounded"
											style={{ width: '80px', height: '60px', objectFit: 'cover' }}
										/>
										<div>
											<h6 className="mb-1">{booking.car?.name}</h6>
											<p className="text-muted small mb-0">{booking.car?.brand}</p>
										</div>
									</div>

									<div className="small">
										<div className="d-flex justify-content-between mb-2">
											<span className="text-muted">Booking #:</span>
											<span>{booking.bookingNumber}</span>
										</div>
										<div className="d-flex justify-content-between mb-2">
											<span className="text-muted">Pickup:</span>
											<span>{new Date(booking.pickupDate).toLocaleDateString()}</span>
										</div>
										<div className="d-flex justify-content-between mb-2">
											<span className="text-muted">Return:</span>
											<span>{new Date(booking.dropoffDate).toLocaleDateString()}</span>
										</div>
										<div className="d-flex justify-content-between mb-2">
											<span className="text-muted">Duration:</span>
											<span>{booking.totalDays} days</span>
										</div>
									</div>

									<hr />

									<div className="small">
										<div className="d-flex justify-content-between mb-2">
											<span>{t('subtotal')}:</span>
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
									</div>

									<hr />

									<div className="d-flex justify-content-between">
										<strong>{t('total')}:</strong>
										<strong className="text-primary h5 mb-0">
											${booking.pricing.total.toFixed(2)}
										</strong>
									</div>
								</div>
							</div>

							{/* Payment Form */}
							<div className="col-lg-7 order-lg-1">
								<div className="border rounded-3 p-4">
									<h4 className="mb-4">{tPayment('title')}</h4>

									{clientSecret ? (
										<Elements
											stripe={stripePromise}
											options={{
												clientSecret,
												appearance: {
													theme: 'stripe',
													variables: {
														colorPrimary: '#0d6efd',
													},
												},
											}}
										>
											<CheckoutForm
												booking={booking}
												onSuccess={handlePaymentSuccess}
											/>
										</Elements>
									) : (
										<div className="text-center py-4">
											<div className="spinner-border text-primary" role="status">
												<span className="visually-hidden">{tCommon('loading')}</span>
											</div>
											<p className="mt-3">Preparing payment...</p>
										</div>
									)}

									<div className="mt-4 text-center">
										<img
											src="/assets/imgs/template/payment-methods.png"
											alt="Accepted payment methods"
											className="img-fluid"
											style={{ maxHeight: '30px', opacity: 0.7 }}
											onError={(e) => {
												(e.target as HTMLImageElement).style.display = 'none'
											}}
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Layout>
	)
}
