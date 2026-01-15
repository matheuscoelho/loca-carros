'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import Layout from "@/components/layout/Layout"
import DashboardSidebar from "@/components/dashboard/DashboardSidebar"
import EmptyState from "@/components/ui/EmptyState"
import Link from 'next/link'
import Image from 'next/image'

interface Car {
	_id: string
	name: string
	brand: string
	model: string
	year: number
	images: Array<{ url: string; isPrimary: boolean }>
	pricing: {
		dailyRate: number
		currency: string
	}
	specifications: {
		transmission: string
		fuelType: string
		seats: number
	}
	ratings?: {
		overall: number
	}
}

export default function Favorites() {
	const t = useTranslations('dashboard')
	const tCommon = useTranslations('common')
	const { data: session, status } = useSession()
	const router = useRouter()

	const [cars, setCars] = useState<Car[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [removing, setRemoving] = useState<string | null>(null)

	const fetchFavorites = useCallback(async () => {
		if (!session?.user) return
		try {
			setLoading(true)
			const response = await fetch('/api/favorites')

			if (!response.ok) {
				throw new Error('Failed to fetch favorites')
			}

			const data = await response.json()
			setCars(data.cars || [])
		} catch (err) {
			console.error('Error fetching favorites:', err)
			setError(t('errorLoadingFavorites'))
		} finally {
			setLoading(false)
		}
	}, [session, t])

	useEffect(() => {
		fetchFavorites()
	}, [fetchFavorites])

	const removeFavorite = async (carId: string) => {
		try {
			setRemoving(carId)
			const response = await fetch(`/api/favorites?carId=${carId}`, {
				method: 'DELETE',
			})

			if (!response.ok) {
				throw new Error('Failed to remove favorite')
			}

			// Update local state
			setCars(prev => prev.filter(car => car._id !== carId))
		} catch (err) {
			console.error('Error removing favorite:', err)
			alert(t('errorRemovingFavorite'))
		} finally {
			setRemoving(null)
		}
	}

	const getCarImage = (car: Car) => {
		const primaryImage = car.images?.find(img => img.isPrimary)
		return primaryImage?.url || car.images?.[0]?.url || '/assets/imgs/page/homepage1/car-1.png'
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
							<div className="d-flex justify-content-between align-items-center mb-4">
								<h4 className="mb-0">{t('favorites')}</h4>
								{cars.length > 0 && (
									<span className="badge bg-primary">{cars.length} {t('vehicles')}</span>
								)}
							</div>

							{loading ? (
								<div className="text-center py-5">
									<div className="spinner-border text-primary" role="status">
										<span className="visually-hidden">{tCommon('loading')}</span>
									</div>
									<p className="mt-3">{t('loadingFavorites')}</p>
								</div>
							) : error ? (
								<div className="alert alert-danger text-center">
									{error}
									<button className="btn btn-sm btn-primary ms-3" onClick={fetchFavorites}>
										{t('tryAgain')}
									</button>
								</div>
							) : cars.length === 0 ? (
								<EmptyState
									variant="no-favorites"
									title={t('favoritesWillAppear')}
									description={t('favoritesDescription')}
									actionLabel={t('findVehicle')}
									actionHref="/cars-list-1"
								/>
							) : (
								<div className="row g-4">
									{cars.map((car) => (
										<div key={car._id} className="col-md-6 col-lg-4">
											<div className="card h-100 border shadow-sm">
												<div className="position-relative">
													<Link href={`/cars/${car._id}`}>
														<Image
															src={getCarImage(car)}
															alt={car.name || `${car.brand} ${car.model}`}
															width={300}
															height={200}
															className="card-img-top"
															style={{ objectFit: 'cover', height: '180px' }}
														/>
													</Link>
													<button
														className="btn btn-sm btn-danger position-absolute"
														style={{ top: '10px', right: '10px' }}
														onClick={() => removeFavorite(car._id)}
														disabled={removing === car._id}
													>
														{removing === car._id ? (
															<span className="spinner-border spinner-border-sm" />
														) : (
															'❤️'
														)}
													</button>
												</div>
												<div className="card-body">
													<h6 className="card-title mb-1">
														<Link href={`/cars/${car._id}`} className="text-decoration-none text-dark">
															{car.brand} {car.model} {car.year}
														</Link>
													</h6>
													<div className="d-flex gap-2 mb-2">
														<small className="text-muted">
															<i className="bi bi-gear me-1"></i>
															{car.specifications?.transmission || 'Auto'}
														</small>
														<small className="text-muted">
															<i className="bi bi-fuel-pump me-1"></i>
															{car.specifications?.fuelType || 'Gasoline'}
														</small>
														<small className="text-muted">
															<i className="bi bi-people me-1"></i>
															{car.specifications?.seats || 5}
														</small>
													</div>
													{car.ratings?.overall && (
														<div className="mb-2">
															<span className="text-warning">★</span>
															<small className="ms-1">{car.ratings.overall.toFixed(1)}</small>
														</div>
													)}
													<div className="d-flex justify-content-between align-items-center mt-3">
														<div>
															<strong className="text-primary fs-5">
																R$ {car.pricing?.dailyRate || 0}
															</strong>
															<small className="text-muted">{t('perDay')}</small>
														</div>
														<Link
															href={`/booking/${car._id}`}
															className="btn btn-sm btn-primary"
														>
															{t('book')}
														</Link>
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
