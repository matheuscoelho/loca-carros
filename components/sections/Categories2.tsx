'use client'
import Link from "next/link"
import { useTranslations } from 'next-intl'

export default function Categories2() {
	const t = useTranslations('categories')

	return (
		<>

			<section className="section-box background-body py-96 border-bottom">
				<div className="container">
					<div className="row align-items-end mb-40">
						<div className="col-md-8">
							<h3 className="neutral-1000">{t('browseByType')}</h3>
							<p className="text-xl-medium neutral-500">{t('findPerfectRide')}</p>
						</div>
						<div className="col-md-4">
							<div className="d-flex justify-content-md-end mt-md-0 mt-4">
								<Link className="btn btn-primary" href="/cars">
									{t('viewAll')}
									<svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M8 15L15 8L8 1M15 8L1 8" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
									</svg>
								</Link>
							</div>
						</div>
					</div>
					<div className="box-list-populars">
						<div className="row">
							<div className="col-lg-2 col-md-4 col-sm-4 text-center mb-lg-0 mb-3 wow fadeIn" data-wow-delay="0.1s">
								<div className="card-popular background-100 hover-up position-relative">
									<Link href="/cars" className="card-image border-0"><img src="/assets/imgs/categories/categories-2/cross-over.png" alt="Crossover" /></Link>
									<div className="card-info">
										<div className="card-meta position-absolute top-100 start-50 translate-middle ">
											<div className="meta-links"><Link className="background-0" href="/cars">{t('vehicles', { count: 24 })}</Link></div>
										</div>
									</div>
								</div>
								<Link className="card-title text-lg-bold neutral-1000" href="/cars">Crossover</Link>
							</div>
							<div className="col-lg-2 col-md-4 col-sm-4 text-center mb-lg-0 mb-3 wow fadeIn" data-wow-delay="0.2s">
								<div className="card-popular background-100 hover-up position-relative">
									<Link href="/cars" className="card-image border-0"><img src="/assets/imgs/categories/categories-2/hatchback.png" alt="Hatchback" /></Link>
									<div className="card-info">
										<div className="card-meta position-absolute top-100 start-50 translate-middle ">
											<div className="meta-links"><Link className="background-0" href="/cars">{t('vehicles', { count: 24 })}</Link></div>
										</div>
									</div>
								</div>
								<Link className="card-title text-lg-bold neutral-1000" href="/cars">Hatchback</Link>
							</div>
							<div className="col-lg-2 col-md-4 col-sm-4 text-center mb-lg-0 mb-3 wow fadeIn" data-wow-delay="0.3s">
								<div className="card-popular background-100 hover-up position-relative">
									<Link href="/cars" className="card-image border-0"><img src="/assets/imgs/categories/categories-2/sedan.png" alt="Sedan" /></Link>
									<div className="card-info">
										<div className="card-meta position-absolute top-100 start-50 translate-middle ">
											<div className="meta-links"><Link className="background-0" href="/cars">{t('vehicles', { count: 24 })}</Link></div>
										</div>
									</div>
								</div>
								<Link className="card-title text-lg-bold neutral-1000" href="/cars">Sedan</Link>
							</div>
							<div className="col-lg-2 col-md-4 col-sm-4 text-center mb-lg-0 mb-3 wow fadeIn" data-wow-delay="0.4s">
								<div className="card-popular background-100 hover-up position-relative">
									<Link href="/cars" className="card-image border-0"><img src="/assets/imgs/categories/categories-2/SUV.png" alt="SUV" /></Link>
									<div className="card-info">
										<div className="card-meta position-absolute top-100 start-50 translate-middle ">
											<div className="meta-links"><Link className="background-0" href="/cars">{t('vehicles', { count: 24 })}</Link></div>
										</div>
									</div>
								</div>
								<Link className="card-title text-lg-bold neutral-1000" href="/cars">SUV</Link>
							</div>
							<div className="col-lg-2 col-md-4 col-sm-4 text-center mb-lg-0 mb-3 wow fadeIn" data-wow-delay="0.5s">
								<div className="card-popular background-100 hover-up position-relative">
									<Link href="/cars" className="card-image border-0"><img src="/assets/imgs/categories/categories-2/sport.png" alt="Esportivo" /></Link>
									<div className="card-info">
										<div className="card-meta position-absolute top-100 start-50 translate-middle ">
											<div className="meta-links"><Link className="background-0" href="/cars">{t('vehicles', { count: 24 })}</Link></div>
										</div>
									</div>
								</div>
								<Link className="card-title text-lg-bold neutral-1000" href="/cars">{t('sport')}</Link>
							</div>
							<div className="col-lg-2 col-md-4 col-sm-4 text-center mb-lg-0 mb-3 wow fadeIn" data-wow-delay="0.6s">
								<div className="card-popular background-100 hover-up position-relative">
									<Link href="/cars" className="card-image border-0"><img src="/assets/imgs/categories/categories-2/minivan.png" alt="Minivan" /></Link>
									<div className="card-info">
										<div className="card-meta position-absolute top-100 start-50 translate-middle ">
											<div className="meta-links"><Link className="background-0" href="/cars">{t('vehicles', { count: 24 })}</Link></div>
										</div>
									</div>
								</div>
								<Link className="card-title text-lg-bold neutral-1000" href="/cars">Minivan</Link>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	)
}
