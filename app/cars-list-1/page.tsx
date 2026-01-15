'use client'
import { useState, useEffect, Suspense, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import CarCard1 from '@/components/elements/carcard/CarCard1'
import HeroSearch from '@/components/elements/HeroSearch'
import SortCarsFilter from '@/components/elements/SortCarsFilter'
import ByAmenities from '@/components/Filter/ByAmenities'
import ByCarType from '@/components/Filter/ByCarType'
import ByFuel from '@/components/Filter/ByFuel'
import ByLocation from '@/components/Filter/ByLocation'
import ByPagination from '@/components/Filter/ByPagination'
import ByPrice from '@/components/Filter/ByPrice'
import ByRating from '@/components/Filter/ByRating'
import Layout from "@/components/layout/Layout"
import useCarFilter, { MongoDBCar } from '@/util/useCarFilter'
import Link from "next/link"
import Marquee from 'react-fast-marquee'

function CarsListContent() {
	const searchParams = useSearchParams()
	const router = useRouter()
	const t = useTranslations('carsList')
	const cityParam = searchParams.get('city')
	const pickupDateParam = searchParams.get('pickupDate')
	const returnDateParam = searchParams.get('returnDate')

	const [cars, setCars] = useState<MongoDBCar[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const fetchCars = useCallback(async () => {
		try {
			setLoading(true)
			const params = new URLSearchParams()
			params.set('limit', '100')
			if (cityParam) {
				params.set('city', cityParam)
			}

			const response = await fetch(`/api/cars?${params.toString()}`)
			if (!response.ok) {
				throw new Error('Failed to fetch cars')
			}
			const data = await response.json()
			setCars(data.cars || [])
		} catch (err) {
			console.error('Error fetching cars:', err)
			setError('Erro ao carregar veículos')
		} finally {
			setLoading(false)
		}
	}, [cityParam])

	useEffect(() => {
		fetchCars()
	}, [fetchCars])

	const {
		filter,
		setFilter,
		sortCriteria,
		setSortCriteria,
		itemsPerPage,
		setItemsPerPage,
		currentPage,
		setCurrentPage,
		uniqueNames,
		uniqueFuelTypes,
		uniqueAmenities,
		uniqueLocations,
		uniqueRatings,
		uniqueCarTypes,
		filteredCars,
		sortedCars,
		totalPages,
		startIndex,
		endIndex,
		paginatedCars,
		handleCheckboxChange,
		handleSortChange,
		handlePriceRangeChange,
		handleItemsPerPageChange,
		handlePageChange,
		handlePreviousPage,
		handleNextPage,
		handleClearFilters,
		startItemIndex,
		endItemIndex,
	} = useCarFilter(cars, { initialLocation: cityParam || undefined })

	// Função customizada para limpar filtros E parâmetros da URL
	const handleClearAllFilters = () => {
		handleClearFilters()
		router.push('/cars-list-1')
	}

	return (
		<>
			<Layout footerStyle={1}>
				<div>
					<div className="page-header-2 pt-30 background-body">
						<div className="custom-container position-relative mx-auto">
							<div className="bg-overlay rounded-12 overflow-hidden">
								<img className="w-100 h-100 img-fluid img-banner" src="/assets/imgs/page-header/banner6.png" alt="Navegar Sistemas" />
							</div>
							<div className="container position-absolute z-1 top-50 start-50 pb-70 translate-middle text-center">
								<span className="text-sm-bold bg-2 px-4 py-3 rounded-12">{t('banner.tag')}</span>
								<h2 className="text-white mt-4">{t('banner.title')}</h2>
								<span className="text-white text-lg-medium">{t('banner.subtitle')}</span>
							</div>
							<div className="background-body position-absolute z-1 top-100 start-50 translate-middle px-3 py-2 rounded-12 border d-flex gap-3 d-none d-none d-md-flex">
								<Link href="/" className="neutral-700 text-md-medium">{t('breadcrumb.home')}</Link>
								<span>
									<img src="/assets/imgs/template/icons/arrow-right.svg" alt="Navegar Sistemas" />
								</span>
								<Link href="/cars-list-1" className="neutral-1000 text-md-bold">{t('breadcrumb.carListing')}</Link>
							</div>
						</div>
					</div>
					{/* search 1 */}
					<section className="box-section box-search-advance-home10 background-body">
						<div className="container">
							<div className="box-search-advance background-card wow fadeIn">
								<div className="box-top-search">
									<div className="right-top-search d-none d-md-flex ms-auto">
										<Link className="text-sm-medium need-some-help" href="/contact">{t('needHelp')}</Link>
									</div>
								</div>
								<HeroSearch />
							</div>
						</div>
					</section>
					{/* cars-listing-1 */}
					<section className="section-box pt-50 background-body">
						<div className="container">
							<div className="row align-items-end">
								<div className="col-md-9 mb-30 wow fadeInUp">
									<h4 className="title-svg neutral-1000 mb-15">{t('fleet.title')}</h4>
									<p className="text-lg-medium text-bold neutral-500">{t('fleet.subtitle')}</p>
								</div>
							</div>
						</div>
					</section>
					<section className="box-section block-content-tourlist background-body">
						<div className="container">
							<div className="box-content-main pt-20">
								<div className="content-right">
									<div className="box-filters mb-25 pb-5 border-bottom border-1">
										<SortCarsFilter
											sortCriteria={sortCriteria}
											handleSortChange={handleSortChange}
											itemsPerPage={itemsPerPage}
											handleItemsPerPageChange={handleItemsPerPageChange}
											handleClearFilters={handleClearAllFilters}
											startItemIndex={startItemIndex}
											endItemIndex={endItemIndex}
											sortedCars={sortedCars}
										/>
									</div>
									<div className="box-grid-tours wow fadeIn">
										{loading ? (
											<div className="text-center py-5">
												<div className="spinner-border text-primary" role="status">
													<span className="visually-hidden">{t('loadingGeneric')}</span>
												</div>
												<p className="mt-3">{t('loading')}</p>
											</div>
										) : error ? (
											<div className="alert alert-danger text-center">
												{t('errorLoading')}
												<button className="btn btn-sm btn-primary ms-3" onClick={fetchCars}>
													{t('tryAgain')}
												</button>
											</div>
										) : paginatedCars.length === 0 ? (
											<div className="text-center py-5">
												<h5>{t('noVehicles')}</h5>
												<p className="text-muted">{t('adjustFilters')}</p>
											</div>
										) : (
											<div className="row">
												{paginatedCars.map((car: any) => (
													<div className="col-lg-4 col-md-6 wow fadeInUp" key={car._id || car.id}>
														<CarCard1 car={car} />
													</div>
												))}
											</div>
										)}
									</div>
									{!loading && paginatedCars.length > 0 && (
										<ByPagination
											handlePreviousPage={handlePreviousPage}
											totalPages={totalPages}
											currentPage={currentPage}
											handleNextPage={handleNextPage}
											handlePageChange={handlePageChange}
										/>
									)}
								</div>
								<div className="content-left order-lg-first">
									<div className="sidebar-left border-1 background-body">
										<div className="box-filters-sidebar">
											<div className="block-filter border-1">
												<h6 className="text-lg-bold item-collapse neutral-1000">{t('filters.price')}</h6>
												<ByPrice filter={filter} handlePriceRangeChange={handlePriceRangeChange} />
											</div>
										</div>
									</div>
									<div className="sidebar-left border-1 background-body">
										<div className="box-filters-sidebar">
											<div className="block-filter border-1">
												<h6 className="text-lg-bold item-collapse neutral-1000">{t('filters.carType')}</h6>
												<ByCarType
													uniqueCarTypes={uniqueCarTypes}
													filter={filter}
													handleCheckboxChange={handleCheckboxChange}
												/>
											</div>
										</div>
									</div>
									<div className="sidebar-left border-1 background-body">
										<div className="box-filters-sidebar">
											<div className="block-filter border-1">
												<h6 className="text-lg-bold item-collapse neutral-1000">{t('filters.amenities')}</h6>
												<ByAmenities
													uniqueAmenities={uniqueAmenities}
													filter={filter}
													handleCheckboxChange={handleCheckboxChange}
												/>
											</div>
										</div>
									</div>
									<div className="sidebar-left border-1 background-body">
										<div className="box-filters-sidebar">
											<div className="block-filter border-1">
												<h6 className="text-lg-bold item-collapse neutral-1000">{t('filters.fuelType')}</h6>
												<ByFuel
													uniqueFuelTypes={uniqueFuelTypes}
													filter={filter}
													handleCheckboxChange={handleCheckboxChange}
												/>
											</div>
										</div>
									</div>
									<div className="sidebar-left border-1 background-body">
										<div className="box-filters-sidebar">
											<div className="block-filter border-1">
												<h6 className="text-lg-bold item-collapse neutral-1000">{t('filters.rating')}</h6>
												<ByRating
													uniqueRatings={uniqueRatings}
													filter={filter}
													handleCheckboxChange={handleCheckboxChange}
												/>
											</div>
										</div>
									</div>
									<div className="sidebar-left border-1 background-body">
										<div className="box-filters-sidebar">
											<div className="block-filter border-1">
												<h6 className="text-lg-bold item-collapse neutral-1000">{t('filters.location')}</h6>
												<ByLocation
													uniqueLocations={uniqueLocations}
													filter={filter}
													handleCheckboxChange={handleCheckboxChange} />
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="background-100 pt-55 pb-55">
							<div className="container">
								<Marquee direction='left' pauseOnHover={true} className="carouselTicker carouselTicker-left box-list-brand-car justify-content-center  wow fadeIn">
									<ul className="carouselTicker__list">
										<li className="carouselTicker__item">
											<div className="item-brand">
												<img className="light-mode" src="/assets/imgs/page/homepage2/lexus.png" alt="Navegar Sistemas" />
												<img className="dark-mode" src="/assets/imgs/page/homepage2/lexus-w.png" alt="Navegar Sistemas" />
											</div>
										</li>
										<li className="carouselTicker__item">
											<div className="item-brand">
												<img className="light-mode" src="/assets/imgs/page/homepage2/mer.png" alt="Navegar Sistemas" />
												<img className="dark-mode" src="/assets/imgs/page/homepage2/mer-w.png" alt="Navegar Sistemas" />
											</div>
										</li>
										<li className="carouselTicker__item">
											<div className="item-brand">
												<img className="light-mode" src="/assets/imgs/page/homepage2/bugatti.png" alt="Navegar Sistemas" />
												<img className="dark-mode" src="/assets/imgs/page/homepage2/bugatti-w.png" alt="Navegar Sistemas" />
											</div>
										</li>
										<li className="carouselTicker__item">
											<div className="item-brand">
												<img className="light-mode" src="/assets/imgs/page/homepage2/jaguar.png" alt="Navegar Sistemas" />
												<img className="dark-mode" src="/assets/imgs/page/homepage2/jaguar-w.png" alt="Navegar Sistemas" />
											</div>
										</li>
										<li className="carouselTicker__item">
											<div className="item-brand">
												<img className="light-mode" src="/assets/imgs/page/homepage2/honda.png" alt="Navegar Sistemas" />
												<img className="dark-mode" src="/assets/imgs/page/homepage2/honda-w.png" alt="Navegar Sistemas" />
											</div>
										</li>
										<li className="carouselTicker__item">
											<div className="item-brand">
												<img className="light-mode" src="/assets/imgs/page/homepage2/chevrolet.png" alt="Navegar Sistemas" />
												<img className="dark-mode" src="/assets/imgs/page/homepage2/chevrolet-w.png" alt="Navegar Sistemas" />
											</div>
										</li>
										<li className="carouselTicker__item">
											<div className="item-brand">
												<img className="light-mode" src="/assets/imgs/page/homepage2/acura.png" alt="Navegar Sistemas" />
												<img className="dark-mode" src="/assets/imgs/page/homepage2/acura-w.png" alt="Navegar Sistemas" />
											</div>
										</li>
										<li className="carouselTicker__item">
											<div className="item-brand">
												<img className="light-mode" src="/assets/imgs/page/homepage2/bmw.png" alt="Navegar Sistemas" />
												<img className="dark-mode" src="/assets/imgs/page/homepage2/bmw-w.png" alt="Navegar Sistemas" />
											</div>
										</li>
										<li className="carouselTicker__item">
											<div className="item-brand">
												<img className="light-mode" src="/assets/imgs/page/homepage2/toyota.png" alt="Navegar Sistemas" />
												<img className="dark-mode" src="/assets/imgs/page/homepage2/toyota-w.png" alt="Navegar Sistemas" />
											</div>
										</li>
										<li className="carouselTicker__item">
											<div className="item-brand">
												<img className="light-mode" src="/assets/imgs/page/homepage2/lexus.png" alt="Navegar Sistemas" />
												<img className="dark-mode" src="/assets/imgs/page/homepage2/lexus-w.png" alt="Navegar Sistemas" />
											</div>
										</li>
										<li className="carouselTicker__item">
											<div className="item-brand">
												<img className="light-mode" src="/assets/imgs/page/homepage2/mer.png" alt="Navegar Sistemas" />
												<img className="dark-mode" src="/assets/imgs/page/homepage2/mer-w.png" alt="Navegar Sistemas" />
											</div>
										</li>
										<li className="carouselTicker__item">
											<div className="item-brand">
												<img className="light-mode" src="/assets/imgs/page/homepage2/bugatti.png" alt="Navegar Sistemas" />
												<img className="dark-mode" src="/assets/imgs/page/homepage2/bugatti-w.png" alt="Navegar Sistemas" />
											</div>
										</li>
									</ul>
								</Marquee>
							</div>
						</div>
					</section>
				</div >

			</Layout >
		</>
	)
}

export default function CarsList1() {
	return (
		<Suspense fallback={
			<div className="text-center py-5">
				<div className="spinner-border text-primary" role="status">
					<span className="visually-hidden">Loading...</span>
				</div>
				<p className="mt-3">Carregando...</p>
			</div>
		}>
			<CarsListContent />
		</Suspense>
	)
}
