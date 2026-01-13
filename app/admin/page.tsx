'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

interface DashboardStats {
	users: {
		total: number
	}
	vehicles: {
		total: number
		active: number
		inactive: number
	}
	bookings: {
		total: number
		pending: number
		confirmed: number
		inProgress: number
		completed: number
		cancelled: number
		today: number
		thisMonth: number
	}
	payments: {
		pending: number
	}
	revenue: {
		total: number
		paidBookings: number
		monthly: Array<{
			month: number
			year: number
			revenue: number
			bookings: number
		}>
	}
	recentBookings: Array<{
		_id: string
		bookingNumber: string
		status: string
		paymentStatus: string
		pickupDate: string
		dropoffDate: string
		total: number
		createdAt: string
		carName: string
		carBrand: string
		customerName: string
		customerEmail: string
	}>
}

export default function AdminDashboard() {
	const t = useTranslations('admin')
	const tCommon = useTranslations('common')
	const [stats, setStats] = useState<DashboardStats | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		fetchStats()
	}, [])

	const fetchStats = async () => {
		try {
			const response = await fetch('/api/admin/dashboard')
			if (!response.ok) {
				throw new Error('Failed to fetch stats')
			}
			const data = await response.json()
			setStats(data.stats)
		} catch (err) {
			setError('Error loading dashboard')
			console.error(err)
		} finally {
			setLoading(false)
		}
	}

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

	if (error || !stats) {
		return (
			<div className="alert alert-danger">{error || 'Error loading data'}</div>
		)
	}

	return (
		<div>
			<div className="d-flex justify-content-between align-items-center mb-4">
				<h1 className="h3 mb-0">{t('dashboard.title')}</h1>
				<span className="text-muted">{new Date().toLocaleDateString()}</span>
			</div>

			{/* Stats Cards */}
			<div className="row g-4 mb-4">
				<div className="col-md-6 col-xl-3">
					<div className="card border-0 shadow-sm h-100">
						<div className="card-body">
							<div className="d-flex justify-content-between align-items-start">
								<div>
									<p className="text-muted mb-1">{t('dashboard.totalRevenue')}</p>
									<h3 className="mb-0 text-success">${stats.revenue.total.toLocaleString()}</h3>
								</div>
								<div className="bg-success bg-opacity-10 p-3 rounded">
									<svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="#198754" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
									</svg>
								</div>
							</div>
							<small className="text-muted">{stats.revenue.paidBookings} paid bookings</small>
						</div>
					</div>
				</div>

				<div className="col-md-6 col-xl-3">
					<div className="card border-0 shadow-sm h-100">
						<div className="card-body">
							<div className="d-flex justify-content-between align-items-start">
								<div>
									<p className="text-muted mb-1">{t('dashboard.totalBookings')}</p>
									<h3 className="mb-0 text-primary">{stats.bookings.total}</h3>
								</div>
								<div className="bg-primary bg-opacity-10 p-3 rounded">
									<svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
										<rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="#0d6efd" strokeWidth="2"/>
										<line x1="16" y1="2" x2="16" y2="6" stroke="#0d6efd" strokeWidth="2" strokeLinecap="round"/>
										<line x1="8" y1="2" x2="8" y2="6" stroke="#0d6efd" strokeWidth="2" strokeLinecap="round"/>
										<line x1="3" y1="10" x2="21" y2="10" stroke="#0d6efd" strokeWidth="2"/>
									</svg>
								</div>
							</div>
							<small className="text-muted">{stats.bookings.today} today, {stats.bookings.thisMonth} this month</small>
						</div>
					</div>
				</div>

				<div className="col-md-6 col-xl-3">
					<div className="card border-0 shadow-sm h-100">
						<div className="card-body">
							<div className="d-flex justify-content-between align-items-start">
								<div>
									<p className="text-muted mb-1">{t('dashboard.activeVehicles')}</p>
									<h3 className="mb-0 text-info">{stats.vehicles.active}</h3>
								</div>
								<div className="bg-info bg-opacity-10 p-3 rounded">
									<svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h2" stroke="#0dcaf0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
										<circle cx="7" cy="17" r="2" stroke="#0dcaf0" strokeWidth="2"/>
										<circle cx="17" cy="17" r="2" stroke="#0dcaf0" strokeWidth="2"/>
									</svg>
								</div>
							</div>
							<small className="text-muted">{stats.vehicles.total} total, {stats.vehicles.inactive} inactive</small>
						</div>
					</div>
				</div>

				<div className="col-md-6 col-xl-3">
					<div className="card border-0 shadow-sm h-100">
						<div className="card-body">
							<div className="d-flex justify-content-between align-items-start">
								<div>
									<p className="text-muted mb-1">{t('dashboard.totalUsers')}</p>
									<h3 className="mb-0 text-warning">{stats.users.total}</h3>
								</div>
								<div className="bg-warning bg-opacity-10 p-3 rounded">
									<svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="#ffc107" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
										<circle cx="9" cy="7" r="4" stroke="#ffc107" strokeWidth="2"/>
										<path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="#ffc107" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
									</svg>
								</div>
							</div>
							<small className="text-muted">Registered users</small>
						</div>
					</div>
				</div>
			</div>

			{/* Today's Stats & Booking Status */}
			<div className="row g-4 mb-4">
				<div className="col-lg-4">
					<div className="card border-0 shadow-sm h-100">
						<div className="card-header bg-white border-0">
							<h5 className="mb-0">{t('dashboard.todayStats')}</h5>
						</div>
						<div className="card-body">
							<div className="d-flex justify-content-between py-2 border-bottom">
								<span className="text-muted">{t('dashboard.newBookings')}</span>
								<strong>{stats.bookings.today}</strong>
							</div>
							<div className="d-flex justify-content-between py-2 border-bottom">
								<span className="text-muted">{t('dashboard.pendingPayments')}</span>
								<strong className="text-warning">{stats.payments.pending}</strong>
							</div>
							<div className="d-flex justify-content-between py-2">
								<span className="text-muted">{t('dashboard.activeRentals')}</span>
								<strong className="text-primary">{stats.bookings.inProgress}</strong>
							</div>
						</div>
					</div>
				</div>

				<div className="col-lg-8">
					<div className="card border-0 shadow-sm h-100">
						<div className="card-header bg-white border-0">
							<h5 className="mb-0">Booking Status Overview</h5>
						</div>
						<div className="card-body">
							<div className="row text-center">
								<div className="col">
									<div className="py-3">
										<span className="badge bg-warning mb-2" style={{ fontSize: '1.5rem' }}>{stats.bookings.pending}</span>
										<p className="mb-0 small text-muted">Pending</p>
									</div>
								</div>
								<div className="col">
									<div className="py-3">
										<span className="badge bg-info mb-2" style={{ fontSize: '1.5rem' }}>{stats.bookings.confirmed}</span>
										<p className="mb-0 small text-muted">Confirmed</p>
									</div>
								</div>
								<div className="col">
									<div className="py-3">
										<span className="badge bg-primary mb-2" style={{ fontSize: '1.5rem' }}>{stats.bookings.inProgress}</span>
										<p className="mb-0 small text-muted">In Progress</p>
									</div>
								</div>
								<div className="col">
									<div className="py-3">
										<span className="badge bg-success mb-2" style={{ fontSize: '1.5rem' }}>{stats.bookings.completed}</span>
										<p className="mb-0 small text-muted">Completed</p>
									</div>
								</div>
								<div className="col">
									<div className="py-3">
										<span className="badge bg-danger mb-2" style={{ fontSize: '1.5rem' }}>{stats.bookings.cancelled}</span>
										<p className="mb-0 small text-muted">Cancelled</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Recent Bookings */}
			<div className="card border-0 shadow-sm">
				<div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
					<h5 className="mb-0">{t('dashboard.recentBookings')}</h5>
					<Link href="/admin/bookings" className="btn btn-sm btn-outline-primary">
						{t('dashboard.viewAll')}
					</Link>
				</div>
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
								</tr>
							</thead>
							<tbody>
								{stats.recentBookings.length > 0 ? (
									stats.recentBookings.map((booking) => (
										<tr key={booking._id}>
											<td>
												<Link href={`/admin/bookings/${booking._id}`} className="text-decoration-none">
													{booking.bookingNumber}
												</Link>
											</td>
											<td>
												<div>
													<strong>{booking.customerName}</strong>
													<br />
													<small className="text-muted">{booking.customerEmail}</small>
												</div>
											</td>
											<td>
												{booking.carBrand} {booking.carName}
											</td>
											<td>
												<small>
													{new Date(booking.pickupDate).toLocaleDateString()}
													<br />
													{new Date(booking.dropoffDate).toLocaleDateString()}
												</small>
											</td>
											<td>
												<strong>${booking.total.toFixed(2)}</strong>
											</td>
											<td>
												<span className={`badge ${getStatusBadge(booking.status)}`}>
													{booking.status.replace('_', ' ')}
												</span>
											</td>
											<td>
												<span className={`badge ${getPaymentBadge(booking.paymentStatus)}`}>
													{booking.paymentStatus}
												</span>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan={7} className="text-center py-4 text-muted">
											No bookings yet
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
