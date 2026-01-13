'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import Layout from "@/components/layout/Layout"
import DashboardSidebar from "@/components/dashboard/DashboardSidebar"
import Link from "next/link"

interface Booking {
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
		images: Array<{ url: string; isPrimary: boolean }>
	}
	createdAt: string
}

interface Stats {
	totalBookings: number
	activeBookings: number
	pendingBookings: number
	completedBookings: number
	totalSpent: number
}

export default function Dashboard() {
	const t = useTranslations('dashboard')
	const tCommon = useTranslations('common')
	const { data: session, status } = useSession()
	const router = useRouter()

	const [stats, setStats] = useState<Stats>({
		totalBookings: 0,
		activeBookings: 0,
		pendingBookings: 0,
		completedBookings: 0,
		totalSpent: 0
	})
	const [recentBookings, setRecentBookings] = useState<Booking[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		if (session?.user) {
			fetchDashboardData()
		}
	}, [session])

	const fetchDashboardData = async () => {
		try {
			setLoading(true)

			// Fetch all bookings to calculate stats
			const response = await fetch('/api/bookings?limit=100')

			if (response.ok) {
				const data = await response.json()
				const bookings: Booking[] = data.bookings || []

				// Calculate stats
				const calculatedStats: Stats = {
					totalBookings: bookings.length,
					activeBookings: bookings.filter(b => b.status === 'active' || b.status === 'confirmed').length,
					pendingBookings: bookings.filter(b => b.status === 'pending').length,
					completedBookings: bookings.filter(b => b.status === 'completed').length,
					totalSpent: bookings
						.filter(b => b.paymentStatus === 'paid')
						.reduce((sum, b) => sum + (b.pricing?.total || 0), 0)
				}

				setStats(calculatedStats)

				// Get 3 most recent bookings
				setRecentBookings(bookings.slice(0, 3))
			}
		} catch (err) {
			console.error('Error fetching dashboard data:', err)
		} finally {
			setLoading(false)
		}
	}

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('pt-BR', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric'
		})
	}

	const getStatusBadge = (status: string) => {
		const colorMap: Record<string, string> = {
			pending: 'warning',
			confirmed: 'info',
			active: 'primary',
			completed: 'success',
			cancelled: 'danger',
		}
		const color = colorMap[status] || 'secondary'
		const label = t(`status.${status}`) || status
		return <span className={`badge bg-${color}`}>{label}</span>
	}

	const getCarImage = (car?: Booking['car']) => {
		if (!car?.images?.length) return '/assets/imgs/template/placeholder-car.jpg'
		const primary = car.images.find(img => img.isPrimary)
		return primary?.url || car.images[0]?.url || '/assets/imgs/template/placeholder-car.jpg'
	}

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

	const firstName = session.user?.name?.split(' ')[0] || ''

	return (
		<Layout footerStyle={1}>
			<div className="container pt-140 pb-170">
				<div className="row">
					<div className="col-lg-3 mb-4">
						<DashboardSidebar />
					</div>

					<div className="col-lg-9">
						<div className="border rounded-3 p-4 mb-4">
							<h4 className="mb-4">{t('welcome', { name: firstName })} 👋</h4>

							{/* Stats Cards */}
							{loading ? (
								<div className="text-center py-4">
									<div className="spinner-border spinner-border-sm text-primary" role="status">
										<span className="visually-hidden">{tCommon('loading')}</span>
									</div>
									<p className="small text-muted mt-2">{t('loadingStats')}</p>
								</div>
							) : (
								<div className="row g-3 mb-4">
									<div className="col-6 col-md-3">
										<div className="border rounded-3 p-3 text-center bg-light">
											<h3 className="text-primary mb-1">{stats.totalBookings}</h3>
											<p className="mb-0 text-muted small">{t('totalBookings')}</p>
										</div>
									</div>
									<div className="col-6 col-md-3">
										<div className="border rounded-3 p-3 text-center bg-light">
											<h3 className="text-info mb-1">{stats.activeBookings}</h3>
											<p className="mb-0 text-muted small">{t('activeRentals')}</p>
										</div>
									</div>
									<div className="col-6 col-md-3">
										<div className="border rounded-3 p-3 text-center bg-light">
											<h3 className="text-warning mb-1">{stats.pendingBookings}</h3>
											<p className="mb-0 text-muted small">{t('pendingBookings')}</p>
										</div>
									</div>
									<div className="col-6 col-md-3">
										<div className="border rounded-3 p-3 text-center bg-light">
											<h3 className="text-success mb-1">{stats.completedBookings}</h3>
											<p className="mb-0 text-muted small">{t('completedRentals')}</p>
										</div>
									</div>
								</div>
							)}

							{/* Total Spent */}
							{!loading && stats.totalSpent > 0 && (
								<div className="alert alert-light border mb-4">
									<div className="d-flex justify-content-between align-items-center">
										<span className="text-muted">{t('totalSpent')}</span>
										<strong className="text-primary fs-5">R$ {stats.totalSpent.toFixed(2)}</strong>
									</div>
								</div>
							)}

							{/* Quick Actions */}
							<h5 className="mb-3">{t('quickActions')}</h5>
							<div className="row g-3">
								<div className="col-md-6">
									<Link href="/cars-list-1" className="btn btn-primary w-100 py-3">
										🚗 {t('findVehicle')}
									</Link>
								</div>
								<div className="col-md-6">
									<Link href="/dashboard/my-rentals" className="btn btn-outline-primary w-100 py-3">
										📋 {t('viewMyRentals')}
									</Link>
								</div>
							</div>
						</div>

						{/* Recent Activity */}
						<div className="border rounded-3 p-4">
							<div className="d-flex justify-content-between align-items-center mb-3">
								<h5 className="mb-0">{t('recentActivity')}</h5>
								{recentBookings.length > 0 && (
									<Link href="/dashboard/my-rentals" className="btn btn-sm btn-link">
										{t('viewAll')} →
									</Link>
								)}
							</div>

							{loading ? (
								<div className="text-center py-4">
									<div className="spinner-border spinner-border-sm text-primary" role="status">
										<span className="visually-hidden">{tCommon('loading')}</span>
									</div>
								</div>
							) : recentBookings.length === 0 ? (
								<div className="text-center py-5 text-muted">
									<div className="mb-3" style={{ fontSize: '48px' }}>📋</div>
									<p className="mb-0">{t('noRecentActivity')}</p>
									<p className="small">{t('activityWillAppear')}</p>
								</div>
							) : (
								<div className="list-group list-group-flush">
									{recentBookings.map((booking) => (
										<div key={booking._id} className="list-group-item px-0 py-3">
											<div className="d-flex gap-3 align-items-center">
												<img
													src={getCarImage(booking.car)}
													alt={booking.car ? `${booking.car.brand} ${booking.car.model}` : t('vehicle')}
													className="rounded"
													style={{ width: '70px', height: '50px', objectFit: 'cover' }}
												/>
												<div className="flex-grow-1">
													<div className="d-flex justify-content-between align-items-start">
														<div>
															<h6 className="mb-1">
																{booking.car ? `${booking.car.brand} ${booking.car.model}` : t('vehicle')}
															</h6>
															<small className="text-muted">
																#{booking.bookingNumber} • {formatDate(booking.pickupDate)} - {formatDate(booking.dropoffDate)}
															</small>
														</div>
														<div className="text-end">
															{getStatusBadge(booking.status)}
															<div className="mt-1">
																<strong className="text-primary">R$ {booking.pricing?.total?.toFixed(2) || '0,00'}</strong>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</Layout>
	)
}
