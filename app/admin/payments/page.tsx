'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'

interface Payment {
	_id: string
	transactionId: string
	amount: number
	currency: string
	status: string
	paymentMethod?: {
		type: string
		last4?: string
		brand?: string
	}
	stripePaymentIntentId?: string
	refund?: {
		amount: number
		reason: string
		refundedAt: string
	}
	createdAt: string
	completedAt?: string
	user?: {
		name: string
		email: string
	}
	booking?: {
		bookingNumber: string
	}
}

interface Stats {
	[key: string]: {
		count: number
		total: number
	}
}

export default function AdminPaymentsPage() {
	const t = useTranslations('admin')
	const tCommon = useTranslations('common')
	const [payments, setPayments] = useState<Payment[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [statusFilter, setStatusFilter] = useState('all')
	const [searchTerm, setSearchTerm] = useState('')
	const [stats, setStats] = useState<Stats>({})
	const [processingRefund, setProcessingRefund] = useState<string | null>(null)

	const fetchPayments = useCallback(async () => {
		try {
			setLoading(true)
			const params = new URLSearchParams()
			if (statusFilter !== 'all') params.set('status', statusFilter)

			const response = await fetch(`/api/admin/payments?${params}`)
			if (!response.ok) {
				throw new Error('Failed to fetch payments')
			}
			const data = await response.json()
			setPayments(data.payments || [])
			setStats(data.stats || {})
		} catch (err) {
			setError('Error loading payments')
			console.error(err)
		} finally {
			setLoading(false)
		}
	}, [statusFilter])

	useEffect(() => {
		fetchPayments()
	}, [fetchPayments])

	const handleRefund = async (paymentId: string, amount: number) => {
		if (!confirm(`Are you sure you want to refund $${amount.toFixed(2)}?`)) {
			return
		}

		setProcessingRefund(paymentId)
		try {
			const response = await fetch('/api/admin/payments', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					paymentId,
					amount,
					reason: 'Admin refund'
				})
			})

			if (response.ok) {
				fetchPayments()
			} else {
				const data = await response.json()
				alert(data.error || 'Failed to process refund')
			}
		} catch (err) {
			console.error('Error processing refund:', err)
			alert('Error processing refund')
		} finally {
			setProcessingRefund(null)
		}
	}

	const filteredPayments = payments.filter(payment => {
		const matchesSearch =
			payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
			(payment.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
			(payment.user?.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
			(payment.booking?.bookingNumber || '').toLowerCase().includes(searchTerm.toLowerCase())
		return matchesSearch
	})

	const getStatusBadge = (status: string) => {
		const badges: Record<string, string> = {
			pending: 'bg-warning',
			processing: 'bg-info',
			succeeded: 'bg-success',
			failed: 'bg-danger',
			refunded: 'bg-secondary',
			cancelled: 'bg-dark',
		}
		return badges[status] || 'bg-secondary'
	}

	const getTotalByStatus = (status: string) => {
		return stats[status]?.total || 0
	}

	const getCountByStatus = (status: string) => {
		return stats[status]?.count || 0
	}

	const totalReceived = getTotalByStatus('succeeded')
	const totalPending = getTotalByStatus('pending')
	const totalRefunded = getTotalByStatus('refunded')

	if (loading && payments.length === 0) {
		return (
			<div className="text-center py-5">
				<div className="spinner-border text-primary" role="status">
					<span className="visually-hidden">{tCommon('loading')}</span>
				</div>
			</div>
		)
	}

	return (
		<div>
			<div className="d-flex justify-content-between align-items-center mb-4">
				<h1 className="h3 mb-0">{t('payments.title')}</h1>
			</div>

			{/* Stats Cards */}
			<div className="row g-3 mb-4">
				<div className="col-md-3">
					<div className="card border-0 shadow-sm h-100">
						<div className="card-body text-center">
							<h3 className="text-success mb-0">${totalReceived.toFixed(2)}</h3>
							<small className="text-muted">Total Received</small>
							<div className="mt-1">
								<span className="badge bg-success">{getCountByStatus('succeeded')}</span>
							</div>
						</div>
					</div>
				</div>
				<div className="col-md-3">
					<div className="card border-0 shadow-sm h-100">
						<div className="card-body text-center">
							<h3 className="text-warning mb-0">${totalPending.toFixed(2)}</h3>
							<small className="text-muted">Pending</small>
							<div className="mt-1">
								<span className="badge bg-warning">{getCountByStatus('pending')}</span>
							</div>
						</div>
					</div>
				</div>
				<div className="col-md-3">
					<div className="card border-0 shadow-sm h-100">
						<div className="card-body text-center">
							<h3 className="text-secondary mb-0">${totalRefunded.toFixed(2)}</h3>
							<small className="text-muted">Refunded</small>
							<div className="mt-1">
								<span className="badge bg-secondary">{getCountByStatus('refunded')}</span>
							</div>
						</div>
					</div>
				</div>
				<div className="col-md-3">
					<div className="card border-0 shadow-sm h-100">
						<div className="card-body text-center">
							<h3 className="text-danger mb-0">${getTotalByStatus('failed').toFixed(2)}</h3>
							<small className="text-muted">Failed</small>
							<div className="mt-1">
								<span className="badge bg-danger">{getCountByStatus('failed')}</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Filters */}
			<div className="card border-0 shadow-sm mb-4">
				<div className="card-body">
					<div className="row g-3">
						<div className="col-md-6">
							<input
								type="text"
								className="form-control"
								placeholder={`${tCommon('search')} by transaction ID, name, email...`}
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</div>
						<div className="col-md-3">
							<select
								className="form-select"
								value={statusFilter}
								onChange={(e) => setStatusFilter(e.target.value)}
							>
								<option value="all">All Status</option>
								<option value="pending">Pending</option>
								<option value="processing">Processing</option>
								<option value="succeeded">Succeeded</option>
								<option value="failed">Failed</option>
								<option value="refunded">Refunded</option>
							</select>
						</div>
						<div className="col-md-3 text-end">
							<span className="text-muted">
								{filteredPayments.length} payments
							</span>
						</div>
					</div>
				</div>
			</div>

			{error && (
				<div className="alert alert-danger">{error}</div>
			)}

			{/* Payments Table */}
			<div className="card border-0 shadow-sm">
				<div className="card-body p-0">
					<div className="table-responsive">
						<table className="table table-hover mb-0">
							<thead className="bg-light">
								<tr>
									<th className="border-0">{t('payments.transactionId')}</th>
									<th className="border-0">Customer</th>
									<th className="border-0">Booking</th>
									<th className="border-0">{t('payments.amount')}</th>
									<th className="border-0">Method</th>
									<th className="border-0">{t('payments.status')}</th>
									<th className="border-0">{t('payments.date')}</th>
									<th className="border-0">Actions</th>
								</tr>
							</thead>
							<tbody>
								{filteredPayments.length > 0 ? (
									filteredPayments.map((payment) => (
										<tr key={payment._id}>
											<td>
												<strong className="text-primary">{payment.transactionId}</strong>
												{payment.stripePaymentIntentId && (
													<>
														<br />
														<small className="text-muted" style={{ fontSize: '0.7rem' }}>
															{payment.stripePaymentIntentId.substring(0, 20)}...
														</small>
													</>
												)}
											</td>
											<td>
												<div>
													<strong>{payment.user?.name || 'N/A'}</strong>
													<br />
													<small className="text-muted">{payment.user?.email || ''}</small>
												</div>
											</td>
											<td>
												{payment.booking?.bookingNumber ? (
													<span className="badge bg-light text-dark">
														{payment.booking.bookingNumber}
													</span>
												) : (
													<span className="text-muted">-</span>
												)}
											</td>
											<td>
												<strong>${payment.amount.toFixed(2)}</strong>
												<small className="text-muted ms-1">{payment.currency}</small>
												{payment.refund && (
													<>
														<br />
														<small className="text-danger">
															Refunded: ${payment.refund.amount.toFixed(2)}
														</small>
													</>
												)}
											</td>
											<td>
												<span className="text-capitalize">
													{payment.paymentMethod?.type || 'card'}
												</span>
												{payment.paymentMethod?.last4 && (
													<>
														<br />
														<small className="text-muted">
															****{payment.paymentMethod.last4}
														</small>
													</>
												)}
											</td>
											<td>
												<span className={`badge ${getStatusBadge(payment.status)}`}>
													{payment.status}
												</span>
											</td>
											<td>
												<small>
													{new Date(payment.createdAt).toLocaleDateString()}
													<br />
													{new Date(payment.createdAt).toLocaleTimeString()}
												</small>
											</td>
											<td>
												{payment.status === 'succeeded' && (
													<button
														className="btn btn-sm btn-outline-danger"
														onClick={() => handleRefund(payment._id, payment.amount)}
														disabled={processingRefund === payment._id}
													>
														{processingRefund === payment._id ? (
															<span className="spinner-border spinner-border-sm" />
														) : (
															t('payments.refund')
														)}
													</button>
												)}
												{payment.status === 'refunded' && (
													<span className="text-muted small">Refunded</span>
												)}
											</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan={8} className="text-center py-4 text-muted">
											No payments found
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	)
}
