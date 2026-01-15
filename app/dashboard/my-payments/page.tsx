'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import Layout from "@/components/layout/Layout"
import DashboardSidebar from "@/components/dashboard/DashboardSidebar"
import Link from 'next/link'

interface Payment {
	_id: string
	bookingNumber: string
	pickupDate: string
	dropoffDate: string
	status: string
	paymentStatus: string
	pricing: {
		total: number
		currency: string
	}
	car?: {
		brand: string
		model: string
	}
	createdAt: string
}

export default function MyPayments() {
	const t = useTranslations('dashboard')
	const tCommon = useTranslations('common')
	const { data: session, status } = useSession()
	const router = useRouter()

	const [payments, setPayments] = useState<Payment[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [filter, setFilter] = useState<string>('')

	const fetchPayments = useCallback(async () => {
		if (!session?.user) return
		try {
			setLoading(true)
			const params = new URLSearchParams()
			params.set('limit', '100')

			const response = await fetch(`/api/bookings?${params.toString()}`)

			if (!response.ok) {
				throw new Error('Failed to fetch payments')
			}

			const data = await response.json()
			let bookings: Payment[] = data.bookings || []

			// Filter by payment status if selected
			if (filter) {
				bookings = bookings.filter(b => b.paymentStatus === filter)
			}

			setPayments(bookings)
		} catch (err) {
			console.error('Error fetching payments:', err)
			setError(t('errorLoadingPayments'))
		} finally {
			setLoading(false)
		}
	}, [session, filter, t])

	useEffect(() => {
		fetchPayments()
	}, [fetchPayments])

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('pt-BR', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric'
		})
	}

	const getPaymentStatusBadge = (status: string) => {
		const colorMap: Record<string, string> = {
			pending: 'warning',
			paid: 'success',
			refunded: 'info',
			failed: 'danger',
		}
		const color = colorMap[status] || 'secondary'
		const label = t(`paymentStatus.${status}`) || status
		return <span className={`badge bg-${color}`}>{label}</span>
	}

	// Calculate total paid
	const totalPaid = payments
		.filter(p => p.paymentStatus === 'paid')
		.reduce((sum, p) => sum + (p.pricing?.total || 0), 0)

	const totalPending = payments
		.filter(p => p.paymentStatus === 'pending')
		.reduce((sum, p) => sum + (p.pricing?.total || 0), 0)

	if (status === 'loading') {
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

	if (!session) {
		router.push('/login')
		return null
	}

	return (
		<Layout footerStyle={1}>
			<div className="container pt-140 pb-170">
				<div className="row">
					<div className="col-lg-3 mb-4">
						<DashboardSidebar />
					</div>

					<div className="col-lg-9">
						{/* Summary Cards */}
						{!loading && (
							<div className="row g-3 mb-4">
								<div className="col-md-4">
									<div className="border rounded-3 p-3 bg-light">
										<div className="d-flex justify-content-between align-items-center">
											<div>
												<small className="text-muted">{t('totalPaid')}</small>
												<h4 className="mb-0 text-success">R$ {totalPaid.toFixed(2)}</h4>
											</div>
											<span style={{ fontSize: '32px' }}>✅</span>
										</div>
									</div>
								</div>
								<div className="col-md-4">
									<div className="border rounded-3 p-3 bg-light">
										<div className="d-flex justify-content-between align-items-center">
											<div>
												<small className="text-muted">{t('pending')}</small>
												<h4 className="mb-0 text-warning">R$ {totalPending.toFixed(2)}</h4>
											</div>
											<span style={{ fontSize: '32px' }}>⏳</span>
										</div>
									</div>
								</div>
								<div className="col-md-4">
									<div className="border rounded-3 p-3 bg-light">
										<div className="d-flex justify-content-between align-items-center">
											<div>
												<small className="text-muted">{t('transactions')}</small>
												<h4 className="mb-0 text-primary">{payments.length}</h4>
											</div>
											<span style={{ fontSize: '32px' }}>💳</span>
										</div>
									</div>
								</div>
							</div>
						)}

						<div className="border rounded-3 p-4">
							<div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
								<h4 className="mb-0">{t('myPayments')}</h4>
								<div className="d-flex gap-2 align-items-center">
									<label className="text-muted small me-2">{tCommon('filter')}:</label>
									<select
										className="form-select form-select-sm"
										style={{ width: 'auto' }}
										value={filter}
										onChange={(e) => setFilter(e.target.value)}
									>
										<option value="">{t('allPayments')}</option>
										<option value="paid">{t('paidFilter')}</option>
										<option value="pending">{t('pendingPaymentsFilter')}</option>
										<option value="refunded">{t('refundedFilter')}</option>
										<option value="failed">{t('failedFilter')}</option>
									</select>
								</div>
							</div>

							{loading ? (
								<div className="text-center py-5">
									<div className="spinner-border text-primary" role="status">
										<span className="visually-hidden">{tCommon('loading')}</span>
									</div>
									<p className="mt-3">{t('loadingPayments')}</p>
								</div>
							) : error ? (
								<div className="alert alert-danger text-center">
									{error}
									<button className="btn btn-sm btn-primary ms-3" onClick={fetchPayments}>
										{t('tryAgain')}
									</button>
								</div>
							) : payments.length === 0 ? (
								<div className="text-center py-5">
									<div className="mb-3" style={{ fontSize: '64px' }}>💳</div>
									<h5 className="text-muted">{t('noRecentActivity')}</h5>
									<p className="text-muted">{t('activityWillAppear')}</p>
									<Link href="/cars-list-1" className="btn btn-primary mt-3">
										{t('findVehicle')}
									</Link>
								</div>
							) : (
								<>
									{/* Cards para Mobile */}
									<div className="d-md-none">
										{payments.map((payment) => (
											<div key={payment._id} className="card mb-3">
												<div className="card-body">
													<div className="d-flex justify-content-between align-items-start mb-2">
														<div>
															<h6 className="mb-0">#{payment.bookingNumber}</h6>
															<small className="text-muted">
																{payment.car ? `${payment.car.brand} ${payment.car.model}` : t('vehicle')}
															</small>
														</div>
														{getPaymentStatusBadge(payment.paymentStatus)}
													</div>
													<hr />
													<div className="d-flex justify-content-between align-items-center">
														<small className="text-muted">{formatDate(payment.createdAt)}</small>
														<strong className="text-primary">R$ {payment.pricing?.total?.toFixed(2) || '0,00'}</strong>
													</div>
												</div>
											</div>
										))}
									</div>

									{/* Tabela para Desktop */}
									<div className="table-responsive d-none d-md-block">
										<table className="table table-hover align-middle">
											<thead className="table-light">
												<tr>
													<th>{t('reservation')}</th>
													<th>{t('vehicle')}</th>
													<th>{t('period')}</th>
													<th>{t('amount')}</th>
													<th>Status</th>
													<th>{t('date')}</th>
													<th>{tCommon('view')}</th>
												</tr>
											</thead>
											<tbody>
												{payments.map((payment) => (
													<tr key={payment._id}>
														<td>
															<small className="text-muted">#{payment.bookingNumber}</small>
														</td>
														<td>
															<small>
																{payment.car ? `${payment.car.brand} ${payment.car.model}` : t('vehicle')}
															</small>
														</td>
														<td>
															<small>
																{formatDate(payment.pickupDate)} - {formatDate(payment.dropoffDate)}
															</small>
														</td>
														<td>
															<strong className="text-primary">
																R$ {payment.pricing?.total?.toFixed(2) || '0,00'}
															</strong>
														</td>
														<td>{getPaymentStatusBadge(payment.paymentStatus)}</td>
														<td>
															<small>{formatDate(payment.createdAt)}</small>
														</td>
														<td>
															<Link
																href={`/booking/confirmation?id=${payment._id}`}
																className="btn btn-sm btn-outline-primary"
															>
																{tCommon('view')}
															</Link>
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								</>
							)}
						</div>
					</div>
				</div>
			</div>
		</Layout>
	)
}
