'use client'
import { useState, useEffect, useCallback } from 'react'
import CarCard2 from '@/components/elements/carcard/CarCard2'
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

export default function CarsList4() {
	const [cars, setCars] = useState<MongoDBCar[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const fetchCars = useCallback(async () => {
		try {
			setLoading(true)
			const response = await fetch('/api/cars?limit=100')
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
	}, [])

	useEffect(() => {
		fetchCars()
	}, [fetchCars])

	const {
		filter,
		sortCriteria,
		itemsPerPage,
		currentPage,
		uniqueFuelTypes,
		uniqueAmenities,
		uniqueLocations,
		uniqueRatings,
		uniqueCarTypes,
		sortedCars,
		totalPages,
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
	} = useCarFilter(cars)

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
								<span className="text-sm-bold bg-2 px-4 py-3 rounded-12">Find cars for sale and for rent near you</span>
								<h2 className="text-white mt-4">Uncover Your Dream Ride</h2>
								<span className="text-white text-lg-medium">Search and find your best car rental with easy way</span>
							</div>
							<div className="background-body position-absolute z-1 top-100 start-50 translate-middle px-3 py-2 rounded-12 border d-flex gap-3 d-none d-none d-md-flex">
								<Link href="/" className="neutral-700 text-md-medium">Home</Link>
								<span>
									<img src="/assets/imgs/template/icons/arrow-right.svg" alt="Navegar Sistemas" />
								</span>
								<Link href="#" className="neutral-1000 text-md-bold">Car Listing</Link>
							</div>
						</div>
					</div>
					{/* search 1 */}
					<section className="box-section box-search-advance-home10 background-body">
						<div className="container">
							<div className="box-search-advance background-card wow fadeIn">
								<div className="box-top-search">
									<div className="left-top-search">
										<Link className="category-link text-sm-bold btn-click active" href="#">All cars</Link>
										<Link className="category-link text-sm-bold btn-click" href="#">New cars</Link>
										<Link className="category-link text-sm-bold btn-click" href="#">Used cars</Link>
									</div>
									<div className="right-top-search d-none d-md-flex">
										<Link className="text-sm-medium need-some-help" href="/contact">Need help?</Link>
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
									<h4 className="title-svg neutral-1000 mb-15">Our Vehicle Fleet</h4>
									<p className="text-lg-medium text-bold neutral-500">Turning dreams into reality with versatile vehicles.</p>
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
											handleClearFilters={handleClearFilters}
											startItemIndex={startItemIndex}
											endItemIndex={endItemIndex}
											sortedCars={sortedCars}
										/>
									</div>
									<div className="box-grid-hotels wow fadeIn">
										{loading ? (
											<div className="text-center py-5">
												<div className="spinner-border text-primary" role="status">
													<span className="visually-hidden">Loading...</span>
												</div>
												<p className="mt-3">Carregando veículos...</p>
											</div>
										) : error ? (
											<div className="alert alert-danger text-center">
												{error}
												<button className="btn btn-sm btn-primary ms-3" onClick={fetchCars}>
													Tentar novamente
												</button>
											</div>
										) : paginatedCars.length === 0 ? (
											<div className="text-center py-5">
												<h5>Nenhum veículo encontrado</h5>
												<p className="text-muted">Tente ajustar os filtros</p>
											</div>
										) : (
											<div className="row">
												{paginatedCars.map((car: any) => (
													<div className="col-xl-12 col-lg-12" key={car._id || car.id}>
														<CarCard2 car={car} />
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
												<h6 className="text-lg-bold item-collapse neutral-1000">Show on map</h6>
												<div className="box-collapse scrollFilter mb-15">
													<div className="pt-0">
														<div className="box-map-small">
															<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5249.611419370571!2d2.3406913487788334!3d48.86191519358772!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e18a5f84801%3A0x6eb5daa624bdebd2!2sLes%20Halles%2C%2075001%20Pa%20ri%2C%20Ph%C3%A1p!5e0!3m2!1svi!2s!4v1711728202093!5m2!1svi!2s" width="100%" height={160} style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
									<div className="sidebar-left border-1 background-body">
										<div className="box-filters-sidebar">
											<div className="block-filter border-1">
												<h6 className="text-lg-bold item-collapse neutral-1000">Filter Price </h6>
												<ByPrice filter={filter} handlePriceRangeChange={handlePriceRangeChange} />
											</div>
										</div>
									</div>
									<div className="sidebar-left border-1 background-body">
										<div className="box-filters-sidebar">
											<div className="block-filter border-1">
												<h6 className="text-lg-bold item-collapse neutral-1000">Car type</h6>
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
												<h6 className="text-lg-bold item-collapse neutral-1000">Amenities</h6>
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
												<h6 className="text-lg-bold item-collapse neutral-1000">Fuel Type</h6>
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
												<h6 className="text-lg-bold item-collapse neutral-1000">Review Score </h6>
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
												<h6 className="text-lg-bold item-collapse neutral-1000">Booking Location</h6>
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
