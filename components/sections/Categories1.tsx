'use client'
import Link from "next/link"
import { useTranslations } from 'next-intl'

export default function Categories1() {
	const t = useTranslations('categories')

	return (
		<>

			<section className="section-box background-body py-96">
				<div className="container">
					<div className="row align-items-end mb-40">
						<div className="col-md-8">
							<h3 className="neutral-1000 wow fadeInUp">{t('browseByType')}</h3>
							<p className="text-xl-medium neutral-500 wow fadeInUp">{t('findPerfectRide')}</p>
						</div>
						<div className="col-md-4">
							<div className="d-flex justify-content-md-end mt-md-0 mt-4">
								<Link className="btn btn-primary wow fadeInUp" href="/cars">
									{t('viewMore')}
									<svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M8 15L15 8L8 1M15 8L1 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
									</svg>
								</Link>
							</div>
						</div>
					</div>
					<div className="box-list-populars">
						<div className="row">
							<div className="col-lg-3 col-sm-6">
								<div className="card-popular background-card hover-up wow fadeIn" data-wow-delay="0.1s">
									<div className="card-image">
										<Link className="card-title" href="/cars"><img src="/assets/imgs/categories/categories-1/car-1.png" alt="SUV" /></Link>
									</div>
									<div className="card-info">
										<Link className="card-title" href="/cars">SUV</Link>
										<div className="card-meta">
											<div className="meta-links"><Link href="/cars">{t('vehicles', { count: 24 })}</Link></div>
											<div className="card-button">
												<Link href="/cars">
													<svg width={10} height={10} viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path d="M5.00011 9.08347L9.08347 5.00011L5.00011 0.916748M9.08347 5.00011L0.916748 5.00011" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
													</svg>
												</Link>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="col-lg-3 col-sm-6">
								<div className="card-popular background-card hover-up wow fadeIn" data-wow-delay="0.2s">
									<div className="card-image">
										<Link className="card-title" href="/cars"><img src="/assets/imgs/categories/categories-1/car-2.png" alt="Hatchback" /></Link>
									</div>
									<div className="card-info">
										<Link className="card-title" href="/cars">Hatchback</Link>
										<div className="card-meta">
											<div className="meta-links"><Link href="/cars">{t('vehicles', { count: 16 })}</Link></div>
											<div className="card-button">
												<Link href="/cars">
													<svg width={10} height={10} viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path d="M5.00011 9.08347L9.08347 5.00011L5.00011 0.916748M9.08347 5.00011L0.916748 5.00011" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
													</svg>
												</Link>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="col-lg-3 col-sm-6">
								<div className="card-popular background-card hover-up wow fadeIn" data-wow-delay="0.3s">
									<div className="card-image">
										<Link className="card-title" href="/cars"><img src="/assets/imgs/categories/categories-1/car-3.png" alt="Sedan" /></Link>
									</div>
									<div className="card-info">
										<Link className="card-title" href="/cars">Sedan</Link>
										<div className="card-meta">
											<div className="meta-links"><Link href="/cars">{t('vehicles', { count: 150 })}</Link></div>
											<div className="card-button">
												<Link href="/cars">
													<svg width={10} height={10} viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path d="M5.00011 9.08347L9.08347 5.00011L5.00011 0.916748M9.08347 5.00011L0.916748 5.00011" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
													</svg>
												</Link>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="col-lg-3 col-sm-6">
								<div className="card-popular background-card hover-up wow fadeIn" data-wow-delay="0.4s">
									<div className="card-image">
										<Link className="card-title" href="/cars"><img src="/assets/imgs/categories/categories-1/car-4.png" alt="Crossover" /></Link>
									</div>
									<div className="card-info">
										<Link className="card-title" href="/cars">Crossover</Link>
										<div className="card-meta">
											<div className="meta-links"><Link href="/cars">{t('vehicles', { count: 25 })}</Link></div>
											<div className="card-button">
												<Link href="/cars">
													<svg width={10} height={10} viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path d="M5.00011 9.08347L9.08347 5.00011L5.00011 0.916748M9.08347 5.00011L0.916748 5.00011" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
													</svg>
												</Link>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="col-lg-3 col-sm-6">
								<div className="card-popular background-card hover-up wow fadeIn" data-wow-delay="0.1s">
									<div className="card-image">
										<Link className="card-title" href="/cars"><img src="/assets/imgs/categories/categories-1/car-5.png" alt="Minivan" /></Link>
									</div>
									<div className="card-info">
										<Link className="card-title" href="/cars">Minivan</Link>
										<div className="card-meta">
											<div className="meta-links"><Link href="/cars">{t('vehicles', { count: 56 })}</Link></div>
											<div className="card-button">
												<Link href="/cars">
													<svg width={10} height={10} viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path d="M5.00011 9.08347L9.08347 5.00011L5.00011 0.916748M9.08347 5.00011L0.916748 5.00011" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
													</svg>
												</Link>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="col-lg-3 col-sm-6">
								<div className="card-popular background-card hover-up wow fadeIn" data-wow-delay="0.2s">
									<div className="card-image">
										<Link className="card-title" href="/cars"><img src="/assets/imgs/categories/categories-1/car-6.png" alt="Cupê" /></Link>
									</div>
									<div className="card-info">
										<Link className="card-title" href="/cars">Cupê</Link>
										<div className="card-meta">
											<div className="meta-links"><Link href="/cars">{t('vehicles', { count: 25 })}</Link></div>
											<div className="card-button">
												<Link href="/cars">
													<svg width={10} height={10} viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path d="M5.00011 9.08347L9.08347 5.00011L5.00011 0.916748M9.08347 5.00011L0.916748 5.00011" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
													</svg>
												</Link>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="col-lg-3 col-sm-6">
								<div className="card-popular background-card hover-up wow fadeIn" data-wow-delay="0.3s">
									<div className="card-image">
										<Link className="card-title" href="/cars"><img src="/assets/imgs/categories/categories-1/car-7.png" alt="Esportivos" /></Link>
									</div>
									<div className="card-info">
										<Link className="card-title" href="/cars">{t('sportCars')}</Link>
										<div className="card-meta">
											<div className="meta-links"><Link href="/cars">{t('vehicles', { count: 125 })}</Link></div>
											<div className="card-button">
												<Link href="/cars">
													<svg width={10} height={10} viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path d="M5.00011 9.08347L9.08347 5.00011L5.00011 0.916748M9.08347 5.00011L0.916748 5.00011" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
													</svg>
												</Link>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="col-lg-3 col-sm-6">
								<div className="card-popular background-card hover-up wow fadeIn" data-wow-delay="0.4s">
									<div className="card-image">
										<Link className="card-title" href="/cars"><img src="/assets/imgs/categories/categories-1/car-8.png" alt="Picape" /></Link>
									</div>
									<div className="card-info">
										<Link className="card-title" href="/cars">{t('pickupTruck')}</Link>
										<div className="card-meta">
											<div className="meta-links"><Link href="/cars">{t('vehicles', { count: 30 })}</Link></div>
											<div className="card-button">
												<Link href="/cars">
													<svg width={10} height={10} viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path d="M5.00011 9.08347L9.08347 5.00011L5.00011 0.916748M9.08347 5.00011L0.916748 5.00011" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
													</svg>
												</Link>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	)
}
