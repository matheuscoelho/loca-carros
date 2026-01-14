'use client'
import Link from "next/link"
import { useTranslations } from 'next-intl'

export default function Banners() {
	const t = useTranslations('banners')

	return (
		<>

			<section className="section-box background-body">
				<div className="container">
					<div className="row">
						<div className="col-lg-6">
							<div className="box-banner-1 background-6 px-5 pt-40 position-relative rounded-12 overflow-hidden">
								<div className="banner-images wow fadeIn">
									<img className="position-absolute bottom-0 end-0" src="/assets/imgs/banners/banners-1/img-1.png" alt="Carento" />
								</div>
								<div className="banner-info">
									<div className="banner-title wow fadeInDown">
										<h5>{t('lookingForCar')}</h5>
									</div>
									<p className="banner-text text-md-regular py-3 wow fadeInUp">
										{t('discoverIdealCar')}
									</p>
									<div className="banner-button pb-70 pt-3">
										<Link className="btn btn-primary background-brand-2 wow fadeInUp" href="/cars">
											{t('getStarted')}
											<svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path d="M8 15L15 8L8 1M15 8L1 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
											</svg>
										</Link>
									</div>
								</div>
							</div>
						</div>
						<div className="col-lg-6">
							<div className="box-banner-1 background-5 px-5 pt-40 position-relative rounded-12 mt-lg-0 mt-4 overflow-hidden">
								<div className="banner-images wow fadeIn">
									<img className="position-absolute bottom-0 end-0" src="/assets/imgs/banners/banners-1/img-2.png" alt="Carento" />
								</div>
								<div className="banner-info">
									<div className="banner-title wow fadeInDown">
										<h5>{t('lookingForCar')}</h5>
									</div>
									<p className="banner-text text-md-regular py-3 wow fadeInUp">
										{t('maximizePotential')}
									</p>
									<div className="banner-button pb-70 pt-3">
										<Link className="btn btn-primary bg-white wow fadeInUp" href="/cars">
											{t('getStarted')}
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
			</section>
		</>
	)
}
