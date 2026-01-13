'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import Layout from "@/components/layout/Layout"
import DashboardSidebar from "@/components/dashboard/DashboardSidebar"
import Link from 'next/link'

interface Booking {
	_id: string
	bookingNumber: string
	pickupDate: string
	dropoffDate: string
	pickupLocation: string
	dropoffLocation: string
	totalDays: number
	status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled'
	paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed'
	pricing: {
		dailyRate: number
		subtotal: number
		extrasTotal: number
		tax: number
		discount: number
		total: number
		currency: string
	}
	car?: {
		_id: string
		brand: string
		model: string
		year: number
		images: Array<{ url: string; isPrimary: boolean }>
	}
	createdAt: string
}

export default function MyRentals() {
	const t = useTranslations('dashboard')
	const tBooking = useTranslations('booking')
	const tCommon = useTranslations('common')
	const { data: session, status } = useSession()
	const router = useRouter()

	const [bookings, setBookings] = useState<Booking[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [statusFilter, setStatusFilter] = useState<string>('')
	const [pagination, setPagination] = useState({
		page: 1,
		limit: 10,
		total: 0,
		totalPages: 0
	})

	useEffect(() => {
		if (session?.user) {
			fetchBookings()
		}
	}, [session, statusFilter, pagination.page])

	const fetchBookings = async () => {
		try {
			setLoading(true)
			setError(null)

			const params = new URLSearchParams()
			params.set('page', pagination.page.toString())
			params.set('limit', pagination.limit.toString())
			if (statusFilter) {
				params.set('status', statusFilter)
			}

			const response = await fetch(`/api/bookings?${params.toString()}`)

			if (!response.ok) {
				throw new Error('Failed to fetch bookings')
			}

			const data = await response.json()
			setBookings(data.bookings || [])
			setPagination(prev => ({
				...prev,
				total: data.pagination?.total || 0,
				totalPages: data.pagination?.totalPages || 0
			}))
		} catch (err) {
			console.error('Error fetching bookings:', err)
			setError('Erro ao carregar reservas')
		} finally {
			setLoading(false)
		}
	}

	const getStatusBadge = (status: string) => {
		const statusMap: Record<string, { color: string; label: string }> = {
			pending: { color: 'warning', label: 'Pendente' },
			confirmed: { color: 'info', label: 'Confirmada' },
			active: { color: 'primary', label: 'Em Andamento' },
			completed: { color: 'success', label: 'Concluída' },
			cancelled: { color: 'danger', label: 'Cancelada' },
		}
		const config = statusMap[status] || { color: 'secondary', label: status }
		return <span className={`badge bg-${config.color}`}>{config.label}</span>
	}

	const getPaymentBadge = (status: string) => {
		const statusMap: Record<string, { color: string; label: string }> = {
			pending: { color: 'warning', label: 'Aguardando' },
			paid: { color: 'success', label: 'Pago' },
			refunded: { color: 'info', label: 'Reembolsado' },
			failed: { color: 'danger', label: 'Falhou' },
		}
		const config = statusMap[status] || { color: 'secondary', label: status }
		return <span className={`badge bg-${config.color}`}>{config.label}</span>
	}

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('pt-BR', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric'
		})
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

	return (
		<Layout footerStyle={1}>
			<div className="container pt-140 pb-170">
				<div className="row">
					<div className="col-lg-3 mb-4">
						<DashboardSidebar />
					</div>

					<div className="col-lg-9">
						<div className="border rounded-3 p-4">
							<div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
								<h4 className="mb-0">{t('myRentals')}</h4>

								<div className="d-flex gap-2 align-items-center">
									<label className="text-muted small me-2">Filtrar:</label>
									<select
										className="form-select form-select-sm"
										style={{ width: 'auto' }}
										value={statusFilter}
										onChange={(e) => {
											setStatusFilter(e.target.value)
											setPagination(prev => ({ ...prev, page: 1 }))
										}}
									>
										<option value="">Todas</option>
										<option value="pending">Pendentes</option>
										<option value="confirmed">Confirmadas</option>
										<option value="active">Em Andamento</option>
										<option value="completed">Concluídas</option>
										<option value="cancelled">Canceladas</option>
									</select>
								</div>
							</div>

							{loading ? (
								<div className="text-center py-5">
									<div className="spinner-border text-primary" role="status">
										<span className="visually-hidden">{tCommon('loading')}</span>
									</div>
									<p className="mt-3">Carregando reservas...</p>
								</div>
							) : error ? (
								<div className="alert alert-danger text-center">
									{error}
									<button className="btn btn-sm btn-primary ms-3" onClick={fetchBookings}>
										Tentar novamente
									</button>
								</div>
							) : bookings.length === 0 ? (
								<div className="text-center py-5">
									<div className="mb-3" style={{ fontSize: '64px' }}>🚗</div>
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
										{bookings.map((booking) => (
											<div key={booking._id} className="card mb-3">
												<div className="card-body">
													<div className="d-flex gap-3">
														<img
															src={getCarImage(booking.car)}
															alt={booking.car ? `${booking.car.brand} ${booking.car.model}` : 'Vehicle'}
															className="rounded"
															style={{ width: '80px', height: '60px', objectFit: 'cover' }}
														/>
														<div className="flex-grow-1">
															<h6 className="mb-1">
																{booking.car ? `${booking.car.brand} ${booking.car.model}` : 'Veículo'}
															</h6>
															<small className="text-muted">#{booking.bookingNumber}</small>
														</div>
													</div>
													<hr />
													<div className="row small">
														<div className="col-6 mb-2">
															<span className="text-muted">Retirada:</span><br />
															{formatDate(booking.pickupDate)}
														</div>
														<div className="col-6 mb-2">
															<span className="text-muted">Devolução:</span><br />
															{formatDate(booking.dropoffDate)}
														</div>
														<div className="col-6 mb-2">
															<span className="text-muted">Status:</span><br />
															{getStatusBadge(booking.status)}
														</div>
														<div className="col-6 mb-2">
															<span className="text-muted">Pagamento:</span><br />
															{getPaymentBadge(booking.paymentStatus)}
														</div>
													</div>
													<div className="d-flex justify-content-between align-items-center mt-2">
														<strong className="text-primary">
															${booking.pricing?.total?.toFixed(2) || '0.00'}
														</strong>
														<Link
															href={`/booking/confirmation?id=${booking._id}`}
															className="btn btn-sm btn-outline-primary"
														>
															Ver Detalhes
														</Link>
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
													<th>Veículo</th>
													<th>{tBooking('bookingNumber')}</th>
													<th>Retirada</th>
													<th>Devolução</th>
													<th>Valor</th>
													<th>Status</th>
													<th>Pagamento</th>
													<th>{tCommon('view')}</th>
												</tr>
											</thead>
											<tbody>
												{bookings.map((booking) => (
													<tr key={booking._id}>
														<td>
															<div className="d-flex align-items-center gap-2">
																<img
																	src={getCarImage(booking.car)}
																	alt={booking.car ? `${booking.car.brand} ${booking.car.model}` : 'Vehicle'}
																	className="rounded"
																	style={{ width: '60px', height: '45px', objectFit: 'cover' }}
																/>
																<div>
																	<small className="fw-bold">
																		{booking.car ? `${booking.car.brand} ${booking.car.model}` : 'Veículo'}
																	</small>
																	{booking.car?.year && (
																		<small className="d-block text-muted">{booking.car.year}</small>
																	)}
																</div>
															</div>
														</td>
														<td>
															<small className="text-muted">#{booking.bookingNumber}</small>
														</td>
														<td>
															<small>{formatDate(booking.pickupDate)}</small>
														</td>
														<td>
															<small>{formatDate(booking.dropoffDate)}</small>
														</td>
														<td>
															<strong className="text-primary">
																${booking.pricing?.total?.toFixed(2) || '0.00'}
															</strong>
														</td>
														<td>{getStatusBadge(booking.status)}</td>
														<td>{getPaymentBadge(booking.paymentStatus)}</td>
														<td>
															<Link
																href={`/booking/confirmation?id=${booking._id}`}
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

									{/* Paginação */}
									{pagination.totalPages > 1 && (
										<nav className="mt-4">
											<ul className="pagination justify-content-center mb-0">
												<li className={`page-item ${pagination.page === 1 ? 'disabled' : ''}`}>
													<button
														className="page-link"
														onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
														disabled={pagination.page === 1}
													>
														Anterior
													</button>
												</li>
												{[...Array(pagination.totalPages)].map((_, i) => (
													<li
														key={i + 1}
														className={`page-item ${pagination.page === i + 1 ? 'active' : ''}`}
													>
														<button
															className="page-link"
															onClick={() => setPagination(prev => ({ ...prev, page: i + 1 }))}
														>
															{i + 1}
														</button>
													</li>
												))}
												<li className={`page-item ${pagination.page === pagination.totalPages ? 'disabled' : ''}`}>
													<button
														className="page-link"
														onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
														disabled={pagination.page === pagination.totalPages}
													>
														Próximo
													</button>
												</li>
											</ul>
										</nav>
									)}

									<div className="text-center mt-3 text-muted small">
										Mostrando {bookings.length} de {pagination.total} reserva{pagination.total !== 1 ? 's' : ''}
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
