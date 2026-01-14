'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

const carTypes = ['Sedans', 'SUVs', 'Hatchbacks', 'Sports', 'Luxury', 'Electric', 'Convertibles', 'Minivans']
const fuelTypes = ['Gasoline', 'Diesel', 'Electric', 'Hybrid']
const transmissions = ['Automatic', 'Manual']

export default function NewVehiclePage() {
	const t = useTranslations('admin')
	const tCommon = useTranslations('common')
	const router = useRouter()
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const [formData, setFormData] = useState({
		name: '',
		brand: '',
		model: '',
		year: new Date().getFullYear(),
		licensePlate: '',
		carType: 'Sedans',
		fuelType: 'Gasoline',
		transmission: 'Automatic',
		specs: {
			seats: 5,
			doors: 4,
			bags: 3,
			mileage: 0,
		},
		pricing: {
			dailyRate: 0,
			weeklyRate: 0,
			deposit: 0,
			currency: 'USD',
		},
		amenities: [] as string[],
		images: [] as Array<{ url: string; isPrimary: boolean }>,
		location: {
			city: '',
			state: '',
			country: 'USA',
		},
		status: 'active',
	})

	const [newAmenity, setNewAmenity] = useState('')
	const [newImageUrl, setNewImageUrl] = useState('')

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target

		if (name.includes('.')) {
			const [parent, child] = name.split('.')
			setFormData(prev => ({
				...prev,
				[parent]: {
					...(prev as any)[parent],
					[child]: value,
				},
			}))
		} else {
			setFormData(prev => ({ ...prev, [name]: value }))
		}
	}

	const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		const numValue = parseFloat(value) || 0

		if (name.includes('.')) {
			const [parent, child] = name.split('.')
			setFormData(prev => ({
				...prev,
				[parent]: {
					...(prev as any)[parent],
					[child]: numValue,
				},
			}))
		} else {
			setFormData(prev => ({ ...prev, [name]: numValue }))
		}
	}

	const addAmenity = () => {
		if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
			setFormData(prev => ({
				...prev,
				amenities: [...prev.amenities, newAmenity.trim()],
			}))
			setNewAmenity('')
		}
	}

	const removeAmenity = (amenity: string) => {
		setFormData(prev => ({
			...prev,
			amenities: prev.amenities.filter(a => a !== amenity),
		}))
	}

	const addImage = () => {
		if (newImageUrl.trim()) {
			const isPrimary = formData.images.length === 0
			setFormData(prev => ({
				...prev,
				images: [...prev.images, { url: newImageUrl.trim(), isPrimary }],
			}))
			setNewImageUrl('')
		}
	}

	const removeImage = (index: number) => {
		setFormData(prev => {
			const newImages = prev.images.filter((_, i) => i !== index)
			// Se removeu a imagem primária, define a primeira como primária
			if (newImages.length > 0 && !newImages.some(img => img.isPrimary)) {
				newImages[0].isPrimary = true
			}
			return { ...prev, images: newImages }
		})
	}

	const setPrimaryImage = (index: number) => {
		setFormData(prev => ({
			...prev,
			images: prev.images.map((img, i) => ({
				...img,
				isPrimary: i === index,
			})),
		}))
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setLoading(true)
		setError(null)

		try {
			const response = await fetch('/api/cars', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData),
			})

			const data = await response.json()

			if (response.ok) {
				alert(t('vehicles.saveSuccess'))
				router.push('/admin/vehicles')
			} else {
				setError(data.error || 'Error creating vehicle')
			}
		} catch (err) {
			setError('Error creating vehicle')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div>
			<div className="d-flex justify-content-between align-items-center mb-4">
				<h1 className="h3 mb-0">{t('vehicles.addVehicle')}</h1>
				<Link href="/admin/vehicles" className="btn btn-outline-secondary">
					{tCommon('back')}
				</Link>
			</div>

			{error && (
				<div className="alert alert-danger">{error}</div>
			)}

			<form onSubmit={handleSubmit}>
				<div className="row">
					{/* Basic Info */}
					<div className="col-lg-8">
						<div className="card border-0 shadow-sm mb-4">
							<div className="card-header bg-white">
								<h5 className="mb-0">{t('vehicles.basicInfo')}</h5>
							</div>
							<div className="card-body">
								<div className="row g-3">
									<div className="col-md-6">
										<label className="form-label">Vehicle Name *</label>
										<input
											type="text"
											className="form-control"
											name="name"
											value={formData.name}
											onChange={handleChange}
											placeholder="e.g., BMW 3 Series 2024"
											required
										/>
									</div>
									<div className="col-md-6">
										<label className="form-label">License Plate *</label>
										<input
											type="text"
											className="form-control"
											name="licensePlate"
											value={formData.licensePlate}
											onChange={handleChange}
											placeholder="e.g., ABC-1234"
											required
										/>
									</div>
									<div className="col-md-4">
										<label className="form-label">Brand *</label>
										<input
											type="text"
											className="form-control"
											name="brand"
											value={formData.brand}
											onChange={handleChange}
											placeholder="e.g., BMW"
											required
										/>
									</div>
									<div className="col-md-4">
										<label className="form-label">Model *</label>
										<input
											type="text"
											className="form-control"
											name="model"
											value={formData.model}
											onChange={handleChange}
											placeholder="e.g., 330i"
											required
										/>
									</div>
									<div className="col-md-4">
										<label className="form-label">Year *</label>
										<input
											type="number"
											className="form-control"
											name="year"
											value={formData.year}
											onChange={handleNumberChange}
											min={2000}
											max={2030}
											required
										/>
									</div>
									<div className="col-md-4">
										<label className="form-label">Car Type *</label>
										<select
											className="form-select"
											name="carType"
											value={formData.carType}
											onChange={handleChange}
										>
											{carTypes.map(type => (
												<option key={type} value={type}>{type}</option>
											))}
										</select>
									</div>
									<div className="col-md-4">
										<label className="form-label">Fuel Type *</label>
										<select
											className="form-select"
											name="fuelType"
											value={formData.fuelType}
											onChange={handleChange}
										>
											{fuelTypes.map(type => (
												<option key={type} value={type}>{type}</option>
											))}
										</select>
									</div>
									<div className="col-md-4">
										<label className="form-label">Transmission *</label>
										<select
											className="form-select"
											name="transmission"
											value={formData.transmission}
											onChange={handleChange}
										>
											{transmissions.map(type => (
												<option key={type} value={type}>{type}</option>
											))}
										</select>
									</div>
								</div>
							</div>
						</div>

						{/* Specifications */}
						<div className="card border-0 shadow-sm mb-4">
							<div className="card-header bg-white">
								<h5 className="mb-0">{t('vehicles.specifications')}</h5>
							</div>
							<div className="card-body">
								<div className="row g-3">
									<div className="col-md-3">
										<label className="form-label">Seats</label>
										<input
											type="number"
											className="form-control"
											name="specs.seats"
											value={formData.specs.seats}
											onChange={handleNumberChange}
											min={1}
											max={15}
										/>
									</div>
									<div className="col-md-3">
										<label className="form-label">Doors</label>
										<input
											type="number"
											className="form-control"
											name="specs.doors"
											value={formData.specs.doors}
											onChange={handleNumberChange}
											min={1}
											max={6}
										/>
									</div>
									<div className="col-md-3">
										<label className="form-label">Bags</label>
										<input
											type="number"
											className="form-control"
											name="specs.bags"
											value={formData.specs.bags}
											onChange={handleNumberChange}
											min={0}
											max={10}
										/>
									</div>
									<div className="col-md-3">
										<label className="form-label">Mileage (km)</label>
										<input
											type="number"
											className="form-control"
											name="specs.mileage"
											value={formData.specs.mileage}
											onChange={handleNumberChange}
											min={0}
										/>
									</div>
								</div>
							</div>
						</div>

						{/* Amenities */}
						<div className="card border-0 shadow-sm mb-4">
							<div className="card-header bg-white">
								<h5 className="mb-0">Amenities</h5>
							</div>
							<div className="card-body">
								<div className="d-flex gap-2 mb-3">
									<input
										type="text"
										className="form-control"
										placeholder="Add amenity (e.g., Bluetooth, GPS, etc.)"
										value={newAmenity}
										onChange={(e) => setNewAmenity(e.target.value)}
										onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
									/>
									<button
										type="button"
										className="btn btn-outline-primary"
										onClick={addAmenity}
									>
										Add
									</button>
								</div>
								<div className="d-flex flex-wrap gap-2">
									{formData.amenities.map(amenity => (
										<span key={amenity} className="badge bg-light text-dark d-flex align-items-center gap-1">
											{amenity}
											<button
												type="button"
												className="btn-close btn-close-sm"
												onClick={() => removeAmenity(amenity)}
												style={{ fontSize: '0.5rem' }}
											/>
										</span>
									))}
									{formData.amenities.length === 0 && (
										<span className="text-muted">No amenities added</span>
									)}
								</div>
							</div>
						</div>

						{/* Location */}
						<div className="card border-0 shadow-sm mb-4">
							<div className="card-header bg-white">
								<h5 className="mb-0">Location</h5>
							</div>
							<div className="card-body">
								<div className="row g-3">
									<div className="col-md-4">
										<label className="form-label">City</label>
										<input
											type="text"
											className="form-control"
											name="location.city"
											value={formData.location.city}
											onChange={handleChange}
											placeholder="e.g., New York"
										/>
									</div>
									<div className="col-md-4">
										<label className="form-label">State</label>
										<input
											type="text"
											className="form-control"
											name="location.state"
											value={formData.location.state}
											onChange={handleChange}
											placeholder="e.g., NY"
										/>
									</div>
									<div className="col-md-4">
										<label className="form-label">Country</label>
										<input
											type="text"
											className="form-control"
											name="location.country"
											value={formData.location.country}
											onChange={handleChange}
											placeholder="e.g., USA"
										/>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Sidebar */}
					<div className="col-lg-4">
						{/* Pricing */}
						<div className="card border-0 shadow-sm mb-4">
							<div className="card-header bg-white">
								<h5 className="mb-0">{t('vehicles.pricing')}</h5>
							</div>
							<div className="card-body">
								<div className="mb-3">
									<label className="form-label">Daily Rate ($) *</label>
									<input
										type="number"
										className="form-control"
										name="pricing.dailyRate"
										value={formData.pricing.dailyRate}
										onChange={handleNumberChange}
										min={0}
										step={0.01}
										required
									/>
								</div>
								<div className="mb-3">
									<label className="form-label">Weekly Rate ($)</label>
									<input
										type="number"
										className="form-control"
										name="pricing.weeklyRate"
										value={formData.pricing.weeklyRate}
										onChange={handleNumberChange}
										min={0}
										step={0.01}
									/>
								</div>
								<div className="mb-3">
									<label className="form-label">Deposit ($)</label>
									<input
										type="number"
										className="form-control"
										name="pricing.deposit"
										value={formData.pricing.deposit}
										onChange={handleNumberChange}
										min={0}
										step={0.01}
									/>
								</div>
							</div>
						</div>

						{/* Images */}
						<div className="card border-0 shadow-sm mb-4">
							<div className="card-header bg-white">
								<h5 className="mb-0">{t('vehicles.images')}</h5>
							</div>
							<div className="card-body">
								<div className="d-flex gap-2 mb-3">
									<input
										type="text"
										className="form-control"
										placeholder="https://exemplo.com/imagem.jpg"
										value={newImageUrl}
										onChange={(e) => setNewImageUrl(e.target.value)}
										onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
									/>
									<button
										type="button"
										className="btn btn-outline-primary"
										onClick={addImage}
									>
										Adicionar
									</button>
								</div>

								{formData.images.length === 0 ? (
									<p className="text-muted small">Nenhuma imagem adicionada. Adicione pelo menos uma imagem.</p>
								) : (
									<div className="row g-2">
										{formData.images.map((image, index) => (
											<div key={index} className="col-6">
												<div className={`position-relative border rounded p-1 ${image.isPrimary ? 'border-primary border-2' : ''}`}>
													<img
														src={image.url}
														alt={`Imagem ${index + 1}`}
														className="img-fluid rounded"
														style={{ width: '100%', height: '80px', objectFit: 'cover' }}
														onError={(e) => {
															(e.target as HTMLImageElement).src = '/assets/imgs/template/placeholder-car.jpg'
														}}
													/>
													<div className="position-absolute top-0 end-0 p-1">
														<button
															type="button"
															className="btn btn-sm btn-danger"
															onClick={() => removeImage(index)}
															style={{ padding: '2px 6px', fontSize: '10px' }}
														>
															X
														</button>
													</div>
													{image.isPrimary ? (
														<span className="badge bg-primary position-absolute bottom-0 start-0 m-1" style={{ fontSize: '9px' }}>
															Principal
														</span>
													) : (
														<button
															type="button"
															className="btn btn-sm btn-outline-primary position-absolute bottom-0 start-0 m-1"
															onClick={() => setPrimaryImage(index)}
															style={{ padding: '1px 4px', fontSize: '9px' }}
														>
															Definir como principal
														</button>
													)}
												</div>
											</div>
										))}
									</div>
								)}
							</div>
						</div>

						{/* Status */}
						<div className="card border-0 shadow-sm mb-4">
							<div className="card-header bg-white">
								<h5 className="mb-0">Status</h5>
							</div>
							<div className="card-body">
								<select
									className="form-select"
									name="status"
									value={formData.status}
									onChange={handleChange}
								>
									<option value="active">{t('vehicles.status.active')}</option>
									<option value="inactive">{t('vehicles.status.inactive')}</option>
									<option value="maintenance">{t('vehicles.status.maintenance')}</option>
								</select>
							</div>
						</div>

						{/* Submit */}
						<div className="d-grid">
							<button
								type="submit"
								className="btn btn-primary btn-lg"
								disabled={loading}
							>
								{loading ? (
									<>
										<span className="spinner-border spinner-border-sm me-2" />
										Saving...
									</>
								) : (
									<>
										{tCommon('save')} Vehicle
									</>
								)}
							</button>
						</div>
					</div>
				</div>
			</form>
		</div>
	)
}
