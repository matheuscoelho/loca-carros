'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

interface Booking {
	_id: string
	bookingNumber: string
	userId: string
	carId: string
	car?: {
		name: string
		brand: string
	}
	user?: {
		name: string
		email: string
	}
	driverInfo?: {
		name: string
		email: string
		phone: string
	}
	pickupDate: string
	dropoffDate: string
	totalDays: number
	pickupLocation: string
	dropoffLocation: string
	pricing: {
		dailyRate: number
		total: number
		currency: string
	}
	status: string
	paymentStatus: string
	createdAt: string
}

export default function AdminBookingsPage() {
	const t = useTranslations('admin')
	const tCommon = useTranslations('common')
	const [bookings, setBookings] = useState<Booking[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [statusFilter, setStatusFilter] = useState('all')
	const [searchTerm, setSearchTerm] = useState('')

	useEffect(() => {
		fetchBookings()
	}, [])

	const fetchBookings = async () => {
		try {
			const response = await fetch('/api/bookings?limit=100&admin=true')
			if (!response.ok) {
				throw new Error('Failed to fetch bookings')
			}
			const data = await response.json()
			setBookings(data.bookings)
		} catch (err) {
			setError('Error loading bookings')
			console.error(err)
		} finally {
			setLoading(false)
		}
	}

	const handleStatusChange = async (id: string, newStatus: string) => {
		try {
			const response = await fetch(`/api/bookings/${id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ status: newStatus }),
			})

			if (response.ok) {
				setBookings(bookings.map(b =>
					b._id === id ? { ...b, status: newStatus } : b
				))
			}
		} catch (err) {
			console.error('Error updating status:', err)
		}
	}

	const filteredBookings = bookings.filter(booking => {
		const matchesSearch =
			booking.bookingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
			(booking.driverInfo?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
			(booking.driverInfo?.email || '').toLowerCase().includes(searchTerm.toLowerCase())
		const matchesStatus = statusFilter === 'all' || booking.status === statusFilter
		return matchesSearch && matchesStatus
	})

	const getStatusBadge = (status: string) => {
		const badges: Record<string, string> = {
			pending: 'bg-warning',
			confirmed: 'bg-info',
			in_progress: 'bg-primary',
			completed: 'bg-success',
			cancelled: 'bg-danger',
		}
		return badges[status] || 'bg-secondary'
	}

	const getPaymentBadge = (status: string) => {
		const badges: Record<string, string> = {
			pending: 'bg-warning',
			paid: 'bg-success',
			failed: 'bg-danger',
			refunded: 'bg-secondary',
		}
		return badges[status] || 'bg-secondary'
	}

	if (loading) {
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
				<h1 className="h3 mb-0">{t('bookings.title')}</h1>
			</div>

			{/* Stats Cards */}
			<div className="row g-3 mb-4">
				{['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'].map(status => (
					<div key={status} className="col">
						<div
							className={`card border-0 shadow-sm h-100 cursor-pointer ${statusFilter === status ? 'border-primary border-2' : ''}`}
							onClick={() => setStatusFilter(status === statusFilter ? 'all' : status)}
							style={{ cursor: 'pointer' }}
						>
							<div className="card-body text-center py-3">
								<span className={`badge ${getStatusBadge(status)} mb-2`} style={{ fontSize: '1.2rem' }}>
									{bookings.filter(b => b.status === status).length}
								</span>
								<p className="mb-0 small text-capitalize">{status.replace('_', ' ')}</p>
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Filters */}
			<div className="card border-0 shadow-sm mb-4">
				<div className="card-body">
					<div className="row g-3">
						<div className="col-md-6">
							<input
								type="text"
								className="form-control"
								placeholder={`${tCommon('search')} by booking #, name, email...`}
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
								<option value="all">{t('bookings.filters.all')}</option>
								<option value="pending">{t('bookings.filters.pending')}</option>
								<option value="confirmed">{t('bookings.filters.confirmed')}</option>
								<option value="in_progress">{t('bookings.filters.inProgress')}</option>
								<option value="completed">{t('bookings.filters.completed')}</option>
								<option value="cancelled">{t('bookings.filters.cancelled')}</option>
							</select>
						</div>
						<div className="col-md-3 text-end">
							<span className="text-muted">
								{filteredBookings.length} bookings
							</span>
						</div>
					</div>
				</div>
			</div>

			{error && (
				<div className="alert alert-danger">{error}</div>
			)}

			{/* Bookings Table */}
			<div className="card border-0 shadow-sm">
				<div className="card-body p-0">
					<div className="table-responsive">
						<table className="table table-hover mb-0">
							<thead className="bg-light">
								<tr>
									<th className="border-0">Booking #</th>
									<th className="border-0">Customer</th>
									<th className="border-0">Vehicle</th>
									<th className="border-0">Dates</th>
									<th className="border-0">Amount</th>
									<th className="border-0">Status</th>
									<th className="border-0">Payment</th>
									<th className="border-0">Actions</th>
								</tr>
							</thead>
							<tbody>
								{filteredBookings.length > 0 ? (
									filteredBookings.map((booking) => (
										<tr key={booking._id}>
											<td>
												<strong>{booking.bookingNumber}</strong>
												<br />
												<small className="text-muted">
													{new Date(booking.createdAt).toLocaleDateString()}
												</small>
											</td>
											<td>
												<div>
													<strong>{booking.driverInfo?.name || booking.user?.name || 'N/A'}</strong>
													<br />
													<small className="text-muted">
														{booking.driverInfo?.email || booking.user?.email || ''}
													</small>
												</div>
											</td>
											<td>
												{booking.car?.brand} {booking.car?.name || 'N/A'}
											</td>
											<td>
												<small>
													<strong>Pickup:</strong> {new Date(booking.pickupDate).toLocaleDateString()}
													<br />
													<strong>Return:</strong> {new Date(booking.dropoffDate).toLocaleDateString()}
													<br />
													<span className="badge bg-light text-dark">{booking.totalDays} days</span>
												</small>
											</td>
											<td>
												<strong>${booking.pricing.total.toFixed(2)}</strong>
											</td>
											<td>
												<select
													className={`form-select form-select-sm`}
													value={booking.status}
													onChange={(e) => handleStatusChange(booking._id, e.target.value)}
													style={{ width: '130px' }}
												>
													<option value="pending">Pending</option>
													<option value="confirmed">Confirmed</option>
													<option value="in_progress">In Progress</option>
													<option value="completed">Completed</option>
													<option value="cancelled">Cancelled</option>
												</select>
											</td>
											<td>
												<span className={`badge ${getPaymentBadge(booking.paymentStatus)}`}>
													{booking.paymentStatus}
												</span>
											</td>
											<td>
												<Link
													href={`/admin/bookings/${booking._id}`}
													className="btn btn-sm btn-outline-primary"
												>
													{tCommon('view')}
												</Link>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan={8} className="text-center py-4 text-muted">
											No bookings found
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
