'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

interface Car {
	_id: string
	name: string
	brand: string
	model: string
	year: number
	licensePlate: string
	carType: string
	fuelType: string
	transmission: string
	pricing: {
		dailyRate: number
		currency: string
	}
	images: Array<{ url: string; isPrimary: boolean }>
	status: string
	rating: number
	totalBookings: number
	createdAt: string
}

export default function AdminVehiclesPage() {
	const t = useTranslations('admin')
	const tCommon = useTranslations('common')
	const [cars, setCars] = useState<Car[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [deleteId, setDeleteId] = useState<string | null>(null)
	const [searchTerm, setSearchTerm] = useState('')
	const [statusFilter, setStatusFilter] = useState('all')

	useEffect(() => {
		fetchCars()
	}, [])

	const fetchCars = async () => {
		try {
			const response = await fetch('/api/cars?limit=100')
			if (!response.ok) {
				throw new Error('Failed to fetch cars')
			}
			const data = await response.json()
			setCars(data.cars)
		} catch (err) {
			setError('Error loading vehicles')
			console.error(err)
		} finally {
			setLoading(false)
		}
	}

	const handleDelete = async (id: string) => {
		if (!confirm(t('vehicles.confirmDelete'))) return

		try {
			const response = await fetch(`/api/cars/${id}`, {
				method: 'DELETE',
			})

			if (response.ok) {
				setCars(cars.filter(car => car._id !== id))
				alert(t('vehicles.deleteSuccess'))
			} else {
				throw new Error('Failed to delete')
			}
		} catch (err) {
			alert('Error deleting vehicle')
		}
	}

	const handleStatusChange = async (id: string, newStatus: string) => {
		try {
			const response = await fetch(`/api/cars/${id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ status: newStatus }),
			})

			if (response.ok) {
				setCars(cars.map(car =>
					car._id === id ? { ...car, status: newStatus } : car
				))
			}
		} catch (err) {
			console.error('Error updating status:', err)
		}
	}

	const filteredCars = cars.filter(car => {
		const matchesSearch = car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
			car.licensePlate.toLowerCase().includes(searchTerm.toLowerCase())
		const matchesStatus = statusFilter === 'all' || car.status === statusFilter
		return matchesSearch && matchesStatus
	})

	const getStatusBadge = (status: string) => {
		const badges: Record<string, string> = {
			active: 'bg-success',
			inactive: 'bg-secondary',
			maintenance: 'bg-warning',
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
				<h1 className="h3 mb-0">{t('vehicles.title')}</h1>
				<Link href="/admin/vehicles/new" className="btn btn-primary">
					+ {t('vehicles.addVehicle')}
				</Link>
			</div>

			{/* Filters */}
			<div className="card border-0 shadow-sm mb-4">
				<div className="card-body">
					<div className="row g-3">
						<div className="col-md-6">
							<input
								type="text"
								className="form-control"
								placeholder={`${tCommon('search')}...`}
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
								<option value="all">{tCommon('all')} Status</option>
								<option value="active">{t('vehicles.status.active')}</option>
								<option value="inactive">{t('vehicles.status.inactive')}</option>
								<option value="maintenance">{t('vehicles.status.maintenance')}</option>
							</select>
						</div>
						<div className="col-md-3 text-end">
							<span className="text-muted">
								{filteredCars.length} vehicles
							</span>
						</div>
					</div>
				</div>
			</div>

			{error && (
				<div className="alert alert-danger">{error}</div>
			)}

			{/* Vehicles Table */}
			<div className="card border-0 shadow-sm">
				<div className="card-body p-0">
					<div className="table-responsive">
						<table className="table table-hover mb-0">
							<thead className="bg-light">
								<tr>
									<th className="border-0">Vehicle</th>
									<th className="border-0">Type</th>
									<th className="border-0">License</th>
									<th className="border-0">Price/Day</th>
									<th className="border-0">Status</th>
									<th className="border-0">Rating</th>
									<th className="border-0">Bookings</th>
									<th className="border-0">Actions</th>
								</tr>
							</thead>
							<tbody>
								{filteredCars.length > 0 ? (
									filteredCars.map((car) => (
										<tr key={car._id}>
											<td>
												<div className="d-flex align-items-center">
													<img
														src={car.images?.[0]?.url || '/assets/imgs/template/placeholder-car.jpg'}
														alt={car.name}
														className="rounded me-3"
														style={{ width: '60px', height: '40px', objectFit: 'cover' }}
													/>
													<div>
														<strong>{car.name}</strong>
														<br />
														<small className="text-muted">{car.brand} {car.model} {car.year}</small>
													</div>
												</div>
											</td>
											<td>
												<span className="badge bg-light text-dark">{car.carType}</span>
												<br />
												<small className="text-muted">{car.transmission}</small>
											</td>
											<td>
												<code>{car.licensePlate}</code>
											</td>
											<td>
												<strong>${car.pricing.dailyRate}</strong>
											</td>
											<td>
												<select
													className={`form-select form-select-sm ${getStatusBadge(car.status)} text-white`}
													value={car.status}
													onChange={(e) => handleStatusChange(car._id, e.target.value)}
													style={{ width: '120px' }}
												>
													<option value="active">{t('vehicles.status.active')}</option>
													<option value="inactive">{t('vehicles.status.inactive')}</option>
													<option value="maintenance">{t('vehicles.status.maintenance')}</option>
												</select>
											</td>
											<td>
												<span className="text-warning">★</span> {car.rating?.toFixed(1) || 'N/A'}
											</td>
											<td>{car.totalBookings || 0}</td>
											<td>
												<div className="btn-group btn-group-sm">
													<Link
														href={`/admin/vehicles/${car._id}/edit`}
														className="btn btn-outline-primary"
													>
														{tCommon('edit')}
													</Link>
													<button
														className="btn btn-outline-danger"
														onClick={() => handleDelete(car._id)}
													>
														{tCommon('delete')}
													</button>
												</div>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan={8} className="text-center py-4 text-muted">
											No vehicles found
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
