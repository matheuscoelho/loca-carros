'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'

interface ReportData {
	revenue: {
		total: number
		thisMonth: number
		lastMonth: number
		growth: number
	}
	bookings: {
		total: number
		thisMonth: number
		byStatus: Record<string, number>
	}
	topVehicles: Array<{
		_id: string
		brand: string
		model: string
		count: number
		revenue: number
	}>
	recentActivity: Array<{
		_id: string
		type: string
		description: string
		date: string
	}>
}

export default function AdminReportsPage() {
	const t = useTranslations('admin')
	const tCommon = useTranslations('common')
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [period, setPeriod] = useState('month')
	const [data, setData] = useState<ReportData | null>(null)

	useEffect(() => {
		fetchReportData()
	}, [period])

	const fetchReportData = async () => {
		try {
			setLoading(true)

			// Fetch dashboard stats
			const dashboardRes = await fetch('/api/admin/dashboard')
			const dashboard = dashboardRes.ok ? await dashboardRes.json() : {}

			// Fetch bookings for detailed analysis
			const bookingsRes = await fetch('/api/bookings?limit=1000&admin=true')
			const bookingsData = bookingsRes.ok ? await bookingsRes.json() : { bookings: [] }
			const bookings = bookingsData.bookings || []

			// Calculate revenue
			const now = new Date()
			const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
			const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
			const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)

			let totalRevenue = 0
			let thisMonthRevenue = 0
			let lastMonthRevenue = 0
			const statusCounts: Record<string, number> = {}
			const vehicleStats: Record<string, { brand: string; model: string; count: number; revenue: number }> = {}

			bookings.forEach((booking: { pricing?: { total?: number }; createdAt: string; status: string; carId: string; car?: { brand?: string; model?: string } }) => {
				const amount = booking.pricing?.total || 0
				const createdAt = new Date(booking.createdAt)

				totalRevenue += amount

				if (createdAt >= thisMonthStart) {
					thisMonthRevenue += amount
				} else if (createdAt >= lastMonthStart && createdAt <= lastMonthEnd) {
					lastMonthRevenue += amount
				}

				// Count by status
				statusCounts[booking.status] = (statusCounts[booking.status] || 0) + 1

				// Track vehicle stats
				const carId = booking.carId?.toString() || 'unknown'
				if (!vehicleStats[carId]) {
					vehicleStats[carId] = {
						brand: booking.car?.brand || 'Unknown',
						model: booking.car?.model || 'Unknown',
						count: 0,
						revenue: 0
					}
				}
				vehicleStats[carId].count += 1
				vehicleStats[carId].revenue += amount
			})

			// Calculate growth
			const growth = lastMonthRevenue > 0
				? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
				: 0

			// Top vehicles
			const topVehicles = Object.entries(vehicleStats)
				.map(([id, stats]) => ({ _id: id, ...stats }))
				.sort((a, b) => b.count - a.count)
				.slice(0, 5)

			// Recent activity
			const recentActivity = bookings
				.slice(0, 10)
				.map((b: { _id: string; bookingNumber: string; status: string; createdAt: string }) => ({
					_id: b._id,
					type: 'booking',
					description: `Booking ${b.bookingNumber} - ${b.status}`,
					date: b.createdAt
				}))

			setData({
				revenue: {
					total: totalRevenue,
					thisMonth: thisMonthRevenue,
					lastMonth: lastMonthRevenue,
					growth: Math.round(growth * 100) / 100
				},
				bookings: {
					total: bookings.length,
					thisMonth: bookings.filter((b: { createdAt: string }) => new Date(b.createdAt) >= thisMonthStart).length,
					byStatus: statusCounts
				},
				topVehicles,
				recentActivity
			})
		} catch (err) {
			setError('Error loading report data')
			console.error(err)
		} finally {
			setLoading(false)
		}
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

	if (error || !data) {
		return (
			<div className="alert alert-danger">{error || 'Failed to load report'}</div>
		)
	}

	return (
		<div>
			<div className="d-flex justify-content-between align-items-center mb-4">
				<h1 className="h3 mb-0">{t('reports.title')}</h1>
				<div className="btn-group">
					<button
						className={`btn ${period === 'week' ? 'btn-primary' : 'btn-outline-primary'}`}
						onClick={() => setPeriod('week')}
					>
						This Week
					</button>
					<button
						className={`btn ${period === 'month' ? 'btn-primary' : 'btn-outline-primary'}`}
						onClick={() => setPeriod('month')}
					>
						This Month
					</button>
					<button
						className={`btn ${period === 'year' ? 'btn-primary' : 'btn-outline-primary'}`}
						onClick={() => setPeriod('year')}
					>
						This Year
					</button>
				</div>
			</div>

			{/* Revenue Stats */}
			<div className="row g-3 mb-4">
				<div className="col-md-3">
					<div className="card border-0 shadow-sm h-100 bg-primary text-white">
						<div className="card-body">
							<h6 className="mb-2 opacity-75">Total Revenue</h6>
							<h2 className="mb-0">${data.revenue.total.toFixed(2)}</h2>
						</div>
					</div>
				</div>
				<div className="col-md-3">
					<div className="card border-0 shadow-sm h-100">
						<div className="card-body">
							<h6 className="text-muted mb-2">This Month</h6>
							<h2 className="text-success mb-0">${data.revenue.thisMonth.toFixed(2)}</h2>
						</div>
					</div>
				</div>
				<div className="col-md-3">
					<div className="card border-0 shadow-sm h-100">
						<div className="card-body">
							<h6 className="text-muted mb-2">Last Month</h6>
							<h2 className="mb-0">${data.revenue.lastMonth.toFixed(2)}</h2>
						</div>
					</div>
				</div>
				<div className="col-md-3">
					<div className="card border-0 shadow-sm h-100">
						<div className="card-body">
							<h6 className="text-muted mb-2">Growth</h6>
							<h2 className={`mb-0 ${data.revenue.growth >= 0 ? 'text-success' : 'text-danger'}`}>
								{data.revenue.growth >= 0 ? '+' : ''}{data.revenue.growth}%
							</h2>
						</div>
					</div>
				</div>
			</div>

			<div className="row g-4">
				{/* Bookings by Status */}
				<div className="col-md-6">
					<div className="card border-0 shadow-sm h-100">
						<div className="card-header bg-white border-0">
							<h5 className="mb-0">{t('reports.bookings')}</h5>
						</div>
						<div className="card-body">
							<div className="d-flex justify-content-between align-items-center mb-4">
								<div>
									<h3 className="mb-0">{data.bookings.total}</h3>
									<small className="text-muted">Total Bookings</small>
								</div>
								<div className="text-end">
									<h4 className="text-primary mb-0">{data.bookings.thisMonth}</h4>
									<small className="text-muted">This Month</small>
								</div>
							</div>

							<h6 className="text-muted mb-3">By Status</h6>
							{Object.entries(data.bookings.byStatus).map(([status, count]) => {
								const percentage = data.bookings.total > 0 ? (count / data.bookings.total) * 100 : 0
								const colors: Record<string, string> = {
									pending: 'bg-warning',
									confirmed: 'bg-info',
									in_progress: 'bg-primary',
									completed: 'bg-success',
									cancelled: 'bg-danger'
								}

								return (
									<div key={status} className="mb-3">
										<div className="d-flex justify-content-between mb-1">
											<span className="text-capitalize">{status.replace('_', ' ')}</span>
											<span>{count} ({percentage.toFixed(0)}%)</span>
										</div>
										<div className="progress" style={{ height: '8px' }}>
											<div
												className={`progress-bar ${colors[status] || 'bg-secondary'}`}
												style={{ width: `${percentage}%` }}
											/>
										</div>
									</div>
								)
							})}
						</div>
					</div>
				</div>

				{/* Top Vehicles */}
				<div className="col-md-6">
					<div className="card border-0 shadow-sm h-100">
						<div className="card-header bg-white border-0">
							<h5 className="mb-0">{t('reports.vehicles')}</h5>
						</div>
						<div className="card-body">
							<h6 className="text-muted mb-3">Most Rented Vehicles</h6>
							{data.topVehicles.length > 0 ? (
								<div className="table-responsive">
									<table className="table table-sm">
										<thead>
											<tr>
												<th className="border-0">#</th>
												<th className="border-0">Vehicle</th>
												<th className="border-0 text-end">Rentals</th>
												<th className="border-0 text-end">Revenue</th>
											</tr>
										</thead>
										<tbody>
											{data.topVehicles.map((vehicle, index) => (
												<tr key={vehicle._id}>
													<td>{index + 1}</td>
													<td>
														<strong>{vehicle.brand}</strong> {vehicle.model}
													</td>
													<td className="text-end">
														<span className="badge bg-primary">{vehicle.count}</span>
													</td>
													<td className="text-end text-success">
														${vehicle.revenue.toFixed(2)}
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							) : (
								<p className="text-muted text-center py-4">No data available</p>
							)}
						</div>
					</div>
				</div>

				{/* Recent Activity */}
				<div className="col-12">
					<div className="card border-0 shadow-sm">
						<div className="card-header bg-white border-0">
							<h5 className="mb-0">Recent Activity</h5>
						</div>
						<div className="card-body p-0">
							{data.recentActivity.length > 0 ? (
								<ul className="list-group list-group-flush">
									{data.recentActivity.map((activity) => (
										<li key={activity._id} className="list-group-item d-flex justify-content-between align-items-center">
											<div>
												<span className={`badge ${activity.type === 'booking' ? 'bg-info' : 'bg-success'} me-2`}>
													{activity.type}
												</span>
												{activity.description}
											</div>
											<small className="text-muted">
												{new Date(activity.date).toLocaleString()}
											</small>
										</li>
									))}
								</ul>
							) : (
								<p className="text-muted text-center py-4">No recent activity</p>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
