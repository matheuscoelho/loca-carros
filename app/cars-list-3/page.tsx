'use client'
import { useState, useEffect } from 'react'
import CarCard1 from '@/components/elements/carcard/CarCard1'
import HeroSearch from '@/components/elements/HeroSearch'
import SortCarsFilter from '@/components/elements/SortCarsFilter'
import ByPagination from '@/components/Filter/ByPagination'
import Layout from "@/components/layout/Layout"
import useCarFilter, { MongoDBCar } from '@/util/useCarFilter'
import Link from "next/link"
import Marquee from 'react-fast-marquee'

export default function CarsList3() {
	const [cars, setCars] = useState<MongoDBCar[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		fetchCars()
	}, [])

	const fetchCars = async () => {
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
	}

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
								<img className="w-100 h-100 img-fluid img-banner" src="/assets/imgs/page-header/banner6.png" alt="Carento" />
							</div>
							<div className="container position-absolute z-1 top-50 start-50 pb-70 translate-middle text-center">
								<span className="text-sm-bold bg-2 px-4 py-3 rounded-12">Find cars for sale and for rent near you</span>
								<h2 className="text-white mt-4">Locate the Car That Fits You Best</h2>
								<span className="text-white text-lg-medium">Search and find your best car rental with easy way</span>
							</div>
							<div className="background-body position-absolute z-1 top-100 start-50 translate-middle px-3 py-2 rounded-12 border d-flex gap-3 d-none d-none d-md-flex">
								<Link href="/" className="neutral-700 text-md-medium">Home</Link>
								<span>
									<img src="/assets/imgs/template/icons/arrow-right.svg" alt="Carento" />
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
									<div className="box-grid-tours wow fadeIn">
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
													<div className="col-lg-4 col-md-6" key={car._id || car.id}>
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
								<div className="content-left order-lg-first d-none">
									{/* Sidebar hidden in this layout */}
								</div>
							</div>
						</div>
						<div className="background-100 pt-55 pb-55">
							<div className="container">
								<Marquee direction='left' pauseOnHover={true} className="carouselTicker carouselTicker-left box-list-brand-car justify-content-center  wow fadeIn">
									<ul className="carouselTicker__list">
										<li className="carouselTicker__item">
											<div className="item-brand">
												<img className="light-mode" src="/assets/imgs/page/homepage2/lexus.png" alt="Carento" />
												<img className="dark-mode" src="/assets/imgs/page/homepage2/lexus-w.png" alt="Carento" />
											</div>
										</li>
										<li className="carouselTicker__item">
											<div className="item-brand">
												<img className="light-mode" src="/assets/imgs/page/homepage2/mer.png" alt="Carento" />
												<img className="dark-mode" src="/assets/imgs/page/homepage2/mer-w.png" alt="Carento" />
											</div>
										</li>
										<li className="carouselTicker__item">
											<div className="item-brand">
												<img className="light-mode" src="/assets/imgs/page/homepage2/bugatti.png" alt="Carento" />
												<img className="dark-mode" src="/assets/imgs/page/homepage2/bugatti-w.png" alt="Carento" />
											</div>
										</li>
										<li className="carouselTicker__item">
											<div className="item-brand">
												<img className="light-mode" src="/assets/imgs/page/homepage2/jaguar.png" alt="Carento" />
												<img className="dark-mode" src="/assets/imgs/page/homepage2/jaguar-w.png" alt="Carento" />
											</div>
										</li>
										<li className="carouselTicker__item">
											<div className="item-brand">
												<img className="light-mode" src="/assets/imgs/page/homepage2/honda.png" alt="Carento" />
												<img className="dark-mode" src="/assets/imgs/page/homepage2/honda-w.png" alt="Carento" />
											</div>
										</li>
										<li className="carouselTicker__item">
											<div className="item-brand">
												<img className="light-mode" src="/assets/imgs/page/homepage2/chevrolet.png" alt="Carento" />
												<img className="dark-mode" src="/assets/imgs/page/homepage2/chevrolet-w.png" alt="Carento" />
											</div>
										</li>
										<li className="carouselTicker__item">
											<div className="item-brand">
												<img className="light-mode" src="/assets/imgs/page/homepage2/acura.png" alt="Carento" />
												<img className="dark-mode" src="/assets/imgs/page/homepage2/acura-w.png" alt="Carento" />
											</div>
										</li>
										<li className="carouselTicker__item">
											<div className="item-brand">
												<img className="light-mode" src="/assets/imgs/page/homepage2/bmw.png" alt="Carento" />
												<img className="dark-mode" src="/assets/imgs/page/homepage2/bmw-w.png" alt="Carento" />
											</div>
										</li>
										<li className="carouselTicker__item">
											<div className="item-brand">
												<img className="light-mode" src="/assets/imgs/page/homepage2/toyota.png" alt="Carento" />
												<img className="dark-mode" src="/assets/imgs/page/homepage2/toyota-w.png" alt="Carento" />
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
