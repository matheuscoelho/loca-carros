'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

interface Booking {
	_id: string
	bookingNumber: string
	userId: string
	carId: string
	car?: {
		_id: string
		name: string
		brand: string
		model: string
		year: number
		images?: Array<{ url: string; isPrimary: boolean }>
	}
	user?: {
		name: string
		email: string
	}
	driverInfo?: {
		name: string
		email: string
		phone: string
		licenseNumber?: string
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
	extras?: Array<{ name: string; price: number; quantity: number }>
	status: string
	paymentStatus: string
	notes?: string
	createdAt: string
	updatedAt: string
}

export default function BookingDetailPage({ params }: { params: { id: string } }) {
	const t = useTranslations('admin')
	const tCommon = useTranslations('common')
	const tBooking = useTranslations('booking')
	const router = useRouter()
	const [booking, setBooking] = useState<Booking | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [saving, setSaving] = useState(false)

	useEffect(() => {
		fetchBooking()
	}, [params.id])

	const fetchBooking = async () => {
		try {
			const response = await fetch(`/api/bookings/${params.id}`)
			if (!response.ok) {
				throw new Error('Booking not found')
			}
			const data = await response.json()
			setBooking(data.booking)
		} catch (err) {
			setError('Reserva não encontrada')
		} finally {
			setLoading(false)
		}
	}

	const handleStatusChange = async (newStatus: string) => {
		if (!booking) return
		setSaving(true)
		try {
			const response = await fetch(`/api/bookings/${params.id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ status: newStatus }),
			})
			if (response.ok) {
				setBooking({ ...booking, status: newStatus })
			}
		} catch (err) {
			console.error('Error updating status:', err)
		} finally {
			setSaving(false)
		}
	}

	const getStatusBadge = (status: string) => {
		const badges: Record<string, string> = {
			pending: 'bg-warning text-dark',
			confirmed: 'bg-info',
			in_progress: 'bg-primary',
			completed: 'bg-success',
			cancelled: 'bg-danger',
		}
		return badges[status] || 'bg-secondary'
	}

	const getPaymentBadge = (status: string) => {
		const badges: Record<string, string> = {
			pending: 'bg-warning text-dark',
			paid: 'bg-success',
			failed: 'bg-danger',
			refunded: 'bg-secondary',
		}
		return badges[status] || 'bg-secondary'
	}

	const getStatusLabel = (status: string) => {
		const labels: Record<string, string> = {
			pending: 'Pendente',
			confirmed: 'Confirmada',
			in_progress: 'Em Andamento',
			completed: 'Concluída',
			cancelled: 'Cancelada',
		}
		return labels[status] || status
	}

	const getPaymentLabel = (status: string) => {
		const labels: Record<string, string> = {
			pending: 'Pendente',
			paid: 'Pago',
			failed: 'Falhou',
			refunded: 'Reembolsado',
		}
		return labels[status] || status
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

	if (error || !booking) {
		return (
			<div className="text-center py-5">
				<h4 className="text-danger">{error || 'Reserva não encontrada'}</h4>
				<Link href="/admin/bookings" className="btn btn-primary mt-3">
					Voltar para Reservas
				</Link>
			</div>
		)
	}

	return (
		<div>
			{/* Header */}
			<div className="d-flex justify-content-between align-items-center mb-4">
				<div>
					<h1 className="h3 mb-1">Reserva #{booking.bookingNumber}</h1>
					<p className="text-muted mb-0">
						Criada em {new Date(booking.createdAt).toLocaleString('pt-BR')}
					</p>
				</div>
				<div className="d-flex gap-2">
					<Link href="/admin/bookings" className="btn btn-outline-secondary">
						{tCommon('back')}
					</Link>
				</div>
			</div>

			<div className="row">
				{/* Main Content */}
				<div className="col-lg-8">
					{/* Status Cards */}
					<div className="row g-3 mb-4">
						<div className="col-6">
							<div className="card border-0 shadow-sm h-100">
								<div className="card-body">
									<h6 className="text-muted mb-2">Status da Reserva</h6>
									<select
										className="form-select"
										value={booking.status}
										onChange={(e) => handleStatusChange(e.target.value)}
										disabled={saving}
									>
										<option value="pending">Pendente</option>
										<option value="confirmed">Confirmada</option>
										<option value="in_progress">Em Andamento</option>
										<option value="completed">Concluída</option>
										<option value="cancelled">Cancelada</option>
									</select>
								</div>
							</div>
						</div>
						<div className="col-6">
							<div className="card border-0 shadow-sm h-100">
								<div className="card-body">
									<h6 className="text-muted mb-2">Status do Pagamento</h6>
									<span className={`badge ${getPaymentBadge(booking.paymentStatus)} fs-6`}>
										{getPaymentLabel(booking.paymentStatus)}
									</span>
								</div>
							</div>
						</div>
					</div>

					{/* Vehicle Info */}
					<div className="card border-0 shadow-sm mb-4">
						<div className="card-header bg-white">
							<h5 className="mb-0">Veículo</h5>
						</div>
						<div className="card-body">
							<div className="d-flex gap-3">
								{booking.car?.images?.[0]?.url && (
									<img
										src={booking.car.images[0].url}
										alt={booking.car.name}
										className="rounded"
										style={{ width: '120px', height: '80px', objectFit: 'cover' }}
										onError={(e) => {
											(e.target as HTMLImageElement).src = '/assets/imgs/template/placeholder-car.jpg'
										}}
									/>
								)}
								<div>
									<h5 className="mb-1">{booking.car?.name || 'N/A'}</h5>
									<p className="text-muted mb-1">
										{booking.car?.brand} {booking.car?.model} {booking.car?.year}
									</p>
									{booking.car?._id && (
										<Link
											href={`/admin/vehicles/${booking.car._id}/edit`}
											className="btn btn-sm btn-outline-primary"
										>
											Ver Veículo
										</Link>
									)}
								</div>
							</div>
						</div>
					</div>

					{/* Customer Info */}
					<div className="card border-0 shadow-sm mb-4">
						<div className="card-header bg-white">
							<h5 className="mb-0">Informações do Cliente</h5>
						</div>
						<div className="card-body">
							<div className="row">
								<div className="col-md-6">
									<p className="mb-2">
										<strong>Nome:</strong><br />
										{booking.driverInfo?.name || booking.user?.name || 'N/A'}
									</p>
									<p className="mb-2">
										<strong>Email:</strong><br />
										{booking.driverInfo?.email || booking.user?.email || 'N/A'}
									</p>
								</div>
								<div className="col-md-6">
									<p className="mb-2">
										<strong>Telefone:</strong><br />
										{booking.driverInfo?.phone || 'N/A'}
									</p>
									{booking.driverInfo?.licenseNumber && (
										<p className="mb-2">
											<strong>CNH:</strong><br />
											{booking.driverInfo.licenseNumber}
										</p>
									)}
								</div>
							</div>
						</div>
					</div>

					{/* Rental Period */}
					<div className="card border-0 shadow-sm mb-4">
						<div className="card-header bg-white">
							<h5 className="mb-0">Período do Aluguel</h5>
						</div>
						<div className="card-body">
							<div className="row">
								<div className="col-md-6">
									<div className="border rounded p-3 mb-3 mb-md-0">
										<h6 className="text-success mb-2">Retirada</h6>
										<p className="mb-1">
											<strong>{new Date(booking.pickupDate).toLocaleDateString('pt-BR')}</strong>
										</p>
										<p className="text-muted mb-0 small">
											{booking.pickupLocation || 'Local não especificado'}
										</p>
									</div>
								</div>
								<div className="col-md-6">
									<div className="border rounded p-3">
										<h6 className="text-danger mb-2">Devolução</h6>
										<p className="mb-1">
											<strong>{new Date(booking.dropoffDate).toLocaleDateString('pt-BR')}</strong>
										</p>
										<p className="text-muted mb-0 small">
											{booking.dropoffLocation || 'Local não especificado'}
										</p>
									</div>
								</div>
							</div>
							<div className="text-center mt-3">
								<span className="badge bg-primary fs-6">
									{booking.totalDays} {booking.totalDays === 1 ? 'dia' : 'dias'}
								</span>
							</div>
						</div>
					</div>

					{/* Extras */}
					{booking.extras && booking.extras.length > 0 && (
						<div className="card border-0 shadow-sm mb-4">
							<div className="card-header bg-white">
								<h5 className="mb-0">Extras</h5>
							</div>
							<div className="card-body">
								<ul className="list-group list-group-flush">
									{booking.extras.map((extra, index) => (
										<li key={index} className="list-group-item d-flex justify-content-between px-0">
											<span>{extra.name} {extra.quantity > 1 && `(x${extra.quantity})`}</span>
											<strong>R$ {(extra.price * (extra.quantity || 1)).toFixed(2)}</strong>
										</li>
									))}
								</ul>
							</div>
						</div>
					)}

					{/* Notes */}
					{booking.notes && (
						<div className="card border-0 shadow-sm mb-4">
							<div className="card-header bg-white">
								<h5 className="mb-0">Observações</h5>
							</div>
							<div className="card-body">
								<p className="mb-0">{booking.notes}</p>
							</div>
						</div>
					)}
				</div>

				{/* Sidebar - Pricing */}
				<div className="col-lg-4">
					<div className="card border-0 shadow-sm sticky-top" style={{ top: '100px' }}>
						<div className="card-header bg-white">
							<h5 className="mb-0">Resumo do Pagamento</h5>
						</div>
						<div className="card-body">
							<div className="d-flex justify-content-between mb-2">
								<span>Diária</span>
								<span>R$ {booking.pricing.dailyRate?.toFixed(2) || '0.00'}</span>
							</div>
							<div className="d-flex justify-content-between mb-2">
								<span>Subtotal ({booking.totalDays} dias)</span>
								<span>R$ {booking.pricing.subtotal?.toFixed(2) || '0.00'}</span>
							</div>
							{booking.pricing.extrasTotal > 0 && (
								<div className="d-flex justify-content-between mb-2">
									<span>Extras</span>
									<span>R$ {booking.pricing.extrasTotal.toFixed(2)}</span>
								</div>
							)}
							{booking.pricing.discount > 0 && (
								<div className="d-flex justify-content-between mb-2 text-success">
									<span>Desconto</span>
									<span>- R$ {booking.pricing.discount.toFixed(2)}</span>
								</div>
							)}
							<div className="d-flex justify-content-between mb-2">
								<span>Impostos</span>
								<span>R$ {booking.pricing.tax?.toFixed(2) || '0.00'}</span>
							</div>

							<hr />

							<div className="d-flex justify-content-between">
								<strong className="fs-5">Total</strong>
								<strong className="fs-5 text-primary">
									R$ {booking.pricing.total.toFixed(2)}
								</strong>
							</div>

							<hr />

							<div className="text-center">
								<span className={`badge ${getPaymentBadge(booking.paymentStatus)} fs-6 px-4 py-2`}>
									{getPaymentLabel(booking.paymentStatus)}
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
