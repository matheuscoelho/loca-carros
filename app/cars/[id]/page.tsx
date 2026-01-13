'use client'
import MyDatePicker from '@/components/elements/MyDatePicker'
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import Marquee from 'react-fast-marquee'
import ModalVideo from 'react-modal-video'
import Slider from "react-slick"
import FavoriteButton from '@/components/elements/FavoriteButton'

const SlickArrowLeft = ({ currentSlide, slideCount, ...props }: any) => (
	<button
		{...props}
		className={
			"slick-prev slick-arrow" +
			(currentSlide === 0 ? " slick-disabled" : "")
		}
		type="button"
	>
		<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M7.99992 3.33325L3.33325 7.99992M3.33325 7.99992L7.99992 12.6666M3.33325 7.99992H12.6666" stroke="" strokeLinecap="round" strokeLinejoin="round"></path></svg>
	</button>
)
const SlickArrowRight = ({ currentSlide, slideCount, ...props }: any) => (
	<button
		{...props}
		className={
			"slick-next slick-arrow" +
			(currentSlide === slideCount - 1 ? " slick-disabled" : "")
		}
		type="button"
	>
		<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M7.99992 12.6666L12.6666 7.99992L7.99992 3.33325M12.6666 7.99992L3.33325 7.99992" stroke="" strokeLinecap="round" strokeLinejoin="round"> </path></svg>
	</button>
)

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
	description?: string
	fleetCode?: string
	specs: {
		seats: number
		doors: number
		bags: number
		mileage: number
	}
	pricing: {
		dailyRate: number
		weeklyRate?: number
		deposit: number
		currency: string
	}
	extras: Array<{ name: string; price: number }>
	amenities: string[]
	images: Array<{ url: string; isPrimary: boolean }>
	thumbnails?: string[]
	location: { city: string; state: string; country: string }
	availability: { isAvailable: boolean }
	rating: number
	reviewCount: number
	ratings?: {
		overall: number
		price: number
		service: number
		safety: number
		comfort: number
		cleanliness: number
	}
	includedInPrice?: string[]
	faq?: Array<{ question: string; answer: string }>
	reviews?: Array<{ author: string; avatar: string; date: string; rating: number; comment: string }>
	dealer?: { name: string; phone: string; email: string; whatsapp: string; location: string }
}

export default function CarDetails({ params }: { params: { id: string } }) {
	const router = useRouter()
	const [isOpen, setOpen] = useState(false)
	const [nav1, setNav1] = useState(null)
	const [nav2, setNav2] = useState(null)
	const [slider1, setSlider1] = useState(null)
	const [slider2, setSlider2] = useState(null)
	const [car, setCar] = useState<Car | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		setNav1(slider1)
		setNav2(slider2)
	}, [slider2, slider1])

	useEffect(() => {
		fetchCar()
	}, [params.id])

	const fetchCar = async () => {
		try {
			setLoading(true)
			const response = await fetch(`/api/cars/${params.id}`)
			if (!response.ok) throw new Error('Car not found')
			const data = await response.json()
			setCar(data.car)
		} catch (err) {
			setError('Veículo não encontrado')
		} finally {
			setLoading(false)
		}
	}

	const settingsMain = {
		slidesToShow: 1,
		slidesToScroll: 1,
		arrows: true,
		fade: false,
		prevArrow: <SlickArrowLeft />,
		nextArrow: <SlickArrowRight />,
	}

	const settingsThumbs = {
		slidesToShow: 6,
		slidesToScroll: 1,
		asNavFor: nav1,
		dots: false,
		focusOnSelect: true,
		vertical: false,
		responsive: [
			{ breakpoint: 1200, settings: { slidesToShow: 5 } },
			{ breakpoint: 1024, settings: { slidesToShow: 4 } },
			{ breakpoint: 700, settings: { slidesToShow: 3 } },
			{ breakpoint: 480, settings: { slidesToShow: 2 } },
		],
	}

	const [isAccordion, setIsAccordion] = useState<number | null>(null)
	const handleAccordion = (key: number) => {
		setIsAccordion(prevState => prevState === key ? null : key)
	}

	if (loading) {
		return (
			<Layout footerStyle={1}>
				<div className="container pt-140 pb-170">
					<div className="text-center">
						<div className="spinner-border text-primary" role="status">
							<span className="visually-hidden">Carregando...</span>
						</div>
						<p className="mt-3">Carregando detalhes do veículo...</p>
					</div>
				</div>
			</Layout>
		)
	}

	if (error || !car) {
		return (
			<Layout footerStyle={1}>
				<div className="container pt-140 pb-170">
					<div className="text-center">
						<h4>{error || 'Veículo não encontrado'}</h4>
						<Link href="/cars-list-1" className="btn btn-primary mt-3">Voltar</Link>
					</div>
				</div>
			</Layout>
		)
	}

	const locationText = `${car.location?.city || ''}, ${car.location?.country || ''}`

	return (
		<>
			<Layout footerStyle={1}>
				<div>
					<section className="box-section box-breadcrumb background-body">
						<div className="container">
							<ul className="breadcrumbs">
								<li>
									<Link href="/">Home</Link>
									<span className="arrow-right">
										<svg width={7} height={12} viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M1 11L6 6L1 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
										</svg>
									</span>
								</li>
								<li>
									<Link href="/cars-list-1">Cars Rental</Link>
									<span className="arrow-right">
										<svg width={7} height={12} viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M1 11L6 6L1 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
										</svg>
									</span>
								</li>
								<li><span className="text-breadcrumb">{car.brand} {car.model} {car.year}</span></li>
							</ul>
						</div>
					</section>

					<section className="section-box box-banner-home2 background-body">
						<div className="container">
							<div className="container-banner-activities">
								<div className="box-banner-activities">
									<Slider
										{...settingsMain}
										asNavFor={nav2 as any}
										ref={(slider) => setSlider1(slider as any)}
										className="banner-activities-detail">
										{car.images?.map((img, idx) => (
											<div key={idx} className="banner-slide-activity">
												<img src={img.url} alt={car.name} />
											</div>
										))}
									</Slider>
									<div className="box-button-abs">
										<Link className="btn btn-primary rounded-pill" href="#">
											<svg width={22} height={22} viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path d="M20 8V2.75C20 2.3375 19.6625 2 19.25 2H14C13.5875 2 13.25 2.3375 13.25 2.75V8C13.25 8.4125 13.5875 8.75 14 8.75H19.25C19.6625 8.75 20 8.4125 20 8ZM19.25 0.5C20.495 0.5 21.5 1.505 21.5 2.75V8C21.5 9.245 20.495 10.25 19.25 10.25H14C12.755 10.25 11.75 9.245 11.75 8V2.75C11.75 1.505 12.755 0.5 14 0.5H19.25Z" fill="currentColor" />
												<path d="M20 19.25V14C20 13.5875 19.6625 13.25 19.25 13.25H14C13.5875 13.25 13.25 13.5875 13.25 14V19.25C13.25 19.6625 13.5875 20 14 20H19.25C19.6625 20 20 19.6625 20 19.25ZM19.25 11.75C20.495 11.75 21.5 12.755 21.5 14V19.25C21.5 20.495 20.495 21.5 19.25 21.5H14C12.755 21.5 11.75 20.495 11.75 19.25V14C11.75 12.755 12.755 11.75 14 11.75H19.25Z" fill="currentColor" />
												<path d="M8 8.75C8.4125 8.75 8.75 8.4125 8.75 8V2.75C8.75 2.3375 8.4125 2 8 2H2.75C2.3375 2 2 2.3375 2 2.75V8C2 8.4125 2.3375 8.75 2.75 8.75H8ZM8 0.5C9.245 0.5 10.25 1.505 10.25 2.75V8C10.25 9.245 9.245 10.25 8 10.25H2.75C1.505 10.25 0.5 9.245 0.5 8V2.75C0.5 1.505 1.505 0.5 2.75 0.5H8Z" fill="currentColor" />
												<path d="M8 20C8.4125 20 8.75 19.6625 8.75 19.25V14C8.75 13.5875 8.4125 13.25 8 13.25H2.75C2.3375 13.25 2 13.5875 2 14V19.25C2 19.6625 2.3375 20 2.75 20H8ZM8 11.75C9.245 11.75 10.25 12.755 10.25 14V19.25C10.25 20.495 9.245 21.5 8 21.5H2.75C1.505 21.5 0.5 20.495 0.5 19.25V14C0.5 12.755 1.505 11.75 2.75 11.75H8Z" fill="currentColor" />
											</svg>
											See All Photos
										</Link>
										<a className="btn btn-white-md popup-youtube" onClick={() => setOpen(true)}> <img src="/assets/imgs/page/activities/video.svg" alt="Carento" />Video Clips</a>
									</div>
								</div>
								<div className="slider-thumnail-activities">
									<Slider
										{...settingsThumbs}
										asNavFor={nav1 as any}
										ref={(slider) => setSlider2(slider as any)}
										className="slider-nav-thumbnails-activities-detail">
										{(car.thumbnails || car.images)?.map((thumb, idx) => (
											<div key={idx} className="banner-slide">
												<img src={typeof thumb === 'string' ? thumb : thumb.url} alt={car.name} />
											</div>
										))}
									</Slider>
								</div>
							</div>
						</div>
					</section>

					<section className="box-section box-content-tour-detail background-body">
						<div className="container">
							<div className="tour-header">
								<div className="tour-rate">
									<div className="rate-element">
										<span className="rating">{car.rating?.toFixed(2) || '4.96'} <span className="text-sm-medium neutral-500">({car.reviewCount || 0} reviews)</span></span>
									</div>
								</div>
								<div className="row">
									<div className="col-lg-8">
										<div className="tour-title-main">
											<h4 className="neutral-1000">{car.name}</h4>
										</div>
									</div>
								</div>
								<div className="tour-metas">
									<div className="tour-meta-left">
										<p className="text-md-medium neutral-1000 mr-20 tour-location">
											<svg className="invert" xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16" fill="none">
												<path d="M7.99967 0C4.80452 0 2.20508 2.59944 2.20508 5.79456C2.20508 9.75981 7.39067 15.581 7.61145 15.8269C7.81883 16.0579 8.18089 16.0575 8.38789 15.8269C8.60867 15.581 13.7943 9.75981 13.7943 5.79456C13.7942 2.59944 11.1948 0 7.99967 0ZM7.99967 8.70997C6.39211 8.70997 5.0843 7.40212 5.0843 5.79456C5.0843 4.187 6.39214 2.87919 7.99967 2.87919C9.6072 2.87919 10.915 4.18703 10.915 5.79459C10.915 7.40216 9.6072 8.70997 7.99967 8.70997Z" fill="#101010" />
											</svg>
											{locationText}
										</p>
										<Link className="text-md-medium neutral-1000 mr-30" href="#">Show on map</Link>
										<p className="text-md-medium neutral-1000 tour-code mr-15">
											<svg className="invert" xmlns="http://www.w3.org/2000/svg" width={20} height={18} viewBox="0 0 20 18" fill="none">
												<path fillRule="evenodd" clipRule="evenodd" d="M13.2729 0.273646C13.4097 0.238432 13.5538 0.24262 13.6884 0.28573L18.5284 1.83572L18.5474 1.84209C18.8967 1.96436 19.1936 2.19167 19.4024 2.4875C19.5891 2.75202 19.7309 3.08694 19.7489 3.46434C19.7494 3.47622 19.7497 3.4881 19.7497 3.49998V15.5999C19.7625 15.8723 19.7102 16.1395 19.609 16.3754C19.6059 16.3827 19.6026 16.39 19.5993 16.3972C19.476 16.6613 19.3017 16.8663 19.1098 17.0262C19.1023 17.0324 19.0947 17.0385 19.087 17.0445C18.8513 17.2258 18.5774 17.3363 18.2988 17.3734L18.2927 17.3743C18.0363 17.4063 17.7882 17.3792 17.5622 17.3133C17.5379 17.3081 17.5138 17.3016 17.4901 17.294L13.4665 16.0004L6.75651 17.7263C6.62007 17.7614 6.47649 17.7574 6.34221 17.7147L1.47223 16.1647C1.46543 16.1625 1.45866 16.1603 1.45193 16.1579C1.0871 16.0302 0.813939 15.7971 0.613929 15.5356C0.608133 15.528 0.602481 15.5203 0.596973 15.5125C0.395967 15.2278 0.277432 14.8905 0.260536 14.5357C0.259972 14.5238 0.259689 14.5119 0.259689 14.5V2.39007C0.246699 2.11286 0.301239 1.83735 0.420015 1.58283C0.544641 1.31578 0.724533 1.10313 0.942417 0.93553C1.17424 0.757204 1.45649 0.6376 1.7691 0.61312C2.03626 0.583264 2.30621 0.616234 2.56047 0.712834L6.56277 1.99963L13.2729 0.273646Z" fill="#101010" />
											</svg>
											Fleet Code:
										</p>
										<Link className="text-md-medium neutral-1000" href="#">{car.fleetCode || car.licensePlate}</Link>
									</div>
									<div className="tour-meta-right">
										<Link className="btn btn-share" href="#">
											<svg width={16} height={18} viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path d="M13 11.5332C12.012 11.5332 11.1413 12.0193 10.5944 12.7584L5.86633 10.3374C5.94483 10.0698 6 9.79249 6 9.49989C6 9.10302 5.91863 8.72572 5.77807 8.37869L10.7262 5.40109C11.2769 6.04735 12.0863 6.46655 13 6.46655C14.6543 6.46655 16 5.12085 16 3.46655C16 1.81225 14.6543 0.466553 13 0.466553C11.3457 0.466553 10 1.81225 10 3.46655C10 3.84779 10.0785 4.20942 10.2087 4.54515L5.24583 7.53149C4.69563 6.90442 3.8979 6.49989 3 6.49989C1.3457 6.49989 0 7.84559 0 9.49989C0 11.1542 1.3457 12.4999 3 12.4999C4.00433 12.4999 4.8897 11.9996 5.4345 11.2397L10.147 13.6529C10.0602 13.9331 10 14.2249 10 14.5332C10 16.1875 11.3457 17.5332 13 17.5332C14.6543 17.5332 16 16.1875 16 14.5332C16 12.8789 14.6543 11.5332 13 11.5332Z" fill="currentColor" />
											</svg>
											Share
										</Link>
										<FavoriteButton carId={car._id} size="md" className="btn-wishlish" />
									</div>
								</div>
							</div>

							<div className="row mt-30">
								<div className="col-lg-8">
									<div className="box-feature-car">
										<div className="list-feature-car">
											<div className="item-feature-car w-md-25">
												<div className="item-feature-car-inner">
													<div className="feature-image"><img src="/assets/imgs/page/car/km.svg" alt="Carento" /></div>
													<div className="feature-info">
														<p className="text-md-medium neutral-1000">{car.specs?.mileage?.toLocaleString() || '0'} km</p>
													</div>
												</div>
											</div>
											<div className="item-feature-car w-md-25">
												<div className="item-feature-car-inner">
													<div className="feature-image"><img src="/assets/imgs/page/car/diesel.svg" alt="Carento" /></div>
													<div className="feature-info">
														<p className="text-md-medium neutral-1000">{car.fuelType}</p>
													</div>
												</div>
											</div>
											<div className="item-feature-car w-md-25">
												<div className="item-feature-car-inner">
													<div className="feature-image"><img src="/assets/imgs/page/car/auto.svg" alt="Carento" /></div>
													<div className="feature-info">
														<p className="text-md-medium neutral-1000">{car.transmission}</p>
													</div>
												</div>
											</div>
											<div className="item-feature-car w-md-25">
												<div className="item-feature-car-inner">
													<div className="feature-image"><img src="/assets/imgs/page/car/seat.svg" alt="Carento" /></div>
													<div className="feature-info">
														<p className="text-md-medium neutral-1000">{car.specs?.seats || 5} seats</p>
													</div>
												</div>
											</div>
											<div className="item-feature-car w-md-25">
												<div className="item-feature-car-inner">
													<div className="feature-image"><img src="/assets/imgs/page/car/bag.svg" alt="Carento" /></div>
													<div className="feature-info">
														<p className="text-md-medium neutral-1000">{car.specs?.bags || 2} bags</p>
													</div>
												</div>
											</div>
											<div className="item-feature-car w-md-25">
												<div className="item-feature-car-inner">
													<div className="feature-image"><img src="/assets/imgs/page/car/suv.svg" alt="Carento" /></div>
													<div className="feature-info">
														<p className="text-md-medium neutral-1000">{car.carType}</p>
													</div>
												</div>
											</div>
											<div className="item-feature-car w-md-25">
												<div className="item-feature-car-inner">
													<div className="feature-image"><img src="/assets/imgs/page/car/door.svg" alt="Carento" /></div>
													<div className="feature-info">
														<p className="text-md-medium neutral-1000">{car.specs?.doors || 4} Doors</p>
													</div>
												</div>
											</div>
											<div className="item-feature-car w-md-25">
												<div className="item-feature-car-inner">
													<div className="feature-image"><img src="/assets/imgs/page/car/lit.svg" alt="Carento" /></div>
													<div className="feature-info">
														<p className="text-md-medium neutral-1000">{car.year}</p>
													</div>
												</div>
											</div>
										</div>
									</div>

									<div className="box-collapse-expand">
										{/* Overview */}
										<div className="group-collapse-expand">
											<button className={isAccordion == 1 ? "btn btn-collapse collapsed" : "btn btn-collapse"} type="button" onClick={() => handleAccordion(1)}>
												<h6>Overview</h6>
												<svg width={12} height={7} viewBox="0 0 12 7" xmlns="http://www.w3.org/2000/svg">
													<path d="M1 1L6 6L11 1" stroke="" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
												</svg>
											</button>
											<div className={isAccordion == 1 ? "collapse" : "collapse show"} id="collapseOverview">
												<div className="card card-body">
													{car.description?.split('\n\n').map((paragraph, idx) => (
														<p key={idx}>{paragraph}</p>
													)) || (
														<p>Experience exceptional comfort and performance with the {car.brand} {car.model}. This {car.year} {car.carType} offers a perfect blend of style, efficiency, and reliability for your transportation needs.</p>
													)}
												</div>
											</div>
										</div>

										{/* Included in the price */}
										<div className="group-collapse-expand">
											<button className={isAccordion == 2 ? "btn btn-collapse collapsed" : "btn btn-collapse"} type="button" onClick={() => handleAccordion(2)}>
												<h6>Included in the price</h6>
												<svg width={12} height={7} viewBox="0 0 12 7" xmlns="http://www.w3.org/2000/svg">
													<path d="M1 1L6 6L11 1" stroke="" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
												</svg>
											</button>
											<div className={isAccordion == 2 ? "collapse" : "collapse show"} id="collapseItinerary">
												<div className="card card-body">
													<ul className="list-checked-green">
														{car.includedInPrice?.map((item, idx) => (
															<li key={idx}>{item}</li>
														)) || (
															<>
																<li>Free cancellation up to 48 hours before pick-up</li>
																<li>Collision Damage Waiver with $700 deductible</li>
																<li>Theft Protection included</li>
																<li>Unlimited mileage</li>
															</>
														)}
													</ul>
												</div>
											</div>
										</div>

										{/* Question & Answers */}
										<div className="group-collapse-expand">
											<button className={isAccordion == 3 ? "btn btn-collapse collapsed" : "btn btn-collapse"} type="button" onClick={() => handleAccordion(3)}>
												<h6>Question & Answers</h6>
												<svg width={12} height={7} viewBox="0 0 12 7" xmlns="http://www.w3.org/2000/svg">
													<path d="M1 1L6 6L11 1" stroke="" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
												</svg>
											</button>
											<div className={isAccordion == 3 ? "collapse" : "collapse show"} id="collapseQuestion">
												<div className="card card-body">
													<div className="list-questions">
														{car.faq?.map((item, idx) => (
															<div key={idx} className="item-question">
																<div className="head-question">
																	<p className="text-md-bold neutral-1000">{item.question}</p>
																</div>
																<div className="content-question">
																	<p className="text-sm-medium neutral-800">{item.answer}</p>
																</div>
															</div>
														)) || (
															<>
																<div className="item-question">
																	<div className="head-question">
																		<p className="text-md-bold neutral-1000">What documents do I need to rent this vehicle?</p>
																	</div>
																	<div className="content-question">
																		<p className="text-sm-medium neutral-800">You will need a valid driver's license, a credit card in your name, and proof of insurance.</p>
																	</div>
																</div>
																<div className="item-question">
																	<div className="head-question">
																		<p className="text-md-bold neutral-1000">Is there an age requirement?</p>
																	</div>
																	<div className="content-question">
																		<p className="text-sm-medium neutral-800">Renters must be at least 21 years old. Drivers under 25 may have an additional surcharge.</p>
																	</div>
																</div>
															</>
														)}
													</div>
												</div>
											</div>
										</div>

										{/* Rate & Reviews */}
										<div className="group-collapse-expand">
											<button className={isAccordion == 4 ? "btn btn-collapse collapsed" : "btn btn-collapse"} type="button" onClick={() => handleAccordion(4)}>
												<h6>Rate & Reviews</h6>
												<svg width={12} height={7} viewBox="0 0 12 7" xmlns="http://www.w3.org/2000/svg">
													<path d="M1 1L6 6L11 1" stroke="" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
												</svg>
											</button>
											<div className={isAccordion == 4 ? "collapse" : "collapse show"} id="collapseReviews">
												<div className="card card-body">
													<div className="head-reviews">
														<div className="review-left">
															<div className="review-info-inner">
																<h6 className="neutral-1000">{(car.ratings?.overall || car.rating || 4.95).toFixed(2)} / 5</h6>
																<p className="text-sm-medium neutral-400">({car.reviewCount || 0} reviews)</p>
																<div className="review-rate">
																	{[...Array(5)].map((_, i) => (
																		<img key={i} src="/assets/imgs/page/tour-detail/star.svg" alt="star" />
																	))}
																</div>
															</div>
														</div>
														<div className="review-right">
															<div className="review-progress">
																<div className="item-review-progress">
																	<div className="text-rv-progress"><p className="text-sm-bold">Price</p></div>
																	<div className="bar-rv-progress">
																		<div className="progress">
																			<div className="progress-bar" style={{ width: `${(car.ratings?.price || 4.5) * 20}%` }}></div>
																		</div>
																	</div>
																	<div className="text-avarage"><p>{(car.ratings?.price || 4.5).toFixed(1)}/5</p></div>
																</div>
																<div className="item-review-progress">
																	<div className="text-rv-progress"><p className="text-sm-bold">Service</p></div>
																	<div className="bar-rv-progress">
																		<div className="progress">
																			<div className="progress-bar" style={{ width: `${(car.ratings?.service || 4.8) * 20}%` }}></div>
																		</div>
																	</div>
																	<div className="text-avarage"><p>{(car.ratings?.service || 4.8).toFixed(1)}/5</p></div>
																</div>
																<div className="item-review-progress">
																	<div className="text-rv-progress"><p className="text-sm-bold">Safety</p></div>
																	<div className="bar-rv-progress">
																		<div className="progress">
																			<div className="progress-bar" style={{ width: `${(car.ratings?.safety || 4.9) * 20}%` }}></div>
																		</div>
																	</div>
																	<div className="text-avarage"><p>{(car.ratings?.safety || 4.9).toFixed(1)}/5</p></div>
																</div>
																<div className="item-review-progress">
																	<div className="text-rv-progress"><p className="text-sm-bold">Comfort</p></div>
																	<div className="bar-rv-progress">
																		<div className="progress">
																			<div className="progress-bar" style={{ width: `${(car.ratings?.comfort || 4.7) * 20}%` }}></div>
																		</div>
																	</div>
																	<div className="text-avarage"><p>{(car.ratings?.comfort || 4.7).toFixed(1)}/5</p></div>
																</div>
																<div className="item-review-progress">
																	<div className="text-rv-progress"><p className="text-sm-bold">Cleanliness</p></div>
																	<div className="bar-rv-progress">
																		<div className="progress">
																			<div className="progress-bar" style={{ width: `${(car.ratings?.cleanliness || 4.9) * 20}%` }}></div>
																		</div>
																	</div>
																	<div className="text-avarage"><p>{(car.ratings?.cleanliness || 4.9).toFixed(1)}/5</p></div>
																</div>
															</div>
														</div>
													</div>
													<div className="list-reviews">
														{car.reviews?.map((review, idx) => (
															<div key={idx} className="item-review">
																<div className="head-review">
																	<div className="author-review">
																		<img src={review.avatar || '/assets/imgs/page/tour-detail/avatar.png'} alt={review.author} />
																		<div className="author-info">
																			<p className="text-lg-bold">{review.author}</p>
																			<p className="text-sm-medium neutral-500">{new Date(review.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
																		</div>
																	</div>
																	<div className="rate-review">
																		{[...Array(review.rating)].map((_, i) => (
																			<img key={i} src="/assets/imgs/page/tour-detail/star-big.svg" alt="star" />
																		))}
																	</div>
																</div>
																<div className="content-review">
																	<p className="text-sm-medium neutral-800">{review.comment}</p>
																</div>
															</div>
														)) || (
															<div className="item-review">
																<div className="head-review">
																	<div className="author-review">
																		<img src="/assets/imgs/page/tour-detail/avatar.png" alt="User" />
																		<div className="author-info">
																			<p className="text-lg-bold">Happy Customer</p>
																			<p className="text-sm-medium neutral-500">January 2026</p>
																		</div>
																	</div>
																	<div className="rate-review">
																		{[...Array(5)].map((_, i) => (
																			<img key={i} src="/assets/imgs/page/tour-detail/star-big.svg" alt="star" />
																		))}
																	</div>
																</div>
																<div className="content-review">
																	<p className="text-sm-medium neutral-800">Excellent vehicle! Very clean and well-maintained. The rental process was smooth and the staff was helpful. Would definitely recommend!</p>
																</div>
															</div>
														)}
													</div>
												</div>
											</div>
										</div>

										{/* Add a review */}
										<div className="group-collapse-expand">
											<button className={isAccordion == 5 ? "btn btn-collapse collapsed" : "btn btn-collapse"} type="button" onClick={() => handleAccordion(5)}>
												<h6>Add a review</h6>
												<svg width={12} height={7} viewBox="0 0 12 7" xmlns="http://www.w3.org/2000/svg">
													<path d="M1 1L6 6L11 1" stroke="" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
												</svg>
											</button>
											<div className={isAccordion == 5 ? "collapse" : "collapse show"} id="collapseAddReview">
												<div className="card card-body">
													<div className="box-form-reviews">
														<h6 className="text-md-bold neutral-1000 mb-15">Leave feedback</h6>
														<div className="row">
															<div className="col-md-6">
																<div className="form-group">
																	<input className="form-control" type="text" placeholder="Your name" />
																</div>
															</div>
															<div className="col-md-6">
																<div className="form-group">
																	<input className="form-control" type="text" placeholder="Email address" />
																</div>
															</div>
															<div className="col-md-12">
																<div className="form-group">
																	<textarea className="form-control" placeholder="Your comment" defaultValue={""} />
																</div>
															</div>
															<div className="col-md-12">
																<button className="btn btn-black-lg-square">Submit review
																	<svg width={16} height={16} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
																		<path d="M8 15L15 8L8 1M15 8L1 8" stroke="" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
																	</svg>
																</button>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>

								{/* Sidebar */}
								<div className="col-lg-4">
									<div className="sidebar-banner">
										<div className="p-4 background-body border rounded-3">
											<p className="text-xl-bold neutral-1000 mb-4">Get Started</p>
											<Link href="#" className="btn btn-primary w-100 rounded-3 py-3 mb-3">
												Schedule Test Drive
												<svg width={17} height={16} viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
													<path d="M8.5 15L15.5 8L8.5 1M15.5 8L1.5 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
												</svg>
											</Link>
											<Link href="#" className="btn btn-book bg-2">
												Make An Offer Price
												<svg width={17} height={16} viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
													<path d="M8.5 15L15.5 8L8.5 1M15.5 8L1.5 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
												</svg>
											</Link>
										</div>
									</div>

									<div className="booking-form">
										<div className="head-booking-form">
											<p className="text-xl-bold neutral-1000">Rent This Vehicle</p>
										</div>
										<div className="content-booking-form">
											<div className="item-line-booking border-bottom-0 pb-0">
												<strong className="text-md-bold neutral-1000">Pick-Up</strong>
												<div className="input-calendar">
													<MyDatePicker form />
												</div>
											</div>
											<div className="item-line-booking">
												<strong className="text-md-bold neutral-1000">Drop-Off</strong>
												<div className="input-calendar">
													<MyDatePicker form />
												</div>
											</div>
											<div className="item-line-booking">
												<div className="box-tickets">
													<strong className="text-md-bold neutral-1000">Add Extra:</strong>
													{car.extras?.map((extra, idx) => (
														<div key={idx} className="line-booking-tickets">
															<div className="item-ticket">
																<ul className="list-filter-checkbox">
																	<li>
																		<label className="cb-container">
																			<input type="checkbox" />
																			<span className="text-md-medium">{extra.name}</span>
																			<span className="checkmark" />
																		</label>
																	</li>
																</ul>
															</div>
															<div className="include-price">
																<p className="text-md-bold neutral-1000">${extra.price?.toFixed(2)}</p>
															</div>
														</div>
													))}
												</div>
											</div>
											<div className="item-line-booking last-item pb-0">
												<strong className="text-md-medium neutral-1000">Daily Rate</strong>
												<div className="line-booking-right">
													<p className="text-xl-bold neutral-1000">${car.pricing?.dailyRate?.toFixed(2)}/day</p>
												</div>
											</div>
											{car.pricing?.weeklyRate && (
												<div className="item-line-booking last-item pb-0">
													<strong className="text-md-medium neutral-1000">Weekly Rate</strong>
													<div className="line-booking-right">
														<p className="text-xl-bold neutral-1000">${car.pricing.weeklyRate.toFixed(2)}/week</p>
													</div>
												</div>
											)}
											<div className="item-line-booking last-item">
												<strong className="text-md-bold neutral-1000">Security Deposit</strong>
												<div className="line-booking-right">
													<p className="text-xl-bold neutral-1000">${car.pricing?.deposit?.toFixed(2)}</p>
												</div>
											</div>
											<div className="box-button-book">
												<Link className="btn btn-book" href={`/booking/${car._id}`}>
													Book Now
													<svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path d="M8 15L15 8L8 1M15 8L1 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
													</svg>
												</Link>
											</div>
											<div className="box-need-help">
												<Link href="#">
													<svg width={12} height={14} viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path d="M2.83366 3.66667C2.83366 1.92067 4.25433 0.5 6.00033 0.5C7.74633 0.5 9.16699 1.92067 9.16699 3.66667C9.16699 5.41267 7.74633 6.83333 6.00033 6.83333C4.25433 6.83333 2.83366 5.41267 2.83366 3.66667ZM8.00033 7.83333H4.00033C1.88699 7.83333 0.166992 9.55333 0.166992 11.6667C0.166992 12.678 0.988992 13.5 2.00033 13.5H10.0003C11.0117 13.5 11.8337 12.678 11.8337 11.6667C11.8337 9.55333 10.1137 7.83333 8.00033 7.83333Z" fill="currentColor" />
													</svg>
													Need some help?
												</Link>
											</div>
										</div>
									</div>

									<div className="sidebar-left border-1 background-card">
										<h6 className="text-xl-bold neutral-1000">Listed by</h6>
										<div className="box-sidebar-content">
											<div className="box-agent-support border-bottom pb-3 mb-3">
												<div className="card-author">
													<div className="me-2"><img src="/assets/imgs/template/icons/car-1.png" alt="Dealer" /></div>
													<div className="card-author-info">
														<p className="text-lg-bold neutral-1000">{car.dealer?.name || 'Carento Rentals'}</p>
														<p className="text-sm-medium neutral-500">{car.dealer?.location || locationText}</p>
													</div>
												</div>
											</div>
											<div className="box-info-contact">
												<p className="text-md-medium mobile-phone neutral-1000"><span className="text-md-bold">Mobile:</span> {car.dealer?.phone || '1-800-CARENTO'}</p>
												<p className="text-md-medium email neutral-1000"><span className="text-md-bold">Email:</span> {car.dealer?.email || 'contact@carento.com'}</p>
												<p className="text-md-medium whatsapp neutral-1000"><span className="text-md-bold">WhatsApp:</span> {car.dealer?.whatsapp || car.dealer?.phone || '1-800-CARENTO'}</p>
											</div>
											<div className="box-link-bottom">
												<Link className="btn btn-primary py-3 w-100 rounded-3" href="/cars-list-1">
													All items by this dealer
													<svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path d="M8 15L15 8L8 1M15 8L1 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
													</svg>
												</Link>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Brand Marquee */}
						<div className="background-100 pt-55 pb-55 mt-100">
							<div className="container">
								<Marquee direction='left' pauseOnHover={true} className="carouselTicker carouselTicker-left box-list-brand-car justify-content-center wow fadeIn">
									<ul className="carouselTicker__list">
										{['lexus', 'mer', 'bugatti', 'jaguar', 'honda', 'chevrolet', 'acura', 'bmw', 'toyota'].map((brand, idx) => (
											<li key={idx} className="carouselTicker__item">
												<div className="item-brand">
													<img className="light-mode" src={`/assets/imgs/page/homepage2/${brand}.png`} alt={brand} />
													<img className="dark-mode" src={`/assets/imgs/page/homepage2/${brand}-w.png`} alt={brand} />
												</div>
											</li>
										))}
									</ul>
								</Marquee>
							</div>
						</div>
					</section>

					<ModalVideo channel='youtube' isOpen={isOpen} videoId="JXMWOmuR1hU" onClose={() => setOpen(false)} />
				</div>
			</Layout>
		</>
	)
}
